import { weatherForecasts, getWeatherByCounty } from '@/lib/mock-data/weather'
import type { WeatherForecast } from '@/lib/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getWeatherForecast(
  county: string
): Promise<WeatherForecast | null> {
  await delay(300)
  return getWeatherByCounty(county) ?? null
}

export async function getAllWeatherForecasts(): Promise<WeatherForecast[]> {
  await delay(300)
  return weatherForecasts
}
