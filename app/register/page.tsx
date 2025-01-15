'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess(true)
      // Stay on success page to show verification instructions
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-md w-full mx-4 p-8 bg-black/20 backdrop-blur-md rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Almost There! 📧
          </h2>
          <div className="space-y-4">
            <div className="text-white/80 space-y-2">
              <p>Test account verification link sent to:</p>
              <p className="text-white font-medium">{formData.email}</p>
            </div>
            <div className="text-white/60 text-sm space-y-2">
              <p>1. Check your email and click the verification link</p>
              <p>2. After verification, you can log in</p>
              <p>3. Test the booking system</p>
              <p className="text-xs mt-4">(Payment integration coming soon)</p>
            </div>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="mt-6 button-base bg-white/10 hover:bg-white/20"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full mx-4 p-8 bg-black/20 backdrop-blur-md rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-2">Join The Water Bar</h2>
        <p className="text-white/60 text-sm mb-6">
          Test Account Registration (Payment Integration Coming Soon)
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Choose a password (min. 8 characters)"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full button-base"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Create Test Account'}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-white/60 hover:text-white text-sm"
            >
              Back to home
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
