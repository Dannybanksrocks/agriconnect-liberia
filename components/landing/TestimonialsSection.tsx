'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    quote:
      'AgriConnect showed me that rice prices in Gbarnga market were L$40 higher than my village buyer. I transported my harvest and earned an extra L$8,000.',
    name: 'Fatu Kamara',
    role: 'Rice Farmer',
    county: 'Bong County',
  },
  {
    quote:
      'The weather alert warned me about heavy rain 3 days before it came. I harvested my pepper early and avoided losing the entire crop.',
    name: 'Musu Kollie',
    role: 'Vegetable Farmer',
    county: 'Nimba County',
  },
  {
    quote:
      'I followed the post-harvest storage tips and reduced my cassava losses from 40% to under 10%. Now I sell throughout the dry season when prices are higher.',
    name: 'Kou Siaffa',
    role: 'Cassava Farmer',
    county: 'Lofa County',
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const t = testimonials[current]

  return (
    <>
      {/* Testimonials Carousel */}
      <section className="w-full py-20 md:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-agri-text mb-3">
              Voices from the field
            </h2>
            <p className="text-lg text-agri-muted">
              Real stories from Liberian farmers using AgriConnect
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative min-h-[260px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center px-4"
                >
                  {/* Quote icon */}
                  <svg
                    className="w-10 h-10 mx-auto mb-6 text-primary/20"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>

                  <p className="text-xl md:text-2xl italic text-agri-text leading-relaxed mb-8">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div>
                    <p className="font-bold text-agri-text">{t.name}</p>
                    <p className="text-sm text-agri-muted">
                      {t.role}, {t.county}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot navigation */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'bg-primary w-8'
                      : 'bg-agri-border hover:bg-agri-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* USSD Callout */}
      <section className="w-full py-16 md:py-20 bg-primary-dark">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            No smartphone? No problem.
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Access AgriConnect on any mobile phone — no internet needed.
          </p>
          <div className="text-6xl md:text-7xl font-bold text-secondary mb-4">
            *347#
          </div>
          <p className="text-white/60 text-sm">
            Works on MTN, Orange, and Lonestar networks across Liberia
          </p>
        </div>
      </section>
    </>
  )
}
