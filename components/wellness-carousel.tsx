'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const experiences = [
  {
    title: 'Massage Therapy',
    description: 'Experience deeply therapeutic massage sessions designed to release tension, improve mobility, and restore emotional balance.',
    special: 'Incorporates somatic resilience techniques to support stress release and regulate the nervous system, led by practitioners trained in neuro-affective touch and trauma recovery.',
    image: '/wellness/connection.jpg'
  },
  {
    title: 'Private Yoga Sessions',
    description: 'Personalized yoga sessions tailored to your unique body and movement goals. Perfect for improving flexibility, posture, and inner balance.',
    special: 'Grounded in functional training principles to enhance everyday movement, with modifications for post-pregnancy fitness and joint health. Sessions may include somatic movement therapy to deepen mind-body connection.',
    image: '/wellness/yoga.jpg'
  },
  {
    title: 'Guided Meditation',
    description: 'Let go of stress and cultivate clarity with mindfulness practices led by somatic wellness experts.',
    special: 'Integrates techniques from psychosomatic therapy, including trauma-sensitive mindfulness and somatic experiencing, to help process stress, regulate emotions, and improve mental well-being.',
    image: '/wellness/ice-bath.jpg'
  },
  {
    title: 'Personal Training',
    description: 'Work with a functional fitness specialist to improve strength, flexibility, and overall movement quality.',
    special: 'Tailored for your unique needs, whether you&apos;re recovering from injury, addressing joint necrosis or scoliosis, or working on post-pregnancy fitness. Sessions blend functional training with somatic practices to build resilience and mobility.',
    image: '/wellness/dance.jpg'
  },
  {
    title: 'Ice Bath & Meditation',
    description: 'Immerse yourself in a guided ice bath experience paired with mindfulness meditation. Perfect for physical recovery and mental clarity.',
    special: 'Facilitated by experts in somatic resilience, this practice is designed to activate your body&apos;s natural healing responses while calming the nervous system.',
    image: '/wellness/ice-bath.jpg'
  },
  {
    title: 'Ecstatic Dance & Somatic Healing',
    description: 'Move freely in a guided dance experience rooted in somatic healing practices. Feel the joy of uninhibited movement while releasing stored tension and emotions.',
    special: 'Led by a certified somatic practitioner, this session blends movement therapy with techniques for processing trauma and fostering emotional resilience.',
    image: '/wellness/dance.jpg'
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
    <div className="mt-16 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Blended Wellness Experiences
        </h2>
        <p className="text-white/60">
          Book Your Transformative Wellness Journey
        </p>
        <p className="text-white/60 mt-2 max-w-2xl mx-auto">
          Choose from a range of expertly guided wellness experiences designed to help you thrive. Each session integrates advanced psychosomatic techniques and functional physical training, creating a powerful blend of movement, healing, and self-discovery.
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
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <h4 className="text-lg font-medium mb-2 text-white/90">Why It's Special:</h4>
                        <p className="text-white/70">
                          {exp.special}
                        </p>
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
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
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
        These experiences are more than activities—they are journeys toward better health, deeper self-awareness, and renewed energy. Whether you're seeking physical recovery, emotional balance, or a boost in vitality, our expert practitioners are here to guide you every step of the way.
      </p>
    </div>
  )
}
