'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { WellnessCarousel } from '@/components/wellness-carousel'
import { CartDrawer } from '@/components/cart-drawer'
import { SubscribeModal } from '@/components/modals/subscribe-modal'
import { LoginModal } from '@/components/modals/login-modal'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ExperienceSelector } from '@/components/experience-selector'
import { DrinksSelector } from '@/components/drinks-selector'

interface CartItem {
  type: 'booking' | 'experience' | 'drink'
  name: string
  price: number
  date?: string
  time?: string
  duration?: number // for experiences
}

export default function Home() {
  // Auth States
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Booking States
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showExperiences, setShowExperiences] = useState(false)
  const [showDrinks, setShowDrinks] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleDateSelect = (date: Date | undefined) => {
    if (!isSubscribed || !isLoggedIn) {
      alert('Please subscribe and login first')
      return
    }

    setSelectedDate(date)
    if (date) {
      // Add booking to cart
      setCartItems(prev => [...prev, {
        type: 'booking',
        name: 'Morning Party',
        price: 0, // Free with subscription
        date: format(date, 'MMMM do, yyyy'),
        time: '8:00 AM - 12:00 PM'
      }])
      setShowExperiences(true)
    }
  }

  const addToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item])
  }

  const handleCheckout = () => {
    // Demo confirmation
    alert(`
      🎉 Booking Confirmed!
      
      An email has been sent with your:
      - Yacht Entry Pass
      - Experience Time Slots
      - Water Bar Purchases
      
      Please bring your email confirmation for:
      • Entry to yacht
      • Access to booked experiences
      • Water Bar libations
      
      See you at The Water Bar! 🛥️✨
    `)
    setCartItems([])
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 z-50 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            onClick={() => setShowSubscribeModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            Subscribe Now
          </Button>

          <Button
            onClick={() => setShowLoginModal(true)}
            variant="outline"
          >
            {isLoggedIn ? 'Subscribed Member' : 'Login'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Begin Your Wellness Journey
            </h1>
            <p className="text-white/60">
              Select a date to start your morning party experience
            </p>
          </div>

          {/* Booking Flow */}
          <div className="space-y-8">
            {/* Calendar */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Select Date</h2>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border border-white/10 p-4 mx-auto"
              />
            </div>

            {/* Experiences Section */}
            {showExperiences && selectedDate && (
              <ExperienceSelector
                selectedDate={selectedDate}
                onAddToCart={(experience, price, time) => {
                  addToCart({
                    type: 'experience',
                    name: experience,
                    price,
                    time,
                    date: format(selectedDate, 'MMMM do, yyyy')
                  })
                  // Show drinks after adding an experience
                  setShowDrinks(true)
                }}
              />
            )}

            {/* Drinks Section */}
            {showDrinks && (
              <DrinksSelector
                onAddToCart={(drink, price) => {
                  addToCart({
                    type: 'drink',
                    name: drink,
                    price
                  })
                }}
              />
            )}

            {/* Experience Carousel */}
            <div className="mt-8">
              <WellnessCarousel />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubscribeModal 
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscribe={() => {
          setIsSubscribed(true)
          setShowSubscribeModal(false)
        }}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setIsLoggedIn(true)
          setShowLoginModal(false)
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        items={cartItems}
        onCheckout={handleCheckout}
      />
    </main>
  )
}
