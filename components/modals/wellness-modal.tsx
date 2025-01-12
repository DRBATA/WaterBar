'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"

interface WellnessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WellnessModal({ isOpen, onClose }: WellnessModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    wellnessType: '',
    drinks: '',
    specialRequests: '',
    userName: user?.name || '',
    email: user?.email || ''
  })
  const [loading, setLoading] = useState(false)

  const wellnessOptions = [
    { id: 'massage', name: 'Massage Therapy', description: 'Relaxing massage treatments' },
    { id: 'yoga', name: 'Private Yoga', description: 'Personalized yoga sessions' },
    { id: 'meditation', name: 'Guided Meditation', description: 'Mindfulness and relaxation' },
    { id: 'fitness', name: 'Personal Training', description: 'Customized workout sessions' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement wellness request API call
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit request')
      }

      onClose()
    } catch (error) {
      console.error('Wellness request error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Wellness Experience & Drinks Request">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Your Wellness Experience
          </label>
          <p className="text-sm text-white/60 mb-3">
            Choose an experience to enhance your morning party
          </p>
          <div className="space-y-3">
            {wellnessOptions.map(option => (
              <label
                key={option.id}
                className={`block p-3 rounded-lg cursor-pointer transition-colors ${
                  formData.wellnessType === option.id
                    ? 'bg-white/20'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="wellnessType"
                  value={option.id}
                  checked={formData.wellnessType === option.id}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    wellnessType: e.target.value
                  }))}
                  className="sr-only"
                  aria-label={`Select ${option.name}`}
                />
                <div>
                  <h3 className="font-medium">{option.name}</h3>
                  <p className="text-sm text-white/60">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="drinks" className="block text-sm font-medium mb-2">
            Drinks Preferences
          </label>
          <p className="text-sm text-white/60 mb-3">
            Let us know your preferred drinks to keep the bar stocked
          </p>
          <Input
            id="drinks"
            value={formData.drinks}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              drinks: e.target.value
            }))}
            placeholder="e.g., Specific brands, Fresh juices, Cocktail preferences"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium mb-2">
            Additional Notes
          </label>
          <p className="text-sm text-white/60 mb-3">
            Any specific requirements or preferences for your experience
          </p>
          <textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              specialRequests: e.target.value
            }))}
            placeholder="Time preferences, special arrangements, dietary restrictions..."
            className="input-field w-full h-24 resize-none"
          />
        </div>

        <Button
          type="submit"
          className="button-base w-full"
          disabled={loading || !formData.wellnessType}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Modal>
  )
}
