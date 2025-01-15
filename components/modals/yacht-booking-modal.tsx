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
  onBookingComplete?: (
    qrCode: string,
    experience: string,
    date: string,
    time: string
  ) => void
}

// Define the yacht experiences
const experiences = [
  {
    id: 'sunrise',
    name: 'Sunrise Serenity Sail',
    description: 'Start your day in harmony with the rising sun as you explore mindful movement and somatic wellness. Perfect for early risers who value connection and calm.',
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
    time: '6:00 AM - 9:00 AM',
    includes: [
      'Guided meditation and bodyweight yoga for amplitude, quality, and control of movement',
      'Expert recovery tips from a trainer specializing in joint health, rehabilitation, and pre/post-pregnancy fitness',
      'Herbal teas, adaptogenic elixirs, and nutrient-rich smoothies'
    ],
    special: 'Led by certified practitioners, this experience fuses functional training with somatic resilience techniques for a rejuvenating start.'
  },
  {
    id: 'sunset',
    name: 'Sunset Sober Soirée',
    description: 'Dive into a high-energy, alcohol-free party that combines dynamic movement with community vibes. Golden hour has never looked so good.',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    time: '4:00 PM - 7:00 PM',
    includes: [
      'Ecstatic dance sessions inspired by somatic practices for deep healing and joyful release',
      'Beats by live DJs paired with signature mood-boosting drinks like cacao, kombucha, and ashwagandha cocktails',
      'Interactive connection games designed for authentic engagement'
    ],
    special: 'Incorporating somatic regulation techniques, this soirée uplifts your spirit while grounding your energy.'
  },
  {
    id: 'highenergy',
    name: 'High-Energy Wellness Cruise',
    description: 'A fitness-inspired celebration on deck that turns wellness into a dynamic, unforgettable experience. Perfect for active souls who love to push boundaries.',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    time: '10:00 AM - 1:00 PM',
    includes: [
      'Hip-hop yoga and cardio sessions infused with functional training principles',
      'Recovery zones with ice baths and post-workout adaptogenic smoothies',
      'Insights from a trainer who works with professional athletes and specializes in post-injury rehabilitation'
    ],
    special: 'With somatic approaches to enhance recovery and movement quality, this cruise is the ultimate wellness-meets-party adventure.'
  },
  {
    id: 'midnight',
    name: 'Midnight Moonlight Lounge',
    description: 'Unwind and restore in a tranquil nighttime setting. Perfect for deep conversations, introspection, or simply stargazing in serenity.',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-500',
    time: '8:00 PM - 11:00 PM',
    includes: [
      'Guided tea ceremonies and sound baths led by certified somatic wellness practitioners',
      'Cozy spaces for lounging, supported by calming cacao and herbal nightcaps',
      'Soft somatic touch practices to release tension and enhance relaxation'
    ],
    special: 'Blending somatic resilience techniques with the soothing rhythm of the waves, this lounge is the epitome of nighttime bliss.'
  },
  {
    id: 'celebration',
    name: 'Celebration, Reinvented',
    description: 'From birthdays to engagements, bring your vision to life with our signature yacht celebrations.',
    color: 'bg-rose-500',
    textColor: 'text-rose-500',
    time: 'Custom',
    includes: [
      'Pre-designed celebration themes with wellness twists',
      'Ecstatic dance, sound healing, and adaptogenic elixirs to elevate the party',
      'Led by a team of experts in somatic experiencing and emotional regulation for unique, transformative moments'
    ],
    special: 'Celebrate with purpose, guided by wellness practices that make every moment unforgettable.'
  }
]

// Function to determine which experience is available on a given date
const getExperienceForDate = (date: Date | undefined): typeof experiences[0] | null => {
  if (!date) return null
  const dayOfWeek = date.getDay()
  const weekInMonth = Math.floor((date.getDate() - 1) / 7)
  const experienceIndex = (weekInMonth + dayOfWeek) % experiences.length
  return experiences[experienceIndex]
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
      setSelectedDate(date)
      setSelectedExperience(getExperienceForDate(date))
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
      
      // Notify parent component with full details
      onBookingComplete?.(
        qrCode,
        selectedExperience.name,
        format(selectedDate, 'MMMM do, yyyy'),
        selectedExperience.time
      )
      
      // Close modal
      onClose()
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Water Bar Yacht Party Series">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Sail into Wellness, Connection, and Celebration
          </h2>
          <p className="text-white/60">
            Experience the perfect blend of luxury, wellness, and transformative practices aboard The Water Bar yachts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Select Your Date</h3>
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
                  <p className="text-white/80 mt-3 text-lg">
                    {selectedExperience.description}
                  </p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">What&apos;s Included:</h4>
                      <ul className="list-disc list-inside space-y-2 text-white/70">
                        {selectedExperience.includes.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Why It&apos;s Special:</h4>
                      <p className="text-white/70">{selectedExperience.special}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/60">
                      <p>Time: {selectedExperience.time}</p>
                      <p>Date: {selectedDate ? format(selectedDate, 'MMMM do, yyyy') : ''}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className={`w-full ${selectedExperience.color} hover:opacity-90`}
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Book Experience'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                Select a date to view available experiences
              </div>
            )}
          </div>
        </div>

        {/* Experience List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Experiences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className={`p-3 rounded-lg ${exp.color}/5 border border-${exp.color}/10`}
              >
                <h4 className={`font-medium ${exp.textColor}`}>{exp.name}</h4>
                <p className="text-sm text-white/60 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
