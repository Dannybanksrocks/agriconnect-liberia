'use client'

import { Leaf, X, Share, Download, MoreHorizontal, AlignJustify } from 'lucide-react'
import { usePWA } from '@/components/shared/PWAProvider'

type Step = { icon?: React.ReactNode; text: React.ReactNode }

function IOSSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="mt-3 bg-white/10 rounded-xl px-4 py-3 text-xs text-white/80 space-y-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <span className="leading-snug">{s.text}</span>
        </div>
      ))}
    </div>
  )
}

const BROWSER_STEPS = {
  safari: [
    { text: <>Tap the <Share className="w-3 h-3 inline mb-0.5" /> <strong>Share</strong> button at the bottom of Safari</> },
    { text: <>Scroll down and tap <strong>"Add to Home Screen"</strong></> },
    { text: <>Tap <strong>"Add"</strong> — AgriHub appears on your home screen</> },
  ],
  chrome: [
    { text: <>Tap the <MoreHorizontal className="w-3 h-3 inline mb-0.5" /> <strong>three-dot menu</strong> at the bottom right</> },
    { text: <>Tap <strong>"Add to Home Screen"</strong></> },
    { text: <>Tap <strong>"Add"</strong> to confirm</> },
  ],
  firefox: [
    { text: <>Tap the <AlignJustify className="w-3 h-3 inline mb-0.5" /> <strong>menu</strong> button at the bottom right</> },
    { text: <>Tap <strong>"Share"</strong> then <strong>"Add to Home Screen"</strong></> },
    { text: <>Tap <strong>"Add"</strong> to confirm</> },
  ],
  edge: [
    { text: <>Tap the <MoreHorizontal className="w-3 h-3 inline mb-0.5" /> <strong>three-dot menu</strong> at the bottom</> },
    { text: <>Tap <strong>"Add to Phone"</strong> or <strong>"Add to Home Screen"</strong></> },
    { text: <>Tap <strong>"Add"</strong> to confirm</> },
  ],
  other: [
    { text: <>Open <strong>Safari</strong> on your iPhone and visit this page for the best install experience</> },
    { text: <>Tap the <Share className="w-3 h-3 inline mb-0.5" /> <strong>Share</strong> button, then <strong>"Add to Home Screen"</strong></> },
  ],
}

const BROWSER_LABELS: Record<string, string> = {
  safari: 'Safari',
  chrome: 'Chrome',
  firefox: 'Firefox',
  edge: 'Edge',
  other: 'your browser',
}

export default function PWAInstallBanner() {
  const { canInstall, isIOS, iosBrowser, isStandalone, install, dismissed, dismiss } = usePWA()

  if (isStandalone || dismissed) return null
  if (!canInstall && !isIOS) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 pointer-events-none">
      <div className="relative max-w-sm mx-auto bg-[#1B4332] text-white rounded-2xl shadow-2xl border border-white/10 p-4 pointer-events-auto">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="w-11 h-11 rounded-xl bg-[#2D6A4F] flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-[#D8F3DC]" />
          </div>
          <div>
            <p className="font-bold text-sm leading-snug">Install AgriHub</p>
            <p className="text-xs text-white/60 mt-0.5 leading-snug">
              {isIOS
                ? `Add to your Home Screen from ${BROWSER_LABELS[iosBrowser]} — works offline too.`
                : 'Install for faster access, offline prices, and no browser bar.'}
            </p>
          </div>
        </div>

        {isIOS ? (
          <>
            <IOSSteps steps={BROWSER_STEPS[iosBrowser]} />
            {iosBrowser !== 'safari' && (
              <p className="text-center text-[10px] text-[#74C69D]/60 mt-2">
                Tip: opening in Safari gives the best install experience
              </p>
            )}
          </>
        ) : (
          <button
            onClick={install}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E9C46A] hover:bg-[#F4D58D] text-[#1B4332] font-bold text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Install App
          </button>
        )}

        <p className="text-center text-[10px] text-white/30 mt-2">Free · Works offline · No app store needed</p>
      </div>
    </div>
  )
}
