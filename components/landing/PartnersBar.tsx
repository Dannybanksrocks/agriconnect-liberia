'use client'

/* Trusted by / Partners bar — AGRIFRAM style */
const partners = [
  { name: 'Ministry of Agriculture',         abbr: 'MoA',    width: 'w-36' },
  { name: 'Ministry of Commerce & Industry', abbr: 'MCI',    width: 'w-44' },
  { name: 'World Food Programme',            abbr: 'WFP',    width: 'w-28' },
  { name: 'FAO Liberia',                     abbr: 'FAO',    width: 'w-24' },
  { name: 'USAID Feed the Future',           abbr: 'USAID',  width: 'w-32' },
]

export default function PartnersBar() {
  return (
    <section className="w-full py-12 bg-white border-b border-stone-100">
      <div className="container">
        <p className="text-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-8">
          Trusted &amp; Supported By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {partners.map((p) => (
            <div
              key={p.name}
              title={p.name}
              className={`${p.width} h-9 flex items-center justify-center`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#1B4332] flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-extrabold text-[#95D5B2] leading-none tracking-tight">
                    {p.abbr}
                  </span>
                </div>
                <span className="text-xs font-semibold text-stone-500 leading-tight">{p.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
