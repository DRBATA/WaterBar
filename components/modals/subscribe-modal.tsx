'use client'

import { useState } from 'react'
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
}

export function SubscribeModal({ isOpen, onClose, onSubscribe }: SubscribeModalProps) {
  const [name, setName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !agreed) return

    setLoading(true)
    // Demo subscription
    setTimeout(() => {
      onSubscribe()
      setLoading(false)
      setName('')
      setAgreed(false)
    }, 1000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subscribe to Morning Parties"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subscription Details */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <h3 className="text-lg font-medium text-amber-500">
              Monthly Subscription
            </h3>
            <p className="mt-2 text-white/60">
              Join our exclusive wellness community for just 550 AED per month
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>✓ Access to all morning parties</li>
              <li>✓ Book up to 3 slots in advance</li>
              <li>✓ Cancel or reschedule anytime</li>
              <li>✓ Member-only experiences</li>
            </ul>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Your Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full"
            required
          />
        </div>

        {/* Fair Use Policy */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="policy"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label htmlFor="policy" className="text-sm text-white/60">
              I agree to the fair use policy, including:
            </label>
          </div>
          <ul className="text-sm text-white/60 list-disc list-inside ml-6 space-y-1">
            <li>Maximum 3 advance bookings at a time</li>
            <li>24-hour cancellation notice required</li>
            <li>Recurring monthly subscription of 550 AED</li>
            <li>Seasonal schedule variations may apply</li>
          </ul>
        </div>

        {/* Subscribe Button */}
        <Button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-black"
          disabled={!name || !agreed || loading}
        >
          {loading ? 'Processing...' : 'Subscribe Now - 550 AED/month'}
        </Button>
      </form>
    </Modal>
  )
}
