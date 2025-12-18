'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, TrendingUp, DollarSign } from 'lucide-react'
import Link from 'next/link'

export function RevenueCalculator() {
  const [userCount, setUserCount] = useState(1000)
  const [averageEarnings, setAverageEarnings] = useState(5)

  const monthlyRevenue = userCount * averageEarnings
  const yearlyRevenue = monthlyRevenue * 12

  return (
    <div className="animate-fadeIn">
      <div className="bg-card rounded-3xl p-8 shadow-professional-lg hover-lift border border-border">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Revenue Calculator</h3>
          <p className="text-muted-foreground">See your potential earnings</p>
        </div>

        <div className="space-y-8">
          {/* Number of Users */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Number of Users
            </label>
            <div className="relative">
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={userCount}
                onChange={(e) => setUserCount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((userCount - 100) / (100000 - 100)) * 100}%, var(--muted) ${((userCount - 100) / (100000 - 100)) * 100}%, var(--muted) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>100</span>
                <span className="font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {userCount.toLocaleString()}
                </span>
                <span>100K</span>
              </div>
            </div>
          </div>

          {/* Average Earnings per User */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Average Earnings per User ($)
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={averageEarnings}
                onChange={(e) => setAverageEarnings(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((averageEarnings - 1) / (20 - 1)) * 100}%, var(--muted) ${((averageEarnings - 1) / (20 - 1)) * 100}%, var(--muted) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>$1</span>
                <span className="font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  ${averageEarnings}
                </span>
                <span>$20</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Monthly Revenue</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  ${monthlyRevenue.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Yearly Revenue</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  ${yearlyRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <Link href="/signup">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 font-semibold rounded-xl shadow-professional hover-lift">
              Start Earning Today
              <TrendingUp className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
