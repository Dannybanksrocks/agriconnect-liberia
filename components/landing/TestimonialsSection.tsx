'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    quote:
      'AgriConnect showed me that rice prices in Gbarnga market were L$40 higher than my village buyer. I transported my harvest and earned an extra L$8,000.',
    name: 'Fatu Kamara',
    role: 'Rice Farmer',
    county: 'Bong County',
    initials: 'FK',
  },
  {
    quote:
      'The weather alert warned me about heavy rain 3 days before it came. I harvested my pepper early and avoided losing the entire crop.',
    name: 'Musu Kollie',
    role: 'Vegetable Farmer',
    county: 'Nimba County',
    initials: 'MK',
  },
  {
    quote:
      'I followed the post-harvest storage tips and reduced my cassava losses from 40% to under 10%. Now I sell throughout the dry season when prices are higher.',
    name: 'Kou Siaffa',
    role: 'Cassava Farmer',
    county: 'Lofa County',
    initials: 'KS',
  },
]

export default function TestimonialsSection() {
  return (
    <>
      {/* Testimonials */}
      <section className="w-full py-20 md:py-28 bg-gray-50">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-green-600 uppercase mb-4">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Voices from the field
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Real stories from Liberian farmers using AgriConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}, {t.county}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USSD Callout */}
      <section className="w-full py-16 md:py-20 bg-green-600">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            No smartphone? No problem.
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto">
            Access AgriConnect on any mobile phone — no internet needed.
          </p>
          <div className="font-mono text-5xl md:text-6xl font-bold text-white mb-4">
            *347#
          </div>
          <p className="text-green-200 text-sm">
            Works on MTN, Orange, and Lonestar networks across Liberia
          </p>
        </div>
      </section>
    </>
  )
}
