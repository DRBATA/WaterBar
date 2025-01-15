'use client'

import { Button } from "@/components/ui/button"

interface Drink {
  name: string
  price: number
  description: string
}

interface DrinksSelectorProps {
  onAddToCart: (drink: string, price: number) => void
}

export function DrinksSelector({ onAddToCart }: DrinksSelectorProps) {
  const drinks: Drink[] = [
    {
      name: 'Pure Water',
      price: 0,
      description: 'Air-generated pure water with custom minerals'
    },
    {
      name: 'Adaptogenic Elixir',
      price: 25,
      description: 'Blend of mushrooms, herbs, and superfoods'
    },
    {
      name: 'Kombucha Blend',
      price: 20,
      description: 'Probiotic-rich fermented tea with botanicals'
    },
    {
      name: 'Herbal Tonic',
      price: 15,
      description: 'Calming blend of herbs and adaptogens'
    },
    {
      name: 'Recovery Boost',
      price: 30,
      description: 'Electrolyte-rich blend for post-workout'
    },
    {
      name: 'Focus Formula',
      price: 25,
      description: 'Nootropic blend for mental clarity'
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Add Drinks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drinks.map((drink) => (
          <div 
            key={drink.name}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-white">{drink.name}</h3>
              <span className="text-sm text-white/60">
                {drink.price === 0 ? 'Free' : `${drink.price} AED`}
              </span>
            </div>
            <p className="text-sm text-white/60 mb-4">
              {drink.description}
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onAddToCart(drink.name, drink.price)}
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
