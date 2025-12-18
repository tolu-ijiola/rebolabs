import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a valid source (you can add API key validation here)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting monthly payment processing...')

    // Get current month and year
    const now = new Date()
    const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' })
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthString = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

    // Get all users with earnings >= $100 for the last month
    const { data: userEarnings, error: earningsError } = await supabase
      .from('analytics')
      .select(`
        publisher_id,
        revenue_usd,
        revenue_app_currency,
        users!inner (
          id,
          email,
          full_name,
          is_banned
        )
      `)
      .gte('full_date', lastMonth.toISOString().split('T')[0])
      .lt('full_date', now.toISOString().split('T')[0])
      .eq('history_type', 'reward')
      .eq('users.is_banned', false)

    if (earningsError) {
      console.error('Error fetching user earnings:', earningsError)
      return NextResponse.json({ error: 'Failed to fetch user earnings' }, { status: 500 })
    }

    // Group earnings by user
    const userEarningsMap = new Map()
    userEarnings?.forEach(earning => {
      const userId = earning.publisher_id
      if (!userEarningsMap.has(userId)) {
        userEarningsMap.set(userId, {
          user: earning.users,
          totalRevenueUSD: 0,
          totalRevenueAppCurrency: 0,
          reconciliation: 0
        })
      }
      
      const userData = userEarningsMap.get(userId)
      userData.totalRevenueUSD += earning.revenue_usd || 0
      userData.totalRevenueAppCurrency += earning.revenue_app_currency || 0
    })

    // Get reconciliation amounts
    const { data: reconciliationData, error: reconciliationError } = await supabase
      .from('analytics')
      .select('publisher_id, revenue_usd, revenue_app_currency')
      .gte('full_date', lastMonth.toISOString().split('T')[0])
      .lt('full_date', now.toISOString().split('T')[0])
      .eq('history_type', 'reconciliation')

    if (reconciliationError) {
      console.error('Error fetching reconciliation data:', reconciliationError)
    } else {
      reconciliationData?.forEach(reconciliation => {
        const userId = reconciliation.publisher_id
        if (userEarningsMap.has(userId)) {
          const userData = userEarningsMap.get(userId)
          userData.reconciliation += Math.abs(reconciliation.revenue_usd || 0)
        }
      })
    }

    // Filter users with earnings >= $100
    const eligibleUsers = Array.from(userEarningsMap.entries())
      .filter(([userId, data]) => data.totalRevenueUSD >= 100)
      .map(([userId, data]) => ({ userId, ...data }))

    console.log(`Found ${eligibleUsers.length} users eligible for monthly payments`)

    const processedPayouts = []

    for (const userData of eligibleUsers) {
      try {
        // Get user's default payment method
        const { data: paymentMethod, error: paymentMethodError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', userData.userId)
          .eq('is_default', true)
          .single()

        if (paymentMethodError || !paymentMethod) {
          console.log(`No default payment method found for user ${userData.userId}`)
          continue
        }

        // Calculate final payout (revenue - reconciliation)
        const finalPayout = userData.totalRevenueUSD - userData.reconciliation

        if (finalPayout <= 0) {
          console.log(`User ${userData.userId} has no payout after reconciliation`)
          continue
        }

        // Check if payout already exists for this month
        const { data: existingPayout, error: existingPayoutError } = await supabase
          .from('payouts')
          .select('id')
          .eq('user_id', userData.userId)
          .eq('month', lastMonthString)
          .single()

        if (existingPayout) {
          console.log(`Payout already exists for user ${userData.userId} for ${lastMonthString}`)
          continue
        }

        // Create payout record
        const { data: newPayout, error: payoutError } = await supabase
          .from('payouts')
          .insert({
            user_id: userData.userId,
            month: lastMonthString,
            total_revenue: userData.totalRevenueUSD,
            reconciliation: userData.reconciliation,
            total_payout: finalPayout,
            status: 'Pending',
            payment_method_id: paymentMethod.id,
            admin_notes: 'Automatically generated by monthly payment cron job'
          })
          .select()
          .single()

        if (payoutError) {
          console.error(`Error creating payout for user ${userData.userId}:`, payoutError)
          continue
        }

        // Log activity
        await supabase
          .from('activity_logs')
          .insert({
            user_id: userData.userId,
            action: 'monthly_payout_created',
            details: `Monthly payout created for ${lastMonthString}: $${finalPayout.toFixed(2)}`,
            metadata: {
              payout_id: newPayout.id,
              month: lastMonthString,
              total_revenue: userData.totalRevenueUSD,
              reconciliation: userData.reconciliation,
              final_payout: finalPayout
            }
          })

        processedPayouts.push({
          userId: userData.userId,
          userEmail: userData.user.email,
          payoutId: newPayout.id,
          amount: finalPayout,
          month: lastMonthString
        })

        console.log(`Created payout for user ${userData.user.email}: $${finalPayout.toFixed(2)}`)

      } catch (error) {
        console.error(`Error processing payout for user ${userData.userId}:`, error)
      }
    }

    // Log system activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: null, // System action
        action: 'monthly_payment_cron_completed',
        details: `Monthly payment cron job completed. Processed ${processedPayouts.length} payouts for ${lastMonthString}`,
        metadata: {
          month: lastMonthString,
          eligible_users: eligibleUsers.length,
          processed_payouts: processedPayouts.length,
          total_amount: processedPayouts.reduce((sum, p) => sum + p.amount, 0)
        }
      })

    return NextResponse.json({
      success: true,
      message: `Monthly payment processing completed for ${lastMonthString}`,
      processedPayouts: processedPayouts.length,
      totalAmount: processedPayouts.reduce((sum, p) => sum + p.amount, 0),
      details: processedPayouts
    })

  } catch (error) {
    console.error('Error in monthly payment cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}