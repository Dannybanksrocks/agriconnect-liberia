import type { County } from '@/lib/types'

export const counties: County[] = [
  { id: 'bomi', name: 'Bomi', capital: 'Tubmanburg', region: 'coastal' },
  { id: 'bong', name: 'Bong', capital: 'Gbarnga', region: 'central' },
  { id: 'gbarpolu', name: 'Gbarpolu', capital: 'Bopolu', region: 'interior' },
  { id: 'grand-bassa', name: 'Grand Bassa', capital: 'Buchanan', region: 'coastal' },
  { id: 'grand-cape-mount', name: 'Grand Cape Mount', capital: 'Robertsport', region: 'coastal' },
  { id: 'grand-gedeh', name: 'Grand Gedeh', capital: 'Zwedru', region: 'interior' },
  { id: 'grand-kru', name: 'Grand Kru', capital: 'Barclayville', region: 'coastal' },
  { id: 'lofa', name: 'Lofa', capital: 'Voinjama', region: 'interior' },
  { id: 'margibi', name: 'Margibi', capital: 'Kakata', region: 'central' },
  { id: 'maryland', name: 'Maryland', capital: 'Harper', region: 'coastal' },
  { id: 'montserrado', name: 'Montserrado', capital: 'Bensonville', region: 'coastal' },
  { id: 'nimba', name: 'Nimba', capital: 'Sanniquellie', region: 'interior' },
  { id: 'river-cess', name: 'River Cess', capital: 'Cestos City', region: 'coastal' },
  { id: 'river-gee', name: 'River Gee', capital: 'Fish Town', region: 'coastal' },
  { id: 'sinoe', name: 'Sinoe', capital: 'Greenville', region: 'coastal' },
]

export const countyNames = counties.map((c) => c.name)
