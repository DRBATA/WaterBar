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
    const storedUser = localStorage.getItem('user')
    const cookieUser = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1]

    if (cookieUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(cookieUser))
        setUser(userData)
      } catch (error) {
        console.error('Failed to parse cookie user:', error)
      }
    } else if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        // Sync cookie with localStorage
        document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=2592000`
      } catch (error) {
        console.error('Failed to parse stored user:', error)
      }
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

      // Store user in both localStorage and cookie
      const userData = data.user
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=2592000` // 30 days
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    // Clear user from both localStorage and cookie
    setUser(null)
    localStorage.removeItem('user')
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
