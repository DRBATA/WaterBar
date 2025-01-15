'use client'

import { Modal } from '../ui/modal'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter()
  const { login, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [redirecting, setRedirecting] = useState(false)

  // Handle successful login
  useEffect(() => {
    if (user && !redirecting) {
      console.log('🔐 Login successful, redirecting to dashboard')
      setRedirecting(true)
      onClose()
      // Small delay to avoid state updates during redirect
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    }
  }, [user, router, onClose, redirecting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      // Modal and redirect handled by useEffect
    } catch (err) {
      console.error('Login error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to login. Please try again.'
      )
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to The Water Bar"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />
        <div className="space-y-2 text-center">
          <div className="text-white/60 text-sm">
            Enter your credentials to access your account
          </div>
          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          className="button-base w-full"
          disabled={loading || redirecting}
        >
          {loading ? 'Processing...' : 'Login'}
        </Button>
      </form>
    </Modal>
  )
}
