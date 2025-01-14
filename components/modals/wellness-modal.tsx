'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

interface WellnessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WellnessModal({ isOpen, onClose }: WellnessModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<{
    wellnessType: string;
    drinks: string[];
    specialRequests: string;
    userName: string;
    email: string;
  }>({
    wellnessType: '',
    drinks: [],
    specialRequests: '',
    userName: user?.name || '',
    email: user?.email || ''
  })
  const [loading, setLoading] = useState(false)

  const wellnessOptions = [
    { 
      id: 'massage', 
      name: 'Massage Therapy', 
      description: 'Relax and rejuvenate with targeted massage treatments designed to release tension and promote deep relaxation.' 
    },
    { 
      id: 'yoga', 
      name: 'Private Yoga', 
      description: 'Personalized yoga practices tailored to your fitness level and goals, combining movement with mindfulness.' 
    },
    { 
      id: 'meditation', 
      name: 'Guided Meditation', 
      description: 'Calm your mind and recharge your spirit with expert-led meditation sessions for clarity and relaxation.' 
    },
    { 
      id: 'fitness', 
      name: 'Personal Training', 
      description: 'Customized workout sessions designed to empower your fitness journey with strength and confidence.' 
    }
  ]

  const drinkOptions = [
    {
      id: 'awaken',
      name: 'Awaken Live Water',
      description: 'Hydration redefined: naturally structured and enriched for maximum vitality and absorption.',
      free: true
    },
    {
      id: 'chaga',
      name: 'Chaga Mushroom Elixirs',
      description: 'Packed with antioxidants and immune-boosting properties, chaga promotes stress relief and holistic healing.'
    },
    {
      id: 'innermost',
      name: 'Innermost Smoothies & Hydration',
      description: 'Custom blends packed with superfoods, protein, and hydration elements to energize and nourish your body.'
    },
    {
      id: 'dry',
      name: 'Drink Dry',
      description: 'Premium alternatives to traditional drinks, offering the complexity of cocktails without the alcohol.'
    },
    {
      id: 'cacao',
      name: 'Cacao (Life Within)',
      description: 'Ceremonial-grade cacao that enhances mood, focus, and emotional connection.'
    },
    {
      id: 'kombucha',
      name: 'Kombucha (Booch)',
      description: 'A gut-friendly fizzy delight, rich in probiotics to support digestion and overall well-being.'
    },
    {
      id: 'ashwagandha',
      name: 'Ashwagandha Infusions',
      description: 'Known as an adaptogen for centuries, ashwagandha reduces stress, improves sleep, and balances energy levels.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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

  const toggleDrink = (drinkId: string) => {
    setFormData(prev => ({
      ...prev,
      drinks: prev.drinks.includes(drinkId)
        ? prev.drinks.filter(id => id !== drinkId)
        : [...prev.drinks, drinkId]
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Wellness Experience & Drinks Request">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Wellness Experiences Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Blended Luxury Wellness Experiences</h2>
          <p className="text-sm text-white/60 mb-4">
            Transform your well-being with our thoughtfully curated wellness experiences.
          </p>
          <div className="space-y-4">
            {wellnessOptions.map(option => (
              <label
                key={option.id}
                className={`block p-4 rounded-lg cursor-pointer transition-colors ${
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
                  <h3 className="font-medium text-lg">{option.name}</h3>
                  <p className="text-sm text-white/70 mt-1">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Drinks Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Adaptogenic & Mood-Enhancing Elixirs</h2>
          <p className="text-sm text-white/60 mb-4">
            Select from our curated selection of adaptogenic and mood-boosting drinks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {drinkOptions.map(drink => (
              <label
                key={drink.id}
                className={`relative block p-4 rounded-lg cursor-pointer transition-colors ${
                  formData.drinks.includes(drink.id)
                    ? 'bg-white/20'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.drinks.includes(drink.id)}
                  onChange={() => toggleDrink(drink.id)}
                  className="sr-only"
                  aria-label={`Select ${drink.name}`}
                />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 className="font-medium text-lg">{drink.name}</h3>
                      {drink.free && (
                        <span className="ml-2 px-2 py-1 text-xs bg-white/10 rounded">Free</span>
                      )}
                    </div>
                    {formData.drinks.includes(drink.id) && (
                      <div className="text-white/90">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{drink.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Notes Section */}
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
          disabled={loading || !formData.wellnessType || formData.drinks.length === 0}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Modal>
  )
}
