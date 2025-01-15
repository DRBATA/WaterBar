'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'STAFF'
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on load
    try {
      // Try to get user from cookie first
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='))
        ?.split('=')[1]

      if (cookieValue) {
        const userData = JSON.parse(decodeURIComponent(cookieValue))
        console.log('🍪 Found user in cookie:', userData.email)
        setUser(userData)
      } else {
        // Fallback to localStorage
        const storedValue = localStorage.getItem('user')
        if (storedValue) {
          const userData = JSON.parse(storedValue)
          console.log('💾 Found user in storage:', userData.email)
          setUser(userData)
          // Sync cookie with localStorage
          const encodedUser = encodeURIComponent(storedValue)
          document.cookie = `user=${encodedUser}; path=/; max-age=2592000`
        }
      }
    } catch (error) {
      console.error('Failed to restore user session:', error)
      // Clear potentially corrupted data
      localStorage.removeItem('user')
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }
    setIsLoading(false)
  }, [])

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      return data.message // Return the success message about email verification
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 Attempting login:', email)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store user data
      const userData = data.user
      console.log('✅ Login successful:', userData.email)
      
      // Save to state
      setUser(userData)
      
      // Save to localStorage
      const userString = JSON.stringify(userData)
      localStorage.setItem('user', userString)
      
      // Save to cookie (encoded to handle special characters)
      const encodedUser = encodeURIComponent(userString)
      document.cookie = `user=${encodedUser}; path=/; max-age=2592000` // 30 days
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('👋 Logging out user:', user?.email)
    // Clear user from state
    setUser(null)
    // Clear localStorage
    localStorage.removeItem('user')
    // Clear cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
