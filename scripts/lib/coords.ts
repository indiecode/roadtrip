import type { MapMarker } from '../../src/types.js'

export const COORDS: Record<string, { coords: [number, number]; type: MapMarker['type'] }> = {
  'Boston':              { coords: [42.3601, -71.0589],   type: 'city' },
  'Cleveland':           { coords: [41.4993, -81.6944],   type: 'city' },
  'Cuyahoga Valley NP':  { coords: [41.2431, -81.5488],   type: 'park' },
  'Chicago':             { coords: [41.8781, -87.6298],   type: 'city' },
  'Sioux Falls':         { coords: [43.5446, -96.7311],   type: 'city' },
  'Badlands NP':         { coords: [43.8554, -102.3397],  type: 'park' },
  'Rapid City':          { coords: [44.0805, -103.2310],  type: 'city' },
  'Custer':              { coords: [43.7666, -103.5991],  type: 'city' },
  'Wind Cave NP':        { coords: [43.5561, -103.4789],  type: 'park' },
  'West Yellowstone':    { coords: [44.6602, -111.0983],  type: 'charger' },
  'Yellowstone NP':      { coords: [44.4280, -110.5885],  type: 'park' },
  'Grand Teton NP':      { coords: [43.7904, -110.6818],  type: 'park' },
  'Jackson':             { coords: [43.4799, -110.7624],  type: 'charger' },
  'Salt Lake City':      { coords: [40.7608, -111.8910],  type: 'city' },
  'Estes Park':          { coords: [40.3772, -105.5217],  type: 'city' },
  'Rocky Mountain NP':   { coords: [40.3428, -105.6836],  type: 'park' },
  'Durango':             { coords: [37.2753, -107.8801],  type: 'city' },
  'Ouray':               { coords: [38.0228, -107.6713],  type: 'city' },
  'Moab':                { coords: [38.5733, -109.5498],  type: 'charger' },
  'Arches NP':           { coords: [38.7331, -109.5925],  type: 'park' },
  'Canyonlands NP':      { coords: [38.3269, -109.8783],  type: 'park' },
  'Capitol Reef NP':     { coords: [38.0877, -111.1478],  type: 'park' },
  'Bryce Canyon NP':     { coords: [37.5930, -112.1871],  type: 'park' },
  'Zion NP':             { coords: [37.2982, -113.0263],  type: 'park' },
  'Springdale':          { coords: [37.1886, -112.9980],  type: 'city' },
  'Hurricane':           { coords: [37.1753, -113.2899],  type: 'charger' },
  'Las Vegas':           { coords: [36.1699, -115.1398],  type: 'charger' },
  'Beatty':              { coords: [36.9077, -116.7594],  type: 'charger' },
  'Tonopah':             { coords: [38.0673, -117.2306],  type: 'charger' },
  'Bishop':              { coords: [37.3635, -118.3953],  type: 'charger' },
  'Mammoth Lakes':       { coords: [37.6485, -118.9721],  type: 'charger' },
  'Visalia':             { coords: [36.3302, -119.2921],  type: 'charger' },
  'Sequoia NP':          { coords: [36.4864, -118.5658],  type: 'park' },
  'Kings Canyon NP':     { coords: [36.8879, -118.5551],  type: 'park' },
  'Fresno':              { coords: [36.7378, -119.7871],  type: 'city' },
  'Mariposa':            { coords: [37.4852, -119.9663],  type: 'city' },
  'Groveland':           { coords: [37.8494, -120.2313],  type: 'city' },
  'Yosemite NP':         { coords: [37.8651, -119.5383],  type: 'park' },
  'San Francisco':       { coords: [37.7749, -122.4194],  type: 'city' },
  'Big Sur':             { coords: [36.2704, -121.8081],  type: 'park' },
  'Redwood NP':          { coords: [41.2132, -124.0046],  type: 'park' },
  'Crater Lake NP':      { coords: [42.9446, -122.1090],  type: 'park' },
  'Bend':                { coords: [44.0582, -121.3153],  type: 'city' },
  'Columbia Gorge':      { coords: [45.6996, -121.4000],  type: 'park' },
  'Hood River':          { coords: [45.7054, -121.5218],  type: 'city' },
  'Portland':            { coords: [45.5051, -122.6750],  type: 'city' },
  "Coeur d'Alene":       { coords: [47.6777, -116.7805],  type: 'city' },
  'Missoula':            { coords: [46.8721, -113.9940],  type: 'city' },
  'Kalispell':           { coords: [48.1960, -114.3115],  type: 'charger' },
  'Glacier NP':          { coords: [48.6961, -113.7178],  type: 'park' },
  'Theodore Roosevelt NP': { coords: [46.9790, -103.5387], type: 'park' },
  'Billings':            { coords: [45.7833, -108.5007],  type: 'city' },
  'Bismarck':            { coords: [46.8083, -100.7837],  type: 'city' },
  'Sage Creek':          { coords: [43.9554, -102.5397],  type: 'camp' },
  'Bridger-Teton':       { coords: [43.5000, -110.5000],  type: 'camp' },
  'Watkins Glen':        { coords: [42.3812, -76.8744],   type: 'city' },
  'Madison':             { coords: [43.0731, -89.4012],   type: 'city' },
  'Cody':                { coords: [44.5263, -109.0565],  type: 'city' },
  'Pendleton':           { coords: [45.6721, -118.7886],  type: 'city' },
}

