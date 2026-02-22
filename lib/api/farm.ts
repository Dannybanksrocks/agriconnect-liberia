import type { FarmCrop } from '@/lib/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getFarmCrops(
  userId: string
): Promise<FarmCrop[]> {
  await delay(300)
  void userId
  return []
}

export async function addFarmCrop(
  crop: Omit<FarmCrop, 'id'>
): Promise<FarmCrop> {
  await delay(300)
  return {
    ...crop,
    id: `fc-${Date.now()}`,
  }
}

export async function updateFarmCrop(
  id: string,
  data: Partial<FarmCrop>
): Promise<FarmCrop> {
  await delay(300)
  return {
    id,
    cropId: data.cropId ?? '',
    cropName: data.cropName ?? '',
    emoji: data.emoji ?? '',
    areaAcres: data.areaAcres ?? 0,
    plantedDate: data.plantedDate ?? '',
    expectedHarvestDate: data.expectedHarvestDate ?? '',
    status: data.status ?? 'growing',
    notes: data.notes ?? '',
    currentPriceLD: data.currentPriceLD ?? 0,
  }
}

export async function removeFarmCrop(id: string): Promise<void> {
  await delay(200)
  void id
}
