import type { Alert } from '@/lib/types'

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'weather',
    severity: 'critical',
    title: 'Heavy Rainfall Warning — Nimba County',
    description:
      'The Liberia Meteorological Service warns of heavy rainfall (80-120mm) expected in Nimba County from February 24-26. Lowland farms are at risk of flash flooding. Move harvested crops to higher ground immediately.',
    county: 'Nimba',
    read: false,
    createdAt: '2024-11-21T06:00:00Z',
  },
  {
    id: 'alert-2',
    type: 'weather',
    severity: 'critical',
    title: 'Strong Winds Advisory — Bong County',
    description:
      'Harmattan winds gusting up to 45 km/h forecast for Bong County over the next 48 hours. Secure crop drying areas and protect newly planted seedlings with windbreaks.',
    county: 'Bong',
    read: false,
    createdAt: '2024-11-20T14:30:00Z',
  },
  {
    id: 'alert-3',
    type: 'weather',
    severity: 'critical',
    title: 'Flood Risk Alert — Grand Bassa County',
    description:
      'River levels near Buchanan are rising following upstream rainfall. Farms along the St. John River basin should prepare for possible minor flooding within 72 hours.',
    county: 'Grand Bassa',
    read: true,
    createdAt: '2024-11-19T09:15:00Z',
  },
  {
    id: 'alert-4',
    type: 'price',
    severity: 'warning',
    title: 'Rice Prices Up 8% in Montserrado',
    description:
      'Local rice prices in Monrovia markets have increased by 8.2% over the past week, driven by reduced supply from upcountry. Current price: L$345/kg. Consider selling if you have stored rice.',
    county: 'Montserrado',
    crop: 'Rice',
    read: false,
    createdAt: '2024-11-21T08:00:00Z',
  },
  {
    id: 'alert-5',
    type: 'price',
    severity: 'info',
    title: 'Cocoa Prices Up 12% — Dry Season Premium',
    description:
      'Well-fermented and properly dried cocoa is fetching L$420/kg in Nimba and Lofa counties — a 12% increase. Ensure proper fermentation (5-7 days) and drying to get premium prices.',
    crop: 'Cocoa',
    read: false,
    createdAt: '2024-11-20T10:00:00Z',
  },
  {
    id: 'alert-6',
    type: 'price',
    severity: 'warning',
    title: 'Palm Oil Price Drop in Margibi',
    description:
      'Palm oil prices in Kakata market have dropped 6.5% to L$185/liter as production peaks during dry season. Consider holding stock if you have adequate storage.',
    county: 'Margibi',
    crop: 'Palm Oil',
    read: true,
    createdAt: '2024-11-19T16:00:00Z',
  },
  {
    id: 'alert-7',
    type: 'price',
    severity: 'info',
    title: 'Hot Pepper Prices Stable Across Counties',
    description:
      'Hot pepper prices remain stable at L$180-210/kg across most counties. Dry season supply is adequate. No significant changes expected in the next two weeks.',
    crop: 'Hot Pepper',
    read: true,
    createdAt: '2024-11-18T12:00:00Z',
  },
  {
    id: 'alert-8',
    type: 'agronomy',
    severity: 'critical',
    title: 'Fall Armyworm Outbreak — Bong & Nimba',
    description:
      'Fall armyworm infestations have been reported in maize fields across Bong and Nimba counties. Inspect your crops immediately. Apply neem-based organic pesticide or contact your local extension officer for treatment options.',
    county: 'Bong',
    crop: 'Corn',
    read: false,
    createdAt: '2024-11-21T07:00:00Z',
  },
  {
    id: 'alert-9',
    type: 'agronomy',
    severity: 'info',
    title: 'Optimal Cassava Planting Window Approaching',
    description:
      'The optimal window for cassava planting in interior counties begins in late March as early rains arrive. Prepare your land now — clear, till, and apply compost for best results.',
    read: false,
    createdAt: '2024-11-20T09:00:00Z',
  },
  {
    id: 'alert-10',
    type: 'agronomy',
    severity: 'warning',
    title: 'Cassava Mosaic Virus Detected — Lofa County',
    description:
      'Cassava mosaic virus has been confirmed in several farms in Voinjama district. Remove and burn infected plants immediately. Use only disease-free planting material for new crops.',
    county: 'Lofa',
    crop: 'Cassava',
    read: true,
    createdAt: '2024-11-18T11:00:00Z',
  },
  {
    id: 'alert-11',
    type: 'agronomy',
    severity: 'info',
    title: 'Dry Season Vegetable Guide Available',
    description:
      'A new comprehensive guide on dry season vegetable gardening using raised beds and mulching is now available in the Tips section. Includes water-saving techniques ideal for February-April planting.',
    read: false,
    createdAt: '2024-11-19T08:00:00Z',
  },
  {
    id: 'alert-12',
    type: 'system',
    severity: 'info',
    title: '5 New Agronomy Tips Published',
    description:
      'Five new expert agronomy tips have been added covering cocoa fermentation, rubber tapping, fish farming integration, solar dryers, and cooperative pricing strategies. Check the Tips section.',
    read: false,
    createdAt: '2024-11-20T07:00:00Z',
  },
  {
    id: 'alert-13',
    type: 'system',
    severity: 'info',
    title: 'Agri Hub App Update Available',
    description:
      'Version 1.1 is now available with improved offline support, faster market price loading, and audio tips in Kpelle. Update from your app store or refresh the web app.',
    read: true,
    createdAt: '2024-11-17T12:00:00Z',
  },
  {
    id: 'alert-14',
    type: 'agronomy',
    severity: 'info',
    title: 'Market Day Reminder — Gbarnga',
    description:
      'Weekly market day in Gbarnga, Bong County is tomorrow (Saturday). Rice and cassava demand is typically high. Check current prices before transporting your crops.',
    county: 'Bong',
    read: false,
    createdAt: '2024-11-21T05:00:00Z',
  },
  {
    id: 'alert-15',
    type: 'agronomy',
    severity: 'info',
    title: 'Extension Officer Visit — Nimba County',
    description:
      'Ministry of Agriculture extension officers will be visiting farms in Sanniquellie district next week. Free soil testing and pest identification services available. Register at your local agriculture office.',
    county: 'Nimba',
    read: false,
    createdAt: '2024-11-20T15:00:00Z',
  },
]
