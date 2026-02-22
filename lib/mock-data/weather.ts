import type { WeatherForecast } from '@/lib/types'

type Region = 'coastal' | 'central' | 'interior'

function createSeededRng(seed: number) {
  let s = seed
  return (): number => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function lerp(a: number, b: number, t: number): number {
  return Math.round((a + (b - a) * t) * 10) / 10
}

const COUNTY_CONFIGS: Array<{ name: string; region: Region }> = [
  { name: 'Bomi', region: 'coastal' },
  { name: 'Bong', region: 'central' },
  { name: 'Gbarpolu', region: 'interior' },
  { name: 'Grand Bassa', region: 'coastal' },
  { name: 'Grand Cape Mount', region: 'coastal' },
  { name: 'Grand Gedeh', region: 'interior' },
  { name: 'Grand Kru', region: 'coastal' },
  { name: 'Lofa', region: 'interior' },
  { name: 'Margibi', region: 'central' },
  { name: 'Maryland', region: 'coastal' },
  { name: 'Montserrado', region: 'coastal' },
  { name: 'Nimba', region: 'interior' },
  { name: 'River Cess', region: 'coastal' },
  { name: 'River Gee', region: 'coastal' },
  { name: 'Sinoe', region: 'coastal' },
]

const REGION_RANGES: Record<Region, {
  tempMin: number; tempMax: number
  humidityMin: number; humidityMax: number
  nightBase: [number, number]; peakBase: [number, number]
}> = {
  coastal:  { tempMin: 27, tempMax: 32, humidityMin: 75, humidityMax: 90, nightBase: [23, 25], peakBase: [30, 33] },
  central:  { tempMin: 26, tempMax: 31, humidityMin: 70, humidityMax: 85, nightBase: [23, 25], peakBase: [29, 32] },
  interior: { tempMin: 24, tempMax: 30, humidityMin: 60, humidityMax: 80, nightBase: [22, 24], peakBase: [28, 31] },
}

const WIND_DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const

const DRY_SEASON_CONDITIONS: Array<WeatherForecast['current']['condition']> = [
  'sunny', 'sunny', 'partly-cloudy', 'partly-cloudy', 'sunny',
]

const HOURS = [
  '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM',
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
  '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM',
]

const TEMP_CURVE = [
  0.15, 0.12, 0.08, 0.05, 0.03, 0.05,
  0.15, 0.30, 0.50, 0.65, 0.80, 0.90,
  0.95, 1.00, 0.98, 0.92, 0.85, 0.75,
  0.60, 0.45, 0.35, 0.28, 0.22, 0.18,
]

const DAILY_DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const
const DAILY_DATES = ['Feb 22', 'Feb 23', 'Feb 24', 'Feb 25', 'Feb 26', 'Feb 27', 'Feb 28'] as const

const CURRENT_DESCRIPTIONS: Record<string, string[]> = {
  sunny: [
    'Clear skies with bright harmattan sunshine',
    'Warm and sunny with light haze from harmattan winds',
    'Bright sunshine with dry northeast trade winds',
    'Hot and sunny with excellent visibility',
  ],
  'partly-cloudy': [
    'Partly cloudy with harmattan winds from the northeast',
    'Light cloud cover with dry, warm conditions',
    'Mix of sun and clouds with comfortable breeze',
    'Scattered high clouds with warm temperatures',
  ],
}

const DAILY_DESCRIPTIONS: Record<string, string[]> = {
  sunny: [
    'Bright and sunny throughout',
    'Clear skies expected all day',
    'Warm sunshine with light breeze',
    'Hot and dry with strong sun',
  ],
  'partly-cloudy': [
    'Mix of sun and clouds',
    'Partly cloudy with dry spells',
    'Some clouds in the afternoon',
    'Morning sun giving way to light clouds',
  ],
  cloudy: [
    'Overcast skies with harmattan haze',
    'Mostly cloudy with mild temperatures',
    'Cloud cover persists through the day',
    'Hazy and overcast with dry air',
  ],
}

const PLANTING_WINDOWS = [
  'Late March to early April — prepare fields now',
  'March onward — begin clearing and composting',
  'Early April — optimal for rice and cassava planting',
  'Mid-March — start nursery preparations',
  'Late March — ideal for vegetable transplanting',
]

const HARVEST_CONDITIONS = [
  'Excellent — dry weather supports post-harvest drying',
  'Good — low humidity aids crop storage and processing',
  'Very good — minimal rain risk for harvested crops',
  'Favorable — steady dry conditions ideal for cocoa drying',
  'Optimal — consistent sunshine for grain drying',
]

const ALERT_POOL: Array<{ type: 'warning' | 'info' | 'success'; message: string }> = [
  { type: 'success', message: 'Optimal conditions for cocoa drying this week' },
  { type: 'success', message: 'Good conditions for rice paddy preparation' },
  { type: 'success', message: 'Cassava harvest conditions are excellent' },
  { type: 'success', message: 'Ideal weather for drying harvested pepper crops' },
  { type: 'success', message: 'Favorable drying conditions for palm oil processing' },
  { type: 'warning', message: 'Harmattan dust may affect new seedlings — use mulching' },
  { type: 'warning', message: 'Low soil moisture — irrigate young transplants regularly' },
  { type: 'warning', message: 'UV index high — protect nursery seedlings with shade cloth' },
  { type: 'warning', message: 'Dry winds may increase fire risk on cleared farmland' },
  { type: 'warning', message: 'Water sources receding — plan irrigation carefully' },
  { type: 'info', message: 'Dry season land preparation recommended before March rains' },
  { type: 'info', message: 'Consider applying compost to fields ahead of planting season' },
  { type: 'info', message: 'Seed procurement advisory: plan purchases for March planting' },
  { type: 'info', message: 'Brush clearing best completed this month before rains begin' },
  { type: 'info', message: 'Soil testing recommended during dry season for nutrient planning' },
]

function pickFrom<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

function generateForecast(name: string, region: Region): WeatherForecast {
  const rng = createSeededRng(hashString(name))
  const range = REGION_RANGES[region]

  const currentTemp = lerp(range.tempMin, range.tempMax, rng())
  const condition = pickFrom(DRY_SEASON_CONDITIONS, rng)
  const descKey = condition === 'cloudy' ? 'partly-cloudy' : condition
  const descPool = CURRENT_DESCRIPTIONS[descKey] ?? CURRENT_DESCRIPTIONS['sunny']

  const current: WeatherForecast['current'] = {
    temp: currentTemp,
    feelsLike: Math.round((currentTemp + 1 + rng() * 2) * 10) / 10,
    humidity: Math.round(lerp(range.humidityMin, range.humidityMax, rng())),
    windSpeed: Math.round((8 + rng() * 10) * 10) / 10,
    windDirection: pickFrom(WIND_DIRECTIONS, rng),
    uvIndex: Math.round(6 + rng() * 3),
    rainChance: Math.round(5 + rng() * 20),
    condition,
    description: pickFrom(descPool, rng),
  }

  const nightMin = range.nightBase[0] + rng() * (range.nightBase[1] - range.nightBase[0])
  const peakMax = range.peakBase[0] + rng() * (range.peakBase[1] - range.peakBase[0])
  const hourly: WeatherForecast['hourly'] = HOURS.map((hour, i) => {
    const baseTemp = nightMin + (peakMax - nightMin) * TEMP_CURVE[i]
    const jitter = (rng() - 0.5) * 1.5
    return {
      hour,
      temp: Math.round((baseTemp + jitter) * 10) / 10,
      rainChance: Math.round(3 + rng() * 15),
      condition: rng() > 0.7 ? 'partly-cloudy' : 'sunny',
    }
  })

  const daily: WeatherForecast['daily'] = DAILY_DAYS.map((day, i) => {
    const roll = rng()
    const dayCondition = roll < 0.45 ? 'sunny' : roll < 0.8 ? 'partly-cloudy' : 'cloudy'
    const high = Math.round((range.tempMax - 1 + rng() * 2) * 10) / 10
    const low = Math.round((range.tempMin - 2 + rng() * 2) * 10) / 10
    const dayRain = dayCondition === 'cloudy'
      ? Math.round(20 + rng() * 15)
      : Math.round(5 + rng() * 15)
    return {
      day,
      date: DAILY_DATES[i],
      high,
      low,
      rainChance: dayRain,
      condition: dayCondition,
      description: pickFrom(DAILY_DESCRIPTIONS[dayCondition], rng),
    }
  })

  const rainyDayCount = 3 + Math.floor(rng() * 3)
  const rainyDayIndices = new Set<number>()
  for (let r = 0; r < rainyDayCount; r++) {
    rainyDayIndices.add(Math.floor(rng() * 30))
  }

  const rainfall30d: WeatherForecast['rainfall30d'] = []
  for (let d = 0; d < 30; d++) {
    const isJan = d < 9
    const month = isJan ? 'Jan' : 'Feb'
    const dayNum = isJan ? d + 23 : d - 8
    rainfall30d.push({
      date: `${month} ${dayNum}`,
      mm: rainyDayIndices.has(d) ? Math.round((2 + rng() * 6) * 10) / 10 : 0,
    })
  }

  const alertCount = 2 + Math.floor(rng() * 2)
  const usedAlertIndices = new Set<number>()
  const alerts: WeatherForecast['agricultural']['alerts'] = []
  for (let a = 0; a < alertCount; a++) {
    let idx = Math.floor(rng() * ALERT_POOL.length)
    while (usedAlertIndices.has(idx)) {
      idx = (idx + 1) % ALERT_POOL.length
    }
    usedAlertIndices.add(idx)
    alerts.push(ALERT_POOL[idx])
  }

  return {
    county: name,
    current,
    hourly,
    daily,
    rainfall30d,
    agricultural: {
      plantingWindow: pickFrom(PLANTING_WINDOWS, rng),
      harvestCondition: pickFrom(HARVEST_CONDITIONS, rng),
      alerts,
    },
  }
}

export const weatherForecasts: WeatherForecast[] = COUNTY_CONFIGS.map(({ name, region }) =>
  generateForecast(name, region)
)

export function getWeatherByCounty(county: string): WeatherForecast | undefined {
  return weatherForecasts.find(
    (f) => f.county.toLowerCase() === county.toLowerCase()
  )
}
