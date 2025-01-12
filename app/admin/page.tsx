'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface User {
  id: string
  name: string
  email: string
  createdAt: string
  bookings: {
    id: string
    date: string
  }[]
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users')
        }
        
        setUsers(data.users)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-white">
        <div className="text-red-400 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()} className="button-base">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="text-2xl text-white mb-8">Admin Dashboard</h1>
        
        <div className="space-y-6">
          {users.map(user => (
            <div key={user.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-white">{user.name}</h3>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
                <div className="text-sm text-white/60">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <h4 className="text-sm font-medium text-white mb-2">Bookings</h4>
                {user.bookings && user.bookings.length > 0 ? (
                  <div className="space-y-2">
                    {user.bookings.map(booking => (
                      <div key={booking.id} className="text-sm text-white/80">
                        {new Date(booking.date).toLocaleString()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/60">No bookings yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
