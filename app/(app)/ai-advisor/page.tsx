'use client'

import { useState } from 'react'
import { Sparkles, TrendingUp, TrendingDown, Calendar, AlertTriangle, Lightbulb, Search, Send } from 'lucide-react'
import { cropRecommendations, priceForecasts, currentSeasonalInsight, sampleAIQuestions } from '@/lib/mock-data/ai-advisor'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

export default function AIAdvisorPage() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<'recommendations' | 'forecasts' | 'seasonal' | 'ask'>('recommendations')
  const [question, setQuestion] = useState('')

  const handleAskQuestion = () => {
    if (!question.trim()) {
      toast.error('Please enter a question')
      return
    }
    
    // Simulate AI response
    toast.success('AI is analyzing your question...', {
      description: 'You will receive a detailed answer shortly.',
    })
    setQuestion('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Crop Advisor</h1>
            <p className="text-gray-600 dark:text-gray-400">Personalized for {user?.county}</p>
          </div>
        </div>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Get intelligent recommendations on what to plant, when to plant, and market forecasts powered by AI
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        <TabButton
          active={selectedTab === 'recommendations'}
          onClick={() => setSelectedTab('recommendations')}
          icon={Sparkles}
          label="Crop Recommendations"
        />
        <TabButton
          active={selectedTab === 'forecasts'}
          onClick={() => setSelectedTab('forecasts')}
          icon={TrendingUp}
          label="Price Forecasts"
        />
        <TabButton
          active={selectedTab === 'seasonal'}
          onClick={() => setSelectedTab('seasonal')}
          icon={Calendar}
          label="Seasonal Insights"
        />
        <TabButton
          active={selectedTab === 'ask'}
          onClick={() => setSelectedTab('ask')}
          icon={Send}
          label="Ask AI"
        />
      </div>

      {/* Content */}
      {selectedTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-100">
                  Recommendations based on current season, your location, and market conditions
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Updated daily with latest weather and market data
                </p>
              </div>
            </div>
          </div>

          {cropRecommendations.map((rec) => (
            <CropRecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      )}

      {selectedTab === 'forecasts' && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Market price forecasts powered by historical data and trend analysis
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Plan your planting and selling strategy for maximum profit
                </p>
              </div>
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
          {/* Current Season */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Current Season: {currentSeasonalInsight.currentPhase}
              </h2>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                {currentSeasonalInsight.season === 'dry' ? '☀️ Dry Season' : '🌧️ Rainy Season'}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{currentSeasonalInsight.duration}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recommendations */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {currentSeasonalInsight.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Warnings
                </h3>
                <ul className="space-y-2">
                  {currentSeasonalInsight.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Opportunities
                </h3>
                <ul className="space-y-2">
                  {currentSeasonalInsight.opportunities.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-purple-600 dark:text-purple-400 mt-0.5">💡</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'ask' && (
        <div className="space-y-6">
          {/* Ask Question */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ask the AI Advisor</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get instant answers to your farming questions from our AI-powered advisor
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="Ask anything about planting, pests, harvest, prices..."
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleAskQuestion}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Ask
              </button>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleAIQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuestion(q)}
                  className="text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                    {q}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
        active
          ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}

function CropRecommendationCard({ recommendation }: any) {
  const scoreColor = recommendation.recommendationScore >= 90 ? 'green' : recommendation.recommendationScore >= 75 ? 'blue' : 'yellow'
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{recommendation.emoji}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{recommendation.cropName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 bg-${scoreColor}-100 dark:bg-${scoreColor}-900/30 text-${scoreColor}-700 dark:text-${scoreColor}-300 rounded text-xs font-medium capitalize`}>
                {recommendation.seasonalFit} fit
              </span>
              <span className={`px-2 py-0.5 bg-${scoreColor}-100 dark:bg-${scoreColor}-900/30 text-${scoreColor}-700 dark:text-${scoreColor}-300 rounded text-xs font-medium capitalize`}>
                {recommendation.profitPotential} profit
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold text-${scoreColor}-600 dark:text-${scoreColor}-400`}>
            {recommendation.recommendationScore}%
          </div>
          <div className="text-xs text-gray-500">Match Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Best Planting</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {recommendation.bestPlantingWindow.start}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Expected Yield</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{recommendation.expectedYieldPerAcre}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Price Range</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            L${recommendation.estimatedPriceRange.low}-{recommendation.estimatedPriceRange.high}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Market Outlook</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{recommendation.marketOutlook}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="text-green-600">✓</span> Why This is Good
          </h4>
          <ul className="space-y-1">
            {recommendation.reasons.map((reason: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 pl-6">• {reason}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="text-orange-600">⚠</span> Risks to Watch
          </h4>
          <ul className="space-y-1">
            {recommendation.risks.map((risk: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 pl-6">• {risk}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="text-purple-600">💡</span> Expert Tips
          </h4>
          <ul className="space-y-1">
            {recommendation.tips.map((tip: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 pl-6">• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function PriceForecastCard({ forecast }: any) {
  const isRising = forecast.trend === 'rising'
  const isFalling = forecast.trend === 'falling'
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{forecast.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{forecast.cropName}</h3>
            <p className="text-xs text-gray-500">{forecast.timeframe}</p>
          </div>
        </div>
        {isRising && <TrendingUp className="w-6 h-6 text-green-600" />}
        {isFalling && <TrendingDown className="w-6 h-6 text-red-600" />}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Current Price</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            L${forecast.currentPriceLRD}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Forecasted</p>
          <p className={`text-xl font-bold ${isRising ? 'text-green-600' : isFalling ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            L${forecast.forecastedPriceLRD}
          </p>
        </div>
      </div>

      <div className={`flex items-center justify-between p-3 rounded-lg mb-4 ${
        isRising ? 'bg-green-50 dark:bg-green-900/20' : isFalling ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'
      }`}>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expected Change</span>
        <span className={`text-lg font-bold ${isRising ? 'text-green-600' : isFalling ? 'text-red-600' : 'text-gray-900'}`}>
          {forecast.priceChange > 0 ? '+' : ''}{forecast.changePercent}%
        </span>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Key Factors</h4>
        <ul className="space-y-1">
          {forecast.factors.map((factor: string, idx: number) => (
            <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 pl-4">• {factor}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          forecast.confidence === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
          forecast.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }`}>
          {forecast.confidence.toUpperCase()} CONFIDENCE
        </span>
      </div>
    </div>
  )
}
