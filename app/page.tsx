'use client'

import { WellnessCarousel } from '@/components/wellness-carousel'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { VideoIntro } from '@/components/video-intro'
import { AuthModal } from '@/components/modals/auth-modal'
import { YachtBookingModal } from '@/components/modals/yacht-booking-modal'
import { QRDrawer } from '@/components/qr-drawer'

interface QRBooking {
  code: string
  experience: string
  date: string
  time: string
}

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()
  const [showContent, setShowContent] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showYachtModal, setShowYachtModal] = useState(false)
  const [qrCodes, setQRCodes] = useState<QRBooking[]>([])

  // Handle navigation after login
  useEffect(() => {
    if (user && pathname === '/') {
      console.log('🚀 User authenticated:', { role: user.role })
      const targetPath = user.role === 'STAFF' ? '/admin' : '/dashboard'
      console.log(`🚀 Navigating to ${targetPath}`)
      router.replace(targetPath)
    }
  }, [user, router, pathname])

  // Client-side only debug logs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔑 Auth State:', { 
        isLoading,
        hasUser: !!user,
        userRole: user?.role,
        currentPath: pathname,
        showContent,
        showAuthModal
      })
    }
  }, [isLoading, user, pathname, showContent, showAuthModal])

  const openAuthModal = () => {
    console.log('🔓 Opening auth modal')
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    console.log('🔒 Closing auth modal')
    setShowAuthModal(false)
  }

  const handleEnter = () => {
    console.log('🎬 Video intro complete, showing content')
    setShowContent(true)
  }

  const handleLogout = () => {
    console.log('👋 Logging out')
    logout()
    router.push('/')
  }

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
    <>
      {!showContent && <VideoIntro onEnter={handleEnter} />}
      
      {!isLoading && showContent && (
        <>
          <div className="fixed top-0 left-0 right-0 p-4 z-[60] fade-in flex justify-between items-center">
            <Button
              onClick={() => router.push('/register')}
              variant="outline"
              className="button-base bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2 text-white font-medium shadow-lg"
            >
              Join Now
            </Button>

            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="button-base bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2 text-white font-medium shadow-lg"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={openAuthModal}
                variant="outline"
                className="button-base bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2 text-white font-medium shadow-lg"
              >
                Login
              </Button>
            )}
          </div>

          <AuthModal 
            isOpen={showAuthModal}
            onClose={closeAuthModal}
          />
        </>
      )}

      {showContent && (
        <div className="page-container fade-in" onAnimationEnd={() => console.log('🎨 Content fade-in complete')}>
          <div className="wave z-0"></div>
          <div className="wave opacity-70 z-0" style={{ animationDelay: '-2s' }}></div>
          <div className="wave opacity-50 z-0" style={{ animationDelay: '-4s' }}></div>
          {/* Three Icons */}
          <div className="max-w-7xl mx-auto p-6 mb-12">
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
            onBookingComplete={(qrCode, experience, date, time) => {
              handleBookingComplete(qrCode, experience, date, time)
            }}
          />

          {/* QR Code Drawer */}
          <QRDrawer qrCodes={qrCodes} />
        </div>
      )}
    </>
  )
}
