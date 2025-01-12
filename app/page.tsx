'use client'

import { Droplet, SailboatIcon as Yacht, Eye } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const router = useRouter()
  const { user, login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
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
        await login(formData.email, formData.password)
        router.push('/dashboard')
      } else {
        // Register
        await register(formData.name, formData.email, formData.password)
        setError('Please check your email to verify your account') // Show verification email message
        setFormData({ name: '', email: '', password: '' }) // Clear form
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
    <div className="page-container">
      <div className="wave"></div>
      <div className="wave opacity-70" style={{ animationDelay: '-2s' }}></div>
      <div className="wave opacity-50" style={{ animationDelay: '-4s' }}></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-2xl text-white mb-12 fade-in delay-1">
          The Water Bar presents The Morning Party
        </h1>

        <div className="flex gap-12 mb-16">
          {[
            { Icon: Droplet, delay: 'delay-2' },
            { Icon: Yacht, delay: 'delay-3' },
            { Icon: Eye, delay: 'delay-4' }
          ].map(({ Icon, delay }, index) => (
            <div 
              key={index}
              className={`icon-wrapper fade-in ${delay}`}
            >
              <Icon 
                className="w-16 h-16 text-white transition-transform hover:scale-110 hover:-translate-y-1 duration-300 relative z-10" 
              />
            </div>
          ))}
        </div>

        <div className={`form-container fade-in delay-5`}>
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 ${isLogin ? 'bg-white/20' : 'button-base'}`}
            >
              Login
            </Button>
            <Button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 ${!isLogin ? 'bg-white/20' : 'button-base'}`}
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
                className="input-field"
                required={!isLogin}
              />
            )}
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
            <div className={error?.includes('verify') ? "text-green-400 text-sm text-center" : "text-red-400 text-sm text-center"}>
              {error}
            </div>
            <Button 
              type="submit" 
              className="button-base w-full"
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
