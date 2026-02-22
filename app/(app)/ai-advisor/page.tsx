'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Sparkles, TrendingUp, TrendingDown, Calendar, AlertTriangle,
  Lightbulb, Send, Bot, User, RefreshCw, ChevronRight,
} from 'lucide-react'
import { cropRecommendations, priceForecasts, currentSeasonalInsight } from '@/lib/mock-data/ai-advisor'
import { processQuestion, getCurrentContext, SUGGESTED_QUESTIONS } from '@/lib/ai/crop-advisor-engine'
import type { AIResponse, AdvisorContext } from '@/lib/ai/crop-advisor-engine'
import { useAppStore } from '@/lib/store/useAppStore'

type Tab = 'recommendations' | 'forecasts' | 'seasonal' | 'ask'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  response?: AIResponse
  timestamp: Date
}

export default function AIAdvisorPage() {
  const user = useAppStore((s) => s.user)
  const [selectedTab, setSelectedTab] = useState<Tab>('recommendations')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const county = user?.county ?? 'Montserrado'
  const ctx: AdvisorContext = getCurrentContext(county)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  function sendQuestion(q: string) {
    const trimmed = q.trim()
    if (!trimmed || isThinking) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setQuestion('')
    setIsThinking(true)

    const thinkTime = 800 + Math.random() * 700
    setTimeout(() => {
      const response = processQuestion(trimmed, ctx)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.answer,
        response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsThinking(false)
    }, thinkTime)
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="page-title">AI Crop Advisor</h1>
            <p className="caption-text">{ctx.season} · {county} County · Liberia Context</p>
          </div>
        </div>
        <p className="body-text mt-1">
          Personalized planting, pest, market, and weather guidance powered by Liberian agricultural data.
        </p>
      </div>

      <div className="flex gap-1 border-b border-gray-100 overflow-x-auto">
        {(
          [
            { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
            { id: 'forecasts', label: 'Price Forecasts', icon: TrendingUp },
            { id: 'seasonal', label: 'Seasonal', icon: Calendar },
            { id: 'ask', label: 'Ask AI', icon: Bot },
          ] as { id: Tab; label: string; icon: React.ElementType }[]
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedTab(id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              selectedTab === id
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {selectedTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
            <Lightbulb className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                Recommendations based on current season, your location, and market conditions
              </p>
              <p className="text-xs text-green-700 mt-0.5">Updated daily with latest weather and market data</p>
            </div>
          </div>
          {cropRecommendations.map((rec) => (
            <CropRecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      )}

      {selectedTab === 'forecasts' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Market price forecasts powered by historical data and trend analysis
              </p>
              <p className="text-xs text-blue-700 mt-0.5">Plan your planting and selling strategy for maximum profit</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priceForecasts.map((forecast, idx) => (
              <PriceForecastCard key={idx} forecast={forecast} />
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'seasonal' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-heading">
                Current Season: {currentSeasonalInsight.currentPhase}
              </h2>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
                {currentSeasonalInsight.season === 'dry' ? 'Dry Season' : 'Rainy Season'}
              </span>
            </div>
            <p className="body-text mb-6">{currentSeasonalInsight.duration}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SeasonList
                icon={Lightbulb}
                iconClass="text-green-600"
                title="Recommendations"
                items={currentSeasonalInsight.recommendations}
                bulletClass="text-green-600"
                bullet="✓"
              />
              <SeasonList
                icon={AlertTriangle}
                iconClass="text-orange-500"
                title="Warnings"
                items={currentSeasonalInsight.warnings}
                bulletClass="text-orange-500"
                bullet="⚠"
              />
              <SeasonList
                icon={Sparkles}
                iconClass="text-green-700"
                title="Opportunities"
                items={currentSeasonalInsight.opportunities}
                bulletClass="text-green-700"
                bullet="→"
              />
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'ask' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '420px' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">AgriConnect AI Advisor</p>
                <p className="text-xs text-gray-500">{county} County · {ctx.season}</p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                Online
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '420px' }}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Ask me anything about farming in Liberia</p>
                  <p className="text-xs text-gray-400 mt-1">Planting, pests, prices, weather, soil, storage, finance</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-green-600 text-white rounded-tr-sm'
                          : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === 'ai' && msg.response?.tips && (
                      <div className="mt-2 space-y-1">
                        {msg.response.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-500 pl-2">
                            <ChevronRight className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.role === 'ai' && msg.response && (
                      <p className="text-xs text-gray-400 mt-1.5 pl-2">
                        Source: {msg.response.source}
                      </p>
                    )}
                    <p className={`text-xs text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'pl-2'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 text-green-600 animate-spin" />
                      <span className="text-xs text-gray-500">Analyzing your question...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            <div className="border-t border-gray-100 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendQuestion(question)}
                  placeholder="Ask about planting, pests, prices, weather..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={() => sendQuestion(question)}
                  disabled={!question.trim() || isThinking}
                  className="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Suggested Questions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuestion(q)}
                  className="text-left text-sm text-gray-700 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50 hover:text-green-800 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SeasonList({
  icon: Icon, iconClass, title, items, bulletClass, bullet,
}: {
  icon: React.ElementType
  iconClass: string
  title: string
  items: string[]
  bulletClass: string
  bullet: string
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
        <Icon className={`w-4 h-4 ${iconClass}`} />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
            <span className={`${bulletClass} mt-0.5 shrink-0`}>{bullet}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CropRecommendationCard({ recommendation }: { recommendation: any }) {
  const score = recommendation.recommendationScore
  const scoreColor = score >= 90 ? 'green' : score >= 75 ? 'blue' : 'yellow'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{recommendation.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{recommendation.cropName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded text-xs font-medium capitalize">
                {recommendation.seasonalFit} fit
              </span>
              <span className="px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-100 rounded text-xs font-medium capitalize">
                {recommendation.profitPotential} profit
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${scoreColor === 'green' ? 'text-green-600' : scoreColor === 'blue' ? 'text-blue-600' : 'text-yellow-600'}`}>
            {score}%
          </div>
          <div className="text-xs text-gray-400">Match Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <Stat label="Best Planting" value={recommendation.bestPlantingWindow.start} />
        <Stat label="Expected Yield" value={recommendation.expectedYieldPerAcre} />
        <Stat label="Price Range" value={`L$${recommendation.estimatedPriceRange.low}–${recommendation.estimatedPriceRange.high}`} />
        <Stat label="Market Outlook" value={recommendation.marketOutlook} capitalize />
      </div>

      <div className="space-y-4">
        <RecList title="Why This is Good" bullet="✓" bulletClass="text-green-600" items={recommendation.reasons} />
        <RecList title="Risks to Watch" bullet="⚠" bulletClass="text-orange-500" items={recommendation.risks} />
        <RecList title="Expert Tips" bullet="→" bulletClass="text-green-700" items={recommendation.tips} />
      </div>
    </div>
  )
}

function Stat({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-sm font-semibold text-gray-900 mt-0.5 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  )
}

function RecList({ title, bullet, bulletClass, items }: { title: string; bullet: string; bulletClass: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-1.5">
        <span className={bulletClass}>{bullet}</span> {title}
      </h4>
      <ul className="space-y-1 pl-5">
        {items.map((item: string, i: number) => (
          <li key={i} className="text-sm text-gray-600 list-disc">{item}</li>
        ))}
      </ul>
    </div>
  )
}

function PriceForecastCard({ forecast }: { forecast: any }) {
  const isRising = forecast.trend === 'rising'
  const isFalling = forecast.trend === 'falling'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{forecast.emoji}</span>
          <div>
            <h3 className="text-base font-bold text-gray-900">{forecast.cropName}</h3>
            <p className="text-xs text-gray-400">{forecast.timeframe}</p>
          </div>
        </div>
        {isRising && <TrendingUp className="w-5 h-5 text-green-600" />}
        {isFalling && <TrendingDown className="w-5 h-5 text-red-500" />}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400">Current Price</p>
          <p className="text-xl font-bold text-gray-900">L${forecast.currentPriceLRD}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Forecasted</p>
          <p className={`text-xl font-bold ${isRising ? 'text-green-600' : isFalling ? 'text-red-500' : 'text-gray-900'}`}>
            L${forecast.forecastedPriceLRD}
          </p>
        </div>
      </div>

      <div className={`flex items-center justify-between p-3 rounded-lg mb-4 ${
        isRising ? 'bg-green-50 border border-green-100' : isFalling ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'
      }`}>
        <span className="text-sm font-medium text-gray-700">Expected Change</span>
        <span className={`text-lg font-bold ${isRising ? 'text-green-600' : isFalling ? 'text-red-500' : 'text-gray-900'}`}>
          {forecast.priceChange > 0 ? '+' : ''}{forecast.changePercent}%
        </span>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Factors</h4>
        <ul className="space-y-1">
          {forecast.factors.map((factor: string, idx: number) => (
            <li key={idx} className="text-xs text-gray-600 pl-3 border-l-2 border-gray-100">{factor}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          forecast.confidence === 'high' ? 'bg-green-50 text-green-700 border border-green-100' :
          forecast.confidence === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
          'bg-gray-100 text-gray-600'
        }`}>
          {forecast.confidence.toUpperCase()} CONFIDENCE
        </span>
      </div>
    </div>
  )
}