export const ROUTE: [number, number][] = [
   [42.3601, -71.0589],   // Boston
   [42.3812, -76.8744],   // Watkins Glen
   [41.4993, -81.6944],   // Cleveland
   [41.8781, -87.6298],   // Chicago
   [43.0731, -89.4012],   // Madison
   [43.5446, -96.7311],   // Sioux Falls
  [43.8554, -102.3397],  // Badlands
   [44.0805, -103.2310],  // Rapid City
   [44.5263, -109.0565],  // Cody
   [44.6602, -111.0983],  // West Yellowstone
  [43.7904, -110.6818],  // Grand Teton
  [40.7608, -111.8910],  // Salt Lake City
  [40.3772, -105.5217],  // Estes Park
  [37.2753, -107.8801],  // Durango
  [38.5733, -109.5498],  // Moab
  [38.0877, -111.1478],  // Capitol Reef
  [37.5930, -112.1871],  // Bryce Canyon
  [37.2982, -113.0263],  // Zion
  [37.1753, -113.2899],  // Hurricane
  [36.1699, -115.1398],  // Las Vegas
  [36.9077, -116.7594],  // Beatty
  [38.0673, -117.2306],  // Tonopah
  [37.3635, -118.3953],  // Bishop
  [37.6485, -118.9721],  // Mammoth Lakes
  [36.4864, -118.5658],  // Sequoia
  [37.8651, -119.5383],  // Yosemite
  [37.7749, -122.4194],  // San Francisco
  [36.2704, -121.8081],  // Big Sur
  [41.2132, -124.0046],  // Redwood NP
  [42.9446, -122.1090],  // Crater Lake
   [44.0582, -121.3153],  // Bend
   [45.6721, -118.7886],  // Pendleton
   [45.7054, -121.5218],  // Columbia Gorge
  [47.6777, -116.7805],  // Coeur d'Alene
  [46.8721, -113.9940],  // Missoula
  [48.1960, -114.3115],  // Kalispell
  [48.6961, -113.7178],  // Glacier
  [45.7833, -108.5007],  // Billings
  [46.8083, -100.7837],  // Bismarck
  [42.3601, -71.0589],   // Boston (return)
]

export function matchesName(searchText: string, name: string): boolean {
  const lower = name.toLowerCase()
  if (searchText.includes(lower)) return true
  if (lower.endsWith(' np')) {
    return searchText.includes(lower.slice(0, -3))
  }
  return false
}
