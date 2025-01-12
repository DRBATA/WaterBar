'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/components/ui/toast'

type BookingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

interface Booking {
  id: string
  user: {
    name: string
    email: string
  }
  date: string
  timeSlot: {
    startTime: string
    endTime: string
  }
  status: BookingStatus
}

interface FilterOptions {
  status: BookingStatus | 'ALL'
  dateRange: 'ALL' | 'TODAY' | 'UPCOMING' | 'PAST'
  sort: 'date-asc' | 'date-desc' | 'status'
}

export default function AdminPage() {
  const { show, ToastContainer } = useToast()
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'ALL',
    dateRange: 'UPCOMING',
    sort: 'date-desc'
  })

  // Apply filters to bookings
  useEffect(() => {
    let filtered = [...bookings]

    // Filter by status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(booking => booking.status === filters.status)
    }

    // Filter by date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (filters.dateRange) {
      case 'TODAY':
        filtered = filtered.filter(booking => {
          const bookingDate = new Date(booking.date)
          bookingDate.setHours(0, 0, 0, 0)
          return bookingDate.getTime() === today.getTime()
        })
        break
      case 'UPCOMING':
        filtered = filtered.filter(booking => new Date(booking.date) >= today)
        break
      case 'PAST':
        filtered = filtered.filter(booking => new Date(booking.date) < today)
        break
    }

    // Apply sorting
    switch (filters.sort) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'status':
        filtered.sort((a, b) => {
          const statusOrder = { ACTIVE: 0, UPCOMING: 1, COMPLETED: 2, CANCELLED: 3 }
          return statusOrder[a.status] - statusOrder[b.status]
        })
        break
    }
    setFilteredBookings(filtered)
  }, [bookings, filters])

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings')
      }

      setBookings(data)
      show('Bookings refreshed successfully', 'success')
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError('Failed to load bookings')
      show('Failed to refresh bookings', 'error')
    } finally {
      setLoading(false)
    }
  }, [show])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleStatusUpdate = useCallback(async (bookingId: string, newStatus: BookingStatus) => {
    setUpdateError(null)
    setUpdateLoading(bookingId)
    try {
      const response = await fetch(`/api/admin/bookings?id=${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const updatedBooking = await response.json()
      setBookings(prev => 
        prev.map(b => 
          b.id === updatedBooking.id ? updatedBooking : b
        )
      )
      show('Booking status updated successfully', 'success')
    } catch (error) {
      console.error('Failed to update booking status:', error)
      setUpdateError(bookingId)
      show('Failed to update booking status', 'error')
    } finally {
      setUpdateLoading(null)
    }
  }, [show])

  if (!user || user.role !== 'STAFF') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Access denied. Staff only area.</p>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="content-wrapper">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Morning Party Bookings</h1>
            <button
              onClick={() => {
                setLoading(true)
                setError('')
                fetchBookings()
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Refresh bookings"
              title="Refresh"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${loading ? 'animate-spin' : ''}`}
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-sm text-white/60">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} 
              {filters.status !== 'ALL' && ` • ${filters.status.toLowerCase()}`}
              {filters.dateRange !== 'ALL' && ` • ${filters.dateRange.toLowerCase()}`}
            </p>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as BookingStatus | 'ALL' }))}
                  className="bg-white/10 text-white border-white/20 rounded-lg px-3 py-1"
                  aria-label="Filter bookings by status"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="date-filter" className="sr-only">Filter by date</label>
                <select
                  id="date-filter"
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as FilterOptions['dateRange'] }))}
                  className="bg-white/10 text-white border-white/20 rounded-lg px-3 py-1"
                  aria-label="Filter bookings by date range"
                >
                  <option value="ALL">All Dates</option>
                  <option value="TODAY">Today</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="PAST">Past</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="sort-filter" className="sr-only">Sort bookings</label>
                <select
                  id="sort-filter"
                  value={filters.sort}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as FilterOptions['sort'] }))}
                  className="bg-white/10 text-white border-white/20 rounded-lg px-3 py-1"
                  aria-label="Sort bookings"
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="status">By status</option>
                </select>
              </div>
            </div>
          </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <LoadingSpinner />
            <p className="text-white/60">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-red-400 text-center">
              {error}
              <button
                onClick={() => {
                  setLoading(true)
                  setError('')
                  fetchBookings()
                }}
                className="block mt-4 text-sm text-white/60 hover:text-white"
              >
                Try again
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.length === 0 ? (
              <p className="text-white/60">No bookings found.</p>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{booking.user.name}</h3>
                      <p className="text-sm text-white/60">{booking.user.email}</p>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor={`booking-status-${booking.id}`} className="sr-only">Update booking status</label>
                      <select
                        id={`booking-status-${booking.id}`}
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value as BookingStatus)}
                        className={`
                          px-2 py-1 rounded text-sm relative
                          ${updateLoading === booking.id ? 'opacity-50 cursor-wait' : ''}
                          ${booking.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' :
                            booking.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-red-500/20 text-red-300'}
                        `}
                        disabled={updateLoading === booking.id}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      {updateError === booking.id && (
                        <p className="text-xs text-red-400 mt-1">Failed to update status</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">
                      <span className="text-white/60">Date: </span>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm">
                      <span className="text-white/60">Time: </span>
                      {new Date(booking.timeSlot.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                      {' - '}
                      {new Date(booking.timeSlot.endTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}
