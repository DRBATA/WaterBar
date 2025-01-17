'use client'

import { SailboatIcon as Yacht, Droplet } from 'lucide-react'
import { WellnessCarousel } from '@/components/wellness-carousel'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { YachtBookingModal } from '@/components/modals/yacht-booking-modal'
import { WellnessModal } from '@/components/modals/wellness-modal'

export default function Home() {
  const router = useRouter()
  const { user, login, register, logout } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [activeModal, setActiveModal] = useState<'yacht' | 'wellness' | null>(null)
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
        <div className="w-full flex justify-between items-center mb-12 px-8">
          <h1 className="text-2xl text-white fade-in delay-1">
            The Water Bar presents The Morning Party
          </h1>
          {user && (
            <Button 
              onClick={() => {
                logout()
                router.push('/')
              }}
              variant="outline"
              className="button-base bg-white/5 hover:bg-white/10"
            >
              Logout
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-24 mb-16">
          {/* Yacht Icon */}
          <div 
            className="icon-wrapper fade-in delay-2 group relative"
            data-tooltip="Book your Morning Party experience"
            onClick={() => user ? setActiveModal('yacht') : setError('Please log in to book')}
            role="button"
            tabIndex={0}
            aria-label="Book Morning Party"
          >
            <Yacht className="w-16 h-16 text-white transition-transform hover:scale-110 hover:-translate-y-1 duration-300 relative z-10 cursor-pointer" />
          </div>

          {/* Center Droplet Icon */}
          <div 
            className="icon-wrapper fade-in delay-3 relative w-16 h-16 group"
            data-tooltip="Track your daily hydration"
            onClick={() => user ? window.open('https://fpvbzfybmgofevvv.vercel.app', '_blank') : setError('Please log in to track hydration')}
            role="button"
            tabIndex={0}
            aria-label="Track Hydration"
          >
            <Droplet className="w-16 h-16 text-white transition-transform hover:scale-110 hover:-translate-y-1 duration-300 relative z-10 cursor-pointer" />
          </div>

          {/* Cup Icon */}
          <div 
            className="icon-wrapper fade-in delay-4 group relative"
            data-tooltip="Reservations for luxury wellness experiences, adaptogenic drinks and non-alcoholic cocktails"
            onClick={() => user ? setActiveModal('wellness') : setError('Please log in to make requests')}
            role="button"
            tabIndex={0}
            aria-label="Request Wellness Experience & Drinks"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-16 h-16 text-white transition-transform hover:scale-110 hover:-translate-y-1 duration-300 relative z-10 cursor-pointer"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </div>

          {/* Modals */}
          <YachtBookingModal
            isOpen={activeModal === 'yacht'}
            onClose={() => setActiveModal(null)}
          />
          <WellnessModal
            isOpen={activeModal === 'wellness'}
            onClose={() => setActiveModal(null)}
          />
        </div>

        {/* Add tooltip styles */}
        <style jsx>{`
          .icon-wrapper {
            position: relative;
          }
          
          .icon-wrapper::before {
            content: attr(data-tooltip);
            position: absolute;
            bottom: -2rem;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            padding: 0.5rem 1rem;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-size: 0.875rem;
            border-radius: 0.5rem;
            opacity: 0;
            pointer-events: none;
            transition: all 0.2s ease-in-out;
            white-space: nowrap;
          }

          .icon-wrapper:hover::before {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        `}</style>

        {!user && (
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
        )}

        {user && <WellnessCarousel />}
      </div>
    </div>
  )
}
