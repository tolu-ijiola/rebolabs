import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a valid source (you can add API key validation here)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerClient()
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

    console.log(`Processing monthly payouts for ${lastMonth}/${lastMonthYear}`)

    // Get all users with earnings >= $100 for the previous month
    const { data: userEarnings, error: earningsError } = await supabase
      .from('analytics')
      .select(`
        publisher_id,
        SUM(revenue_usd) as total_earnings
      `)
      .eq('month', lastMonth)
      .eq('year', lastMonthYear)
      .eq('history_type', 'reward')
      .gte('revenue_usd', 0)
      .group('publisher_id')
      .gte('total_earnings', 100)

    if (earningsError) {
      console.error('Error fetching user earnings:', earningsError)
      return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 })
    }

    if (!userEarnings || userEarnings.length === 0) {
      return NextResponse.json({ 
        message: 'No users eligible for monthly payout',
        processed: 0
      })
    }

    const processedPayouts = []

    for (const earning of userEarnings) {
      try {
        // Check if payout already exists for this user and month
        const { data: existingPayout, error: checkError } = await supabase
          .from('payouts')
          .select('id')
          .eq('user_id', earning.publisher_id)
          .eq('month', lastMonth)
          .eq('year', lastMonthYear)
          .single()

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error(`Error checking existing payout for user ${earning.publisher_id}:`, checkError)
          continue
        }

        if (existingPayout) {
          console.log(`Payout already exists for user ${earning.publisher_id} for ${lastMonth}/${lastMonthYear}`)
          continue
        }

        // Get user's default payment method
        const { data: paymentMethod, error: methodError } = await supabase
          .from('payment_methods')
          .select('id')
          .eq('user_id', earning.publisher_id)
          .eq('is_default', true)
          .single()

        if (methodError) {
          console.error(`No default payment method found for user ${earning.publisher_id}:`, methodError)
          // Create payout without payment method (user needs to add one)
        }

        // Create payout record
        const { data: newPayout, error: payoutError } = await supabase
          .from('payouts')
          .insert({
            user_id: earning.publisher_id,
            amount: parseFloat(earning.total_earnings),
            status: 'pending',
            month: lastMonth,
            year: lastMonthYear,
            payment_method_id: paymentMethod?.id || null,
            admin_notes: 'Automatically generated monthly payout'
          })
          .select()
          .single()

        if (payoutError) {
          console.error(`Error creating payout for user ${earning.publisher_id}:`, payoutError)
          continue
        }

        processedPayouts.push({
          user_id: earning.publisher_id,
          amount: earning.total_earnings,
          payout_id: newPayout.id
        })

        console.log(`Created payout for user ${earning.publisher_id}: $${earning.total_earnings}`)

      } catch (error) {
        console.error(`Error processing payout for user ${earning.publisher_id}:`, error)
        continue
      }
    }

    // Log the cron job execution
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        action: 'monthly_payouts_cron',
        details: {
          month: lastMonth,
          year: lastMonthYear,
          processed_count: processedPayouts.length,
          total_amount: processedPayouts.reduce((sum, p) => sum + parseFloat(p.amount), 0)
        },
        user_id: null, // System action
        ip_address: request.ip || '127.0.0.1'
      })

    if (logError) {
      console.error('Error logging cron job execution:', logError)
    }

    return NextResponse.json({
      message: 'Monthly payouts processed successfully',
      processed: processedPayouts.length,
      payouts: processedPayouts,
      period: `${lastMonth}/${lastMonthYear}`
    })

  } catch (error) {
    console.error('Error in monthly payouts cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Allow GET requests for testing (remove in production)
export async function GET() {
  return NextResponse.json({ 
    message: 'Monthly payouts cron endpoint',
    note: 'Use POST with proper authorization to trigger the job'
  })
}
