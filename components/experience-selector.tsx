'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { format, isWeekend } from 'date-fns'

interface TimeSlot {
  time: string
  available: boolean
}

interface Experience {
  name: string
  price: number
  duration: number // in minutes
  timeSlots: TimeSlot[]
}

interface ExperienceSelectorProps {
  selectedDate: Date
  onAddToCart: (experience: string, price: number, time: string) => void
}

export function ExperienceSelector({ selectedDate, onAddToCart }: ExperienceSelectorProps) {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)

  // Generate time slots based on experience duration
  const generateTimeSlots = (duration: number): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const isWeekendDay = isWeekend(selectedDate)
    
    // Start and end times
    const startHour = isWeekendDay ? 9 : 6
    const endHour = isWeekendDay ? 12 : 9

    let currentTime = new Date(selectedDate)
    currentTime.setHours(startHour, 0, 0)
    const endTime = new Date(selectedDate)
    endTime.setHours(endHour, 0, 0)

    while (currentTime < endTime) {
      slots.push({
        time: format(currentTime, 'h:mm a'),
        available: true // In real app, check availability from backend
      })
      currentTime = new Date(currentTime.getTime() + duration * 60000)
    }

    return slots
  }

  const experiences: Experience[] = [
    {
      name: 'Reflexology',
      price: 30,
      duration: 15,
      timeSlots: generateTimeSlots(15)
    },
    {
      name: 'Yoga',
      price: 30,
      duration: 30,
      timeSlots: generateTimeSlots(30)
    },
    {
      name: 'Ice Baths',
      price: 30,
      duration: 20,
      timeSlots: generateTimeSlots(20)
    },
    {
      name: 'Sober Rave',
      price: 0,
      duration: 60,
      timeSlots: generateTimeSlots(60)
    },
    {
      name: 'Community Words Game',
      price: 0,
      duration: 45,
      timeSlots: generateTimeSlots(45)
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Add Experiences</h2>
      
      {/* Experience List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiences.map((exp) => (
          <div 
            key={exp.name}
            className={`p-4 rounded-lg transition-colors cursor-pointer ${
              selectedExperience === exp.name
                ? 'bg-white/20'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => setSelectedExperience(exp.name)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-white">{exp.name}</h3>
              <span className="text-sm text-white/60">
                {exp.price === 0 ? 'Free' : `${exp.price} AED`}
              </span>
            </div>
            <p className="text-sm text-white/60 mb-2">
              Duration: {exp.duration} minutes
            </p>
            
            {/* Time Slots */}
            {selectedExperience === exp.name && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-white">
                  Available Times:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {exp.timeSlots.map((slot, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToCart(exp.name, exp.price, slot.time)
                      }}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
