'use client'

import { Droplet, SailboatIcon as Yacht, Eye } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const router = useRouter()
  const { user, login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        await login(formData.email)
        // Wait a bit for the auth state to update
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      } else {
        // Register
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong')
        }

        // Auto-login after registration
        await login(formData.email)
        // Wait a bit for the auth state to update
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to process request. Please try again.'
      )
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

  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden relative"
      style={{
        background: `linear-gradient(rgba(30, 58, 138, 0.7), rgba(30, 58, 138, 0.7)), url('/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="wave"></div>
      <div className="wave" style={{ animationDelay: '-2s', opacity: '0.7' }}></div>
      <div className="wave" style={{ animationDelay: '-4s', opacity: '0.5' }}></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 
          className="text-2xl text-white mb-12 opacity-0 animate-[fadeIn_1s_ease-in_forwards]"
          style={{ animationDelay: '0.5s' }}
        >
          The Water Bar presents The Morning Party
        </h1>

        <div className="flex gap-12 mb-16">
          {[
            { Icon: Droplet, delay: '1s' },
            { Icon: Yacht, delay: '1.2s' },
            { Icon: Eye, delay: '1.4s' }
          ].map(({ Icon, delay }, index) => (
            <div 
              key={index}
              className="icon-wrapper opacity-0 animate-[fadeIn_1s_ease-in_forwards]"
              style={{ animationDelay: delay }}
            >
              <Icon 
                className="w-16 h-16 text-white transition-transform hover:scale-110 hover:-translate-y-1 duration-300 relative z-10" 
              />
            </div>
          ))}
        </div>

        <div className="w-full max-w-sm space-y-4 opacity-0 animate-[fadeIn_1s_ease-in_forwards]" style={{ animationDelay: '1.6s' }}>
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 ${isLogin ? 'bg-white/20' : 'bg-white/10'} text-white hover:bg-white/20 border-0`}
            >
              Login
            </Button>
            <Button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 ${!isLogin ? 'bg-white/20' : 'bg-white/10'} text-white hover:bg-white/20 border-0`}
            >
              Register
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white/10 text-white placeholder:text-white/50 border-white/20"
                required={!isLogin}
              />
            )}
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white/10 text-white placeholder:text-white/50 border-white/20"
              required
            />
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-white/10 text-white hover:bg-white/20 border-0"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
