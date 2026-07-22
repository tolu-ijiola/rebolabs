import { NextRequest, NextResponse } from 'next/server'

// Automatic payment processing is disabled.
// Payments are managed manually through the admin dashboard at /admin/payments.
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: 'Automatic payment processing is disabled. Payments are handled manually via the admin panel.' },
    { status: 503 }
  )
}