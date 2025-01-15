'use client'

import { WellnessCarousel } from '@/components/wellness-carousel'
import { Button } from "../components/ui/button"
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { VideoIntro } from '@/components/video-intro'
import { AuthModal } from '@/components/modals/auth-modal'

export default function Home() {
  const { user, isLoading } = useAuth()
  const [showContent, setShowContent] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

  // Debug logs
  useEffect(() => {
    console.log('State updated:', { user, showContent, showAuthModal })
  }, [user, showContent, showAuthModal])

  const openAuthModal = () => {
    console.log('Opening auth modal')
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    console.log('Closing auth modal')
    setShowAuthModal(false)
  }

  const handleEnter = () => {
    console.log('Video intro complete, showing content')
    setShowContent(true)
  }


  return (
    <>
      {!showContent && <VideoIntro onEnter={handleEnter} />}
      
      {!isLoading && !user && showContent && (
        <>
          <div className="fixed top-4 right-4 z-[60]">
            <Button
              onClick={openAuthModal}
              variant="outline"
              className="button-base bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2 text-white font-medium"
            >
              Login
            </Button>
          </div>

          <AuthModal 
            isOpen={showAuthModal}
            onClose={closeAuthModal}
          />
        </>
      )}

      {showContent && (
        <div className="page-container fade-in">
          <div className="wave"></div>
          <div className="wave opacity-70" style={{ animationDelay: '-2s' }}></div>
          <div className="wave opacity-50" style={{ animationDelay: '-4s' }}></div>
          <div className="relative z-0 flex flex-col items-center">
            {/* Main Content */}
            <div className="mt-24">
              <WellnessCarousel />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
