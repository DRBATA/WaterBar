'use client'

import { useState, useRef, useEffect } from 'react'

const videos = [
  '/boat.mp4',
  '/glass.mp4',
  '/loadingextended.mp4',
  '/person.mp4'
]

interface VideoIntroProps {
  onEnter: () => void
}

export function VideoIntro({ onEnter }: VideoIntroProps) {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [showText, setShowText] = useState(false)
  const [textPhase, setTextPhase] = useState(0) // 0: none, 1: first, 2: second, 3: third
  const videoRefs = useRef<HTMLVideoElement[]>([])
  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length)
  }, [])

  // Handle video transitions
  const transitionToVideo = (index: number) => {
    if (transitioning) return
    setTransitioning(true)
    setCurrentVideo(index)
    setTimeout(() => setTransitioning(false), 670) // 0.67s transition
  }

  // Handle video playback
  useEffect(() => {
    const currentVideoEl = videoRefs.current[currentVideo]
    if (currentVideoEl) {
      // Pause all videos
      videoRefs.current.forEach(video => {
        if (video && video !== currentVideoEl) {
          video.pause()
          video.currentTime = 0
        }
      })
      // Play current video
      const playPromise = currentVideoEl.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, handle if needed
        })
      }
    }
  }, [currentVideo])

  // Handle swipe
  const [touchStart, setTouchStart] = useState(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) { // Swipe left
        const nextVideo = (currentVideo + 1) % videos.length
        transitionToVideo(nextVideo)
      } else { // Swipe right
        const nextVideo = (currentVideo - 1 + videos.length) % videos.length
        transitionToVideo(nextVideo)
      }
    }
  }

  // Handle text animation sequence
  useEffect(() => {
    if (showText) {
      // "The Water Bar"
      setTextPhase(1)
      
      // "presents"
      setTimeout(() => {
        setTextPhase(2)
      }, 230)
      
      // "The Morning Party"
      setTimeout(() => {
        setTextPhase(3)
      }, 360)
      
      // Start exit sequence
      setTimeout(() => {
        setExiting(true)
        setTimeout(() => {
          onEnter()
        }, 1700)
      }, 730)
    }
  }, [showText, onEnter])

  // Handle enter click
  const handleEnter = () => {
    setShowText(true)
  }

  return (
    <div 
      className={`fixed inset-0 bg-black ${exiting ? 'fade-out' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Videos */}
      <div className="relative w-full h-full">
        {videos.map((src, index) => (
          <video
            key={src}
            ref={(el) => {
              if (el) videoRefs.current[index] = el
            }}
            src={src}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[670ms] ${
              index === currentVideo ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            playsInline
            loop
          />
        ))}
      </div>

      {/* Text Animation */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`transition-opacity duration-300 ${textPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl font-semibold text-white mb-2">The Water Bar</h1>
        </div>
        <div className={`transition-opacity duration-300 ${textPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xl text-white/80 mb-2">presents</p>
        </div>
        <div className={`transition-opacity duration-300 ${textPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl font-medium text-white">The Morning Party</h2>
        </div>
      </div>

      {/* Enter Button */}
      {!showText && (
        <button
          onClick={handleEnter}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-3 text-white text-xl border-2 border-white rounded-full hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm"
        >
          Enter
        </button>
      )}

      {/* Add global styles for fade-out */}
      <style jsx global>{`
        .fade-out {
          animation: fadeOut 1.7s forwards;
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
