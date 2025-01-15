'use client'

import { SailboatIcon as Yacht, Droplet } from 'lucide-react'
import { useState } from 'react'
import { YachtBookingModal } from '@/components/modals/yacht-booking-modal'
import { WellnessModal } from '@/components/modals/wellness-modal'

export function DashboardContent() {
  const [activeModal, setActiveModal] = useState<'yacht' | 'wellness' | null>(null)

  return (
    <div className="flex items-center justify-center gap-24 mb-16">
      {/* Yacht Icon */}
      <div 
        className="icon-wrapper fade-in delay-2 group relative"
        data-tooltip="Book your Morning Party experience"
        onClick={() => setActiveModal('yacht')}
        role="button"
        tabIndex={0}
        aria-label="Book Morning Party"
      >
        <Yacht className="w-16 h-16 text-white transition-transform hover:scale-110 hover:-translate-y-1 duration-300 relative z-10 cursor-pointer" />
      </div>

      {/* Center Droplet Icon */}
      <div 
        className="icon-wrapper fade-in delay-3 relative w-16 h-16 group"
        data-tooltip="Track your daily hydration"
        onClick={() => window.open('https://fpvbzfybmgofevvv.vercel.app', '_blank')}
        role="button"
        tabIndex={0}
        aria-label="Track Hydration"
      >
        <Droplet className="w-16 h-16 text-white transition-transform hover:scale-110 hover:-translate-y-1 duration-300 relative z-10 cursor-pointer" />
      </div>

      {/* Cup Icon */}
      <div 
        className="icon-wrapper fade-in delay-4 group relative"
        data-tooltip="Reservations for luxury wellness experiences, adaptogenic drinks and non-alcoholic cocktails"
        onClick={() => setActiveModal('wellness')}
        role="button"
        tabIndex={0}
        aria-label="Request Wellness Experience & Drinks"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-16 h-16 text-white transition-transform hover:scale-110 hover:-translate-y-1 duration-300 relative z-10 cursor-pointer"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      </div>

      {/* Modals */}
      <YachtBookingModal
        isOpen={activeModal === 'yacht'}
        onClose={() => setActiveModal(null)}
      />
      <WellnessModal
        isOpen={activeModal === 'wellness'}
        onClose={() => setActiveModal(null)}
      />

      {/* Add tooltip styles */}
      <style jsx>{`
        .icon-wrapper {
          position: relative;
        }
        
        .icon-wrapper::before {
          content: attr(data-tooltip);
          position: absolute;
          bottom: -2rem;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease-in-out;
          white-space: nowrap;
        }

        .icon-wrapper:hover::before {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>
    </div>
  )
}
