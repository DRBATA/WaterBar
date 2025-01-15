'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const experiences = [
  {
    title: 'The Connection Experience',
    description: 'Join a vibrant community of conscious individuals seeking deeper connections. Our signature social gatherings create space for authentic interactions, meaningful dialogue, and personal growth.',
    special: 'Each gathering features thoughtfully curated activities and conversation catalysts, fostering an environment where diverse perspectives flourish and genuine connections naturally emerge.',
    highlight: 'Part of The Water Bar community experience',
    image: '/wellness/connection.jpg'
  },
  {
    title: 'Movement & Functional Fitness',
    description: 'Transform your body and mind through our premium movement sessions. Combining yoga, stretching, and functional fitness, these expert-led classes are designed to enhance your physical capabilities while fostering mind-body connection.',
    special: 'Led by certified instructors specializing in functional movement, injury prevention, and rehabilitation. Sessions are tailored to your unique needs, whether you are a beginner or advanced practitioner.',
    highlight: 'Premium experience - Additional booking required',
    image: '/wellness/yoga.jpg'
  },
  {
    title: 'Ice Bath Journey',
    description: 'Challenge your limits and discover inner strength through our guided ice bath experiences. This powerful practice combines breath work, cold exposure, and meditation for a transformative journey of physical and mental resilience.',
    special: 'Each session is carefully monitored by our trained facilitators who guide you through proper breathing techniques and mental preparation. Experience the scientifically-proven benefits of cold therapy in a safe, controlled environment.',
    highlight: 'Reservation required - Limited availability',
    image: '/wellness/ice-bath.jpg'
  },
  {
    title: 'Sober Rave Experience',
    description: 'Rediscover the pure joy of dance and movement in our signature alcohol-free party environment. Experience the natural high of rhythmic movement, community connection, and conscious celebration.',
    special: 'Our sober raves feature world-class DJs, immersive lighting, and a vibrant community of conscious party-goers. Feel the freedom to express yourself fully while staying clear-headed and present.',
    highlight: 'Included with your subscription',
    image: '/wellness/dance.jpg'
  },
  {
    title: 'The Water Bar Experience',
    description: 'Discover our innovative beverage program featuring craft non-alcoholic cocktails and functional wellness drinks. Each creation combines premium adaptogens, nootropics, and botanical extracts to enhance your vitality.',
    special: 'Our menu showcases unique blends of ashwagandha, rhodiola, lion\'s mane, and other powerful adaptogens. Experience the future of conscious drinking, crafted to elevate both body and mind.',
    highlight: 'Coming soon to locations across UAE',
    image: '/wellness/elixir-bar.jpg'
  }
]

export function WellnessCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % experiences.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext()
    }
    if (touchStart - touchEnd < -75) {
      handlePrev()
    }
  }

  return (
    <div className="mt-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Blended Wellness Experiences
        </h2>
        <p className="text-white/60">
          Explore Transformative Journeys
        </p>
        <p className="text-white/60 mt-2 max-w-2xl mx-auto">
          Discover experiences designed to help you thrive. Each offering integrates advanced techniques and mindful practices, creating a powerful blend of movement, healing, and self-discovery.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div 
          className="overflow-hidden rounded-xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="min-w-full px-4"
              >
                <div className="relative h-[400px] rounded-xl overflow-hidden group">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-2xl font-medium mb-3">{exp.title}</h3>
                      <p className="text-white/80 text-lg leading-relaxed mb-4">
                        {exp.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/20 space-y-4">
                        <div>
                          <h4 className="text-lg font-medium mb-2 text-white/90">Why It&apos;s Special:</h4>
                          <p className="text-white/70">
                            {exp.special}
                          </p>
                        </div>
                        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm text-white/90">
                          {exp.highlight}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        <div className="flex justify-center mt-4 space-x-2">
          {experiences.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-white/60 text-sm mt-8 max-w-2xl mx-auto">
        These experiences are more than activities—they are journeys toward better health, deeper self-awareness, and renewed energy. Whether you&apos;re seeking physical recovery, emotional balance, or a boost in vitality, our expert practitioners are here to guide you every step of the way.
      </p>
    </div>
  )
}
