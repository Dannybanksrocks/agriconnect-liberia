'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      'AgriHub showed me that rice prices in Gbarnga market were L$40 higher than my village buyer. I transported my harvest and earned an extra L$8,000 that season.',
    name: 'Fatu Kamara',
    role: 'Rice Farmer',
    county: 'Bong County',
    initials: 'FK',
    crop: 'Rice',
  },
  {
    quote:
      'The weather alert warned me about heavy rain 3 days before it came. I harvested my pepper early and avoided losing the entire crop. This app saved my livelihood.',
    name: 'Musu Kollie',
    role: 'Vegetable Farmer',
    county: 'Nimba County',
    initials: 'MK',
    crop: 'Pepper',
  },
  {
    quote:
      'I followed the post-harvest storage tips and cut cassava losses from 40% to under 10%. Now I sell through the dry season when prices are highest.',
    name: 'Kou Siaffa',
    role: 'Cassava Farmer',
    county: 'Lofa County',
    initials: 'KS',
    crop: 'Cassava',
  },
]

export default function TestimonialsSection() {
  return (
    <>
      {/* Testimonials */}
      <section className="w-full py-20 md:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#2D6A4F] uppercase bg-[#D8F3DC] px-4 py-1.5 rounded-full mb-4">
              Farmer Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E1A] tracking-tight">
              Voices from the field
            </h2>
            <p className="mt-3 text-lg text-stone-500">
              Real results from Liberian farmers using AgriHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative bg-white rounded-2xl border border-stone-200 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Quote icon */}
                <div className="absolute top-5 right-6 text-[#D8F3DC]">
                  <Quote className="w-8 h-8 fill-current" />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-[#E9C46A] fill-[#E9C46A]" />
                  ))}
                </div>

                {/* Crop tag */}
                <span className="inline-flex items-center text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider bg-[#D8F3DC] px-2.5 py-0.5 rounded-full mb-4">
                  {t.crop} Farmer
                </span>

                <p className="text-stone-700 leading-relaxed text-sm flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A2E1A]">{t.name}</p>
                    <p className="text-xs text-stone-500">{t.role} · {t.county}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USSD Callout */}
      <section className="relative w-full py-16 md:py-20 bg-[#1B4332] overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(233,196,106,0.1) 0%, transparent 60%)' }}
        />

        <div className="container relative z-10 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#E9C46A] uppercase bg-[#E9C46A]/10 border border-[#E9C46A]/20 px-4 py-1.5 rounded-full mb-6">
            No Smartphone Required
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Access AgriHub from any mobile phone
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
            No internet? No problem. Just dial from MTN, Orange, or Lonestar — anywhere in Liberia.
          </p>
          <div className="font-mono text-5xl md:text-7xl font-extrabold text-[#E9C46A] mb-3 tracking-tight">
            *347#
          </div>
          <p className="text-white/40 text-sm">Available on all Liberian mobile networks</p>
        </div>
      </section>
    </>
  )
}
