import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_LENGTH = { name: 100, email: 254, subject: 200, message: 5000 }

// Escape user-supplied values before interpolating them into the HTML email
// so a crafted message can't inject markup into the recipient's mail client.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function isRateLimited(ip: string, email: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  // Two separate .eq() queries instead of a string-built .or() filter,
  // so user input can never alter the PostgREST filter expression.
  const [byIp, byEmail] = await Promise.all([
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', oneHourAgo),
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', oneHourAgo),
  ])

  return (byIp.count ?? 0) >= 5 || (byEmail.count ?? 0) >= 5
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const body = await request.json()
    const { name, email, subject, category, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (
      name.length > MAX_LENGTH.name ||
      email.length > MAX_LENGTH.email ||
      subject.length > MAX_LENGTH.subject ||
      message.length > MAX_LENGTH.message
    ) {
      return NextResponse.json(
        { error: 'One or more fields exceed the maximum allowed length' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (await isRateLimited(ip, email)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        category: category || 'general',
        message,
        ip_address: ip,
        status: 'unread',
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Failed to save contact message to DB:', dbError)
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `[ReboLabs Contact] ${subject.replace(/[\r\n]/g, ' ')}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Category:</strong> ${escapeHtml(String(category || 'General'))}</p>
              <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            </div>
            <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #333;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
            </div>
          </div>
        `,
      }

      try {
        await transporter.sendMail(mailOptions)
      } catch (emailError) {
        console.error('Failed to send contact email:', emailError)
      }
    }

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
