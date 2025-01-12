'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

interface HydrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HydrationModal({ isOpen, onClose }: HydrationModalProps) {
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([])

  const drinks = [
    { id: 'water', name: 'Mineral Water', description: 'Pure spring water' },
    { id: 'coconut', name: 'Coconut Water', description: 'Fresh and natural' },
    { id: 'vitamin', name: 'Vitamin Water', description: 'Enhanced with vitamins' },
    { id: 'electrolyte', name: 'Electrolyte Drink', description: 'For hydration and recovery' },
  ]

  const toggleDrink = (drinkId: string) => {
    setSelectedDrinks(prev => 
      prev.includes(drinkId)
        ? prev.filter(id => id !== drinkId)
        : [...prev, drinkId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement hydration preferences API call
    console.log('Selected drinks:', selectedDrinks)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hydration Preferences">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {drinks.map(drink => (
            <div
              key={drink.id}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedDrinks.includes(drink.id)
                  ? 'bg-white/20'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => toggleDrink(drink.id)}
            >
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedDrinks.includes(drink.id)}
                  onChange={() => toggleDrink(drink.id)}
                  className="h-4 w-4"
                  aria-label={`Select ${drink.name}`}
                  title={`Select ${drink.name}`}
                />
                <div>
                  <h3 className="font-medium">{drink.name}</h3>
                  <p className="text-sm text-white/60">{drink.description}</p>
                </div>
              </label>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="button-base w-full"
          disabled={selectedDrinks.length === 0}
        >
          Save Preferences
        </Button>
      </form>
    </Modal>
  )
}
