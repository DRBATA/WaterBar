'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'

interface CartItem {
  type: 'booking' | 'experience' | 'drink'
  name: string
  price: number
  date?: string
  time?: string
}

interface CartDrawerProps {
  items: CartItem[]
  onCheckout: () => void
}

export function CartDrawer({ items, onCheckout }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const drawer = document.getElementById('cart-drawer')
      const target = e.target as HTMLElement
      
      if (drawer && !drawer.contains(target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [isOpen])

  const total = items.reduce((sum, item) => sum + item.price, 0)

  if (items.length === 0) return null

  return (
    <div 
      id="cart-drawer"
      className={`fixed top-0 bottom-0 right-0 w-96 bg-black/90 backdrop-blur-lg transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-[90%]'
      }`}
    >
      {/* Handle */}
      <div 
        className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center bg-black/90 backdrop-blur-lg p-2 rounded-l-lg text-white/60 hover:text-white">
          <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium ml-1">
            Cart ({items.length})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="h-full p-6 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">Your Cart</h2>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Bookings */}
          {items.filter(item => item.type === 'booking').map((item, i) => (
            <div key={`booking-${i}`} className="bg-white/5 rounded-lg p-4">
              <h3 className="font-medium text-white">{item.name}</h3>
              <p className="text-sm text-white/60">{item.date}</p>
              <p className="text-sm text-white/60">{item.time}</p>
              <p className="text-sm text-amber-500 mt-2">Included with subscription</p>
            </div>
          ))}

          {/* Experiences */}
          {items.filter(item => item.type === 'experience').map((item, i) => (
            <div key={`exp-${i}`} className="bg-white/5 rounded-lg p-4">
              <h3 className="font-medium text-white">{item.name}</h3>
              <p className="text-sm text-white/60">{item.time}</p>
              <p className="text-sm text-white/60">
                {item.price === 0 ? 'Free' : `${item.price} AED`}
              </p>
            </div>
          ))}

          {/* Drinks */}
          {items.filter(item => item.type === 'drink').map((item, i) => (
            <div key={`drink-${i}`} className="bg-white/5 rounded-lg p-4">
              <h3 className="font-medium text-white">{item.name}</h3>
              <p className="text-sm text-white/60">
                {item.price === 0 ? 'Free' : `${item.price} AED`}
              </p>
            </div>
          ))}
        </div>

        {/* Total & Pay Now */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white">Total to Pay</span>
            <span className="text-white font-medium">{total} AED</span>
          </div>
          <Button
            onClick={onCheckout}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black"
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  )
}
