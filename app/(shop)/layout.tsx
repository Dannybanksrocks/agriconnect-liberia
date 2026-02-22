import type { Metadata } from 'next'
import ShopNavbar from '@/components/shop/ShopNavbar'
import ShopFooter from '@/components/shop/ShopFooter'

export const metadata: Metadata = {
  title: 'AgriHub Shop — Fresh Produce from Liberian Farmers',
  description: 'Buy fresh produce directly from verified Liberian farmers. No middlemen. Better prices. Pay with MTN MoMo or Orange Money.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <ShopNavbar />
      <main className="flex-1">
        {children}
      </main>
      <ShopFooter />
    </div>
  )
}
