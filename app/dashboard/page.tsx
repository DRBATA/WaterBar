'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Booking {
  id: string
  date: string
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    fetchBookings()
  }, [user, router])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?userId=${user?.id}`)
      const data = await response.json()
      setBookings(data.bookings)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingDate) return
    
    setBookingError('')
    setLoading(true)

    try {
      const [datePart, timePart] = bookingDate.split('T')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hours, minutes] = timePart.split(':').map(Number)
      
      const selectedDate = new Date(year, month - 1, day, hours, minutes)
      
      if (isNaN(selectedDate.getTime())) {
        throw new Error('Please select a valid date and time')
      }

      const now = new Date()
      if (selectedDate < now) {
        throw new Error('Please select a future date and time')
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          date: selectedDate.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking')
      }

      setBookingDate('')
      fetchBookings()
      setBookingError('')
    } catch (error) {
      console.error('Booking error:', error)
      setBookingError(error instanceof Error ? error.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl text-white">Welcome, {user.name}!</h1>
          <Button 
            onClick={() => {
              logout()
              router.push('/')
            }}
            variant="outline"
            className="button-base"
          >
            Logout
          </Button>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl text-white mb-4">Book a Session</h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <Input
              type="datetime-local"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="input-field"
              required
            />
            {bookingError && (
              <div className="text-red-400 text-sm text-center">{bookingError}</div>
            )}
            <Button 
              type="submit"
              className="button-base w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Book Now'}
            </Button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl text-white mb-4">Your Bookings</h2>
          {loading ? (
            <p className="text-white/60">Loading...</p>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div 
                  key={booking.id}
                  className="bg-white/5 rounded p-4 text-white"
                >
                  {new Date(booking.date).toLocaleString()}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60">No bookings yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
