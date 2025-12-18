"use client"

import React from 'react'
import { ArrowRight } from 'lucide-react'

export function HeroImage() {
  return (
    <div className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center">
      {/* Hand-drawn Arrow pointing to the card */}
      <div className="absolute z-30 left-0 top-1/2 transform -translate-y-1/2 -translate-x-8">
        <svg width="60" height="40" viewBox="0 0 60 40" className="text-foreground">
          <path 
            d="M10 20 Q30 20 50 20 L45 15 L50 20 L45 25" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main Rose-Gold Credit Card */}
      <div className="absolute z-20 bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 rounded-2xl p-6 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
        <div className="w-80 h-52 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6 relative overflow-hidden">
          {/* EMV Chip */}
          <div className="absolute top-4 left-4 w-8 h-6 bg-gradient-to-br from-amber-600 to-orange-600 rounded-sm"></div>
          
          {/* Card Number */}
          <div className="absolute top-20 left-6 right-6">
            <div className="text-foreground/80 text-xs mb-1">CARDHOLDER NAME</div>
            <div className="text-foreground text-lg font-semibold">JOHN DOE</div>
          </div>
          
          {/* Mastercard Logo */}
          <div className="absolute bottom-4 right-6 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
            <span className="text-foreground/60 text-xs font-medium">mastercard.</span>
          </div>
        </div>
      </div>

      {/* Abstract Background Shapes */}
      <div className="absolute z-10 top-20 right-20 w-32 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300 opacity-80"></div>
      
      <div className="absolute z-10 bottom-32 left-16 w-28 h-20 bg-gradient-to-br from-orange-100 to-rose-100 rounded-xl shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-300 opacity-80"></div>
      
      <div className="absolute z-10 top-40 left-8 w-20 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300 opacity-60"></div>

      {/* Floating Elements */}
      <div className="absolute z-5 top-16 right-32 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
      <div className="absolute z-5 bottom-24 left-32 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
      <div className="absolute z-5 top-48 right-12 w-4 h-4 bg-rose-400 rounded-full animate-pulse"></div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-50/20 to-orange-50/20 rounded-3xl"></div>
    </div>
  )
}
