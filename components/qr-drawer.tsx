'use client'

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface QRBooking {
  code: string
  experience: string
  date: string
  time: string
}

interface QRDrawerProps {
  qrCodes: QRBooking[]
}

export function QRDrawer({ qrCodes }: QRDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const drawer = document.getElementById('qr-drawer')
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

  if (qrCodes.length === 0) return null

  return (
    <div 
      id="qr-drawer"
      className={`fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-[90%]'
      }`}
    >
      {/* Handle */}
      <div 
        className="flex justify-center py-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2 text-white/60 hover:text-white">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          <span className="text-sm font-medium">
            {qrCodes.length} Booking{qrCodes.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[70vh] overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {qrCodes.map((booking, index) => (
            <div 
              key={index}
              className="bg-white/5 rounded-lg p-4 space-y-3"
            >
              <div className="relative w-full aspect-square bg-white rounded-lg p-2">
                <Image 
                  src={booking.code}
                  alt="Booking QR Code"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-white space-y-1">
                <h3 className="font-medium">{booking.experience}</h3>
                <p className="text-sm text-white/60">{booking.date}</p>
                <p className="text-sm text-white/60">{booking.time}</p>
                <p className="text-xs text-white/40 mt-2">Show QR code at check-in</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
