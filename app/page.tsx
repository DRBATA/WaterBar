'use client'

import { WellnessCarousel } from '@/components/wellness-carousel'
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { YachtBookingModal } from '@/components/modals/yacht-booking-modal'
import { QRDrawer } from '@/components/qr-drawer'

interface QRBooking {
  code: string
  experience: string
  date: string
  time: string
}

export default function Home() {
  const [showYachtModal, setShowYachtModal] = useState(false)
  const [qrCodes, setQRCodes] = useState<QRBooking[]>([])

  const handleBookingComplete = (qrCode: string, experience: string, date: string, time: string) => {
    // Check booking limit
    if (qrCodes.length >= 3) {
      alert('Maximum 3 bookings allowed at a time')
      return
    }

    setQRCodes(prev => [...prev, { 
      code: qrCode, 
      experience, 
      date, 
      time
    }])
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Background Waves */}
      <div className="fixed inset-0 z-0">
        <div className="wave"></div>
        <div className="wave opacity-70" style={{ animationDelay: '-2s' }}></div>
        <div className="wave opacity-50" style={{ animationDelay: '-4s' }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Three Icons */}
        <div className="max-w-7xl mx-auto p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Yacht Booking */}
            <div className="card hover:bg-white/5 transition-colors cursor-pointer group" 
                onClick={() => setShowYachtModal(true)}>
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">⛵</div>
                <h3 className="text-xl font-medium text-white mb-2">Yacht Experiences</h3>
                <p className="text-white/60 text-sm">
                  Sun Warrior Yoga • Functional Wellness • Somatic Mindfulness
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full button-base opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View Schedule
                </Button>
              </div>
            </div>

            {/* Water App */}
            <div className="card hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => window.open('https://water-tracking-app.com', '_blank')}>
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">💧</div>
                <h3 className="text-xl font-medium text-white mb-2">Water App</h3>
                <p className="text-white/60 text-sm">
                  Track Hydration • Set Goals • Get Reminders
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full button-base opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Open App
                </Button>
              </div>
            </div>

            {/* The Water Bar */}
            <div className="card hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">🧋</div>
                <h3 className="text-xl font-medium text-white mb-2">The Water Bar</h3>
                <p className="text-white/60 text-sm">
                  Air-Generated Water • Adaptogens • Custom Electrolytes
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full button-base opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View Menu
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative z-0 flex flex-col items-center">
          <div className="mt-4">
            <WellnessCarousel />
          </div>
        </div>

        {/* Modals */}
        <YachtBookingModal 
          isOpen={showYachtModal}
          onClose={() => setShowYachtModal(false)}
          onBookingComplete={handleBookingComplete}
        />

        {/* QR Code Drawer */}
        <QRDrawer qrCodes={qrCodes} />
      </div>
    </main>
  )
}
