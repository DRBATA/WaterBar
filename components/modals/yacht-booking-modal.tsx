'use client'

import { useState } from 'react'
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Calendar } from '@/components/ui/calendar'
import { format, isBefore, startOfToday } from 'date-fns'
import QRCode from 'qrcode'

interface YachtBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onBookingComplete: (qrCode: string, experience: string, date: string, time: string) => void
}

// Define the yacht experiences
const experiences = [
  {
    id: 'sunwarrior',
    name: 'Sun Warrior Yoga',
    description: 'Start your day with an energizing yoga flow as the sun rises over the horizon. Led by our expert yoga instructors, this session combines traditional asanas with breathwork and meditation.',
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
    time: '6:00 AM - 9:00 AM',
    days: [1, 2], // Monday, Tuesday
    includes: [
      'Sunrise meditation and pranayama',
      'Dynamic vinyasa flow',
      'Post-practice adaptogenic elixirs',
      'Light breakfast with superfoods'
    ]
  },
  {
    id: 'functional',
    name: 'Functional Wellness',
    description: 'High-intensity functional training combined with recovery techniques. Perfect for those seeking both challenge and restoration.',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    time: '10:00 AM - 1:00 PM',
    days: [3, 4], // Wednesday, Thursday
    includes: [
      'HIIT and strength circuits',
      'Mobility work and stretching',
      'Ice bath and heat therapy',
      'Recovery smoothies and supplements'
    ]
  },
  {
    id: 'somatic',
    name: 'Somatic Mindfulness',
    description: 'A gentle evening practice focusing on somatic experiencing, embodied meditation, and deep relaxation techniques.',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    time: '4:00 PM - 7:00 PM',
    days: [5, 6], // Friday, Saturday
    includes: [
      'Guided somatic meditation',
      'Gentle movement therapy',
      'Sound healing session',
      'Calming herbal tea ceremony'
    ]
  }
]

// Function to determine which experience is available on a given date
const getExperienceForDate = (date: Date | undefined): typeof experiences[0] | null => {
  if (!date) return null
  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Find experience that runs on this day
  return experiences.find(exp => exp.days.includes(dayOfWeek)) || null
}

export function YachtBookingModal({ isOpen, onClose, onBookingComplete }: YachtBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedExperience, setSelectedExperience] = useState<typeof experiences[0] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isBefore(date, startOfToday())) {
      return
    }
    if (date) {
      const experience = getExperienceForDate(date)
      setSelectedDate(date)
      setSelectedExperience(experience)
      
      if (!experience) {
        alert('No experience available on this day. Please select another date.')
      }
    } else {
      setSelectedDate(undefined)
      setSelectedExperience(null)
    }
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedExperience) return

    setLoading(true)
    try {
      // Generate QR code with booking details
      const qrData = JSON.stringify({
        experience: selectedExperience.name,
        date: format(selectedDate, 'MMMM do, yyyy'),
        time: selectedExperience.time
      })

      const qrCode = await QRCode.toDataURL(qrData)
      
      // Pass booking details back
      onBookingComplete(
        qrCode,
        selectedExperience.name,
        format(selectedDate, 'MMMM do, yyyy'),
        selectedExperience.time
      )
      
      // Close modal
      onClose()
    } catch (error) {
      console.error('Failed to generate QR:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Your Yacht Experience">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Select Your Experience
          </h2>
          <p className="text-white/60">
            Each experience runs on specific days:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-white/60">
            <li>Sun Warrior Yoga: Monday & Tuesday</li>
            <li>Functional Wellness: Wednesday & Thursday</li>
            <li>Somatic Mindfulness: Friday & Saturday</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border border-white/10 p-4"
              disabled={[
                { before: startOfToday() }
              ]}
              modifiers={{
                experience: (date: Date) => {
                  const exp = getExperienceForDate(date)
                  return !!exp
                }
              }}
              modifiersClassNames={{
                experience: "font-semibold"
              }}
            />
          </div>

          {/* Experience Details Section */}
          <div>
            {selectedExperience ? (
              <div className="space-y-4">
                <div className={`p-6 rounded-lg ${selectedExperience.color}/10 border border-${selectedExperience.color}/20`}>
                  <h3 className={`text-xl font-semibold ${selectedExperience.textColor}`}>
                    {selectedExperience.name}
                  </h3>
                  <p className="text-white/80 mt-3">
                    {selectedExperience.description}
                  </p>
                  <div className="mt-4 space-y-3">
                    <h4 className="font-medium">What's Included:</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                      {selectedExperience.includes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/60">
                    <p>Time: {selectedExperience.time}</p>
                    <p>Date: {selectedDate ? format(selectedDate, 'MMMM do, yyyy') : ''}</p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className={`w-full ${selectedExperience.color} hover:opacity-90`}
                  disabled={loading}
                >
                  {loading ? 'Creating Booking...' : 'Book Experience'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                Select a date to view available experience
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
