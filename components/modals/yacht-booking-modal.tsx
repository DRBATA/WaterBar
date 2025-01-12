'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"

interface YachtBookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function YachtBookingModal({ isOpen, onClose }: YachtBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [timeInfo, setTimeInfo] = useState<{ start: string; end: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Update time info when date changes
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      
      setTimeInfo({
        start: isWeekend ? '9:00 AM' : '6:00 AM',
        end: isWeekend ? '12:00 PM' : '9:00 AM'
      })
    } else {
      setTimeInfo(null)
    }
  }, [selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to book')
      }

      setSuccess(true)
    } catch (error) {
      console.error('Booking error:', error)
      const message = error instanceof Error ? error.message : 'Failed to book'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Morning Party">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            Select Date
          </label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
            required
            min={new Date().toISOString().split('T')[0]}
          />
          {timeInfo ? (
            <div className="bg-white/5 p-3 rounded-lg mt-2">
              <p className="text-sm text-white/80 font-medium">
                Time slot for selected date:
              </p>
              <p className="text-sm text-white/60">
                {timeInfo.start} - {timeInfo.end}
              </p>
              <p className="text-xs text-white/40 mt-1">
                {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-white/60 mt-1">
              Available times:
              <br />
              Mon-Fri: 6:00 AM - 9:00 AM
              <br />
              Sat-Sun: 9:00 AM - 12:00 PM
            </p>
          )}
        </div>

        <div className="space-y-3">
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          {success ? (
            <div className="text-center space-y-3">
              <p className="text-green-400">Booking confirmed!</p>
              <p className="text-sm text-white/60">
                You can now submit your wellness experience and drinks preferences for this party.
              </p>
              <Button
                type="button"
                onClick={onClose}
                className="button-base w-full"
              >
                Close
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              className="button-base w-full"
              disabled={loading || !selectedDate}
            >
              {loading ? 'Booking...' : 'Book Now'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  )
}
