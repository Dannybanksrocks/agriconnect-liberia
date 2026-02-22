export const CROP_IMAGES: Record<string, string> = {
  Rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=500&fit=crop',
  Cassava: 'https://images.unsplash.com/photo-1595351298020-038700609878?w=800&h=500&fit=crop',
  Rubber: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&h=500&fit=crop',
  'Rubber Latex': 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&h=500&fit=crop',
  Cocoa: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=500&fit=crop',
  'Cocoa Beans': 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=500&fit=crop',
  Coffee: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=500&fit=crop',
  'Palm Oil': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
  Sugarcane: 'https://images.unsplash.com/photo-1576313232430-8e42c6bfed5d?w=800&h=500&fit=crop',
  Plantain: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=500&fit=crop',
  Banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=500&fit=crop',
  Yam: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=500&fit=crop&auto=format',
  'Sweet Potato': 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=800&h=500&fit=crop&auto=format',
  Groundnut: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=800&h=500&fit=crop&auto=format',
  Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=500&fit=crop',
  'Hot Pepper': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=500&fit=crop',
  Pepper: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=500&fit=crop',
  Okra: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&h=500&fit=crop',
  Eggplant: 'https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=800&h=500&fit=crop',
  Cabbage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&h=500&fit=crop',
  Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&h=500&fit=crop',
  Watermelon: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=500&fit=crop',
  Pineapple: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&h=500&fit=crop',
  Maize: 'https://images.unsplash.com/photo-1551888138-d18ed4cbdcbb?w=800&h=500&fit=crop&auto=format',
  Corn: 'https://images.unsplash.com/photo-1551888138-d18ed4cbdcbb?w=800&h=500&fit=crop&auto=format',
  Cocoyam: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800&h=500&fit=crop',
}

export const CATEGORY_IMAGES: Record<string, string> = {
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=500&fit=crop',
  cassava: 'https://images.unsplash.com/photo-1595351298020-038700609878?w=800&h=500&fit=crop',
  vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=500&fit=crop',
  soil: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop',
  'pest-control': 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&h=500&fit=crop',
  'post-harvest': 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&h=500&fit=crop',
}

export const FARM_IMAGES = [
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop',
]

export const LIBERIA_FARM_IMAGES = [
  '/images/rice-harvest-1.jpg',
  '/images/cassava-harvest-1.jpg',
  '/images/plantain-harvest-1.jpg',
  '/images/pepper-harvest-1.jpg',
]

export const FALLBACK_CROP_IMAGE = 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=500&fit=crop'

export function getCropImage(cropName: string): string {
  const key = Object.keys(CROP_IMAGES).find(
    (k) => k.toLowerCase() === cropName.toLowerCase()
  )
  return key ? CROP_IMAGES[key] : FALLBACK_CROP_IMAGE
}

export function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? FALLBACK_CROP_IMAGE
}
