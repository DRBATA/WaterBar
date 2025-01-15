'use client'

import { useAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { YachtBookingModal } from '@/components/modals/yacht-booking-modal'
import { QRDrawer } from '@/components/qr-drawer'

interface QRBooking {
  code: string
  experience: string
  date: string
  time: string
}

export default function Dashboard() {
  const router = useRouter()
  const { user } = useAuth()
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Three Icons */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Yacht Booking */}
          <div className="card hover:bg-white/5 transition-colors cursor-pointer group" 
               onClick={() => setShowYachtModal(true)}>
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">⛵</div>
              <h3 className="text-xl font-medium text-white mb-2">Yacht Sessions</h3>
              <p className="text-white/60 text-sm">
                Book your next yacht experience
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
                Track your daily hydration
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full button-base opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Open App
              </Button>
            </div>
          </div>

          {/* Wellness Classes */}
          <div className="card hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <h3 className="text-xl font-medium text-white mb-2">Classes</h3>
              <p className="text-white/60 text-sm">
                Browse and request class spots
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full button-base opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View Classes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <YachtBookingModal 
        isOpen={showYachtModal}
        onClose={() => setShowYachtModal(false)}
        onBookingComplete={(qrCode, experience, date, time) => {
          handleBookingComplete(qrCode, experience, date, time)
        }}
      />

      {/* QR Code Drawer */}
      <QRDrawer qrCodes={qrCodes} />
    </div>
  )
}
