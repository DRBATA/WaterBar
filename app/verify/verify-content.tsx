'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('Verification token is missing')
        return
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed')
        }

        setStatus('success')
        setMessage('Email verified successfully! You can now log in.')
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Verification failed')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="card p-8 max-w-md w-full text-center">
      <h1 className="text-2xl text-white mb-6">Email Verification</h1>
      
      {status === 'loading' && (
        <p className="text-white/60">Verifying your email...</p>
      )}

      {status === 'success' && (
        <>
          <p className="text-green-400 mb-6">{message}</p>
          <Button
            onClick={() => router.push('/login')}
            className="button-base"
          >
            Go to Login
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <p className="text-red-400 mb-6">{message}</p>
          <Button
            onClick={() => router.push('/')}
            className="button-base"
          >
            Back to Home
          </Button>
        </>
      )}
    </div>
  )
}
