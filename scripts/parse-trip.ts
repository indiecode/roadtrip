import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { TripData, Stage, Day, MapMarker } from '../src/types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Coordinate lookup: display name → [lat, lng]
export const COORDS: Record<string, { coords: [number, number]; type: MapMarker['type'] }> = {
  'Boston':           { coords: [42.3601, -71.0589],   type: 'city' },
  'Cleveland':        { coords: [41.4993, -81.6944],   type: 'city' },
  'Chicago':          { coords: [41.8781, -87.6298],   type: 'city' },
  'Sioux Falls':      { coords: [43.5446, -96.7311],   type: 'city' },
  'Badlands NP':      { coords: [43.8554, -102.3397],  type: 'park' },
  'Rapid City':       { coords: [44.0805, -103.2310],  type: 'city' },
  'Custer':           { coords: [43.7666, -103.5991],  type: 'city' },
  'West Yellowstone': { coords: [44.6602, -111.0983],  type: 'charger' },
  'Yellowstone NP':   { coords: [44.4280, -110.5885],  type: 'park' },
  'Grand Teton NP':   { coords: [43.7904, -110.6818],  type: 'park' },
  'Jackson':          { coords: [43.4799, -110.7624],  type: 'charger' },
  'Salt Lake City':   { coords: [40.7608, -111.8910],  type: 'city' },
  'Estes Park':       { coords: [40.3772, -105.5217],  type: 'city' },
  'Rocky Mountain NP':{ coords: [40.3428, -105.6836],  type: 'park' },
  'Durango':          { coords: [37.2753, -107.8801],  type: 'city' },
  'Ouray':            { coords: [38.0228, -107.6713],  type: 'city' },
  'Moab':             { coords: [38.5733, -109.5498],  type: 'charger' },
  'Arches NP':        { coords: [38.7331, -109.5925],  type: 'park' },
  'Canyonlands NP':   { coords: [38.3269, -109.8783],  type: 'park' },
  'Capitol Reef NP':  { coords: [38.0877, -111.1478],  type: 'park' },
  'Bryce Canyon NP':  { coords: [37.5930, -112.1871],  type: 'park' },
  'Zion NP':          { coords: [37.2982, -113.0263],  type: 'park' },
  'Springdale':       { coords: [37.1886, -112.9980],  type: 'city' },
  'Hurricane':        { coords: [37.1753, -113.2899],  type: 'charger' },
  'Las Vegas':        { coords: [36.1699, -115.1398],  type: 'charger' },
  'Beatty':           { coords: [36.9077, -116.7594],  type: 'charger' },
  'Tonopah':          { coords: [38.0673, -117.2306],  type: 'charger' },
  'Bishop':           { coords: [37.3635, -118.3953],  type: 'charger' },
  'Mammoth Lakes':    { coords: [37.6485, -118.9721],  type: 'charger' },
  'Sequoia NP':       { coords: [36.4864, -118.5658],  type: 'park' },
  'Kings Canyon NP':  { coords: [36.8879, -118.5551],  type: 'park' },
  'Fresno':           { coords: [36.7378, -119.7871],  type: 'city' },
  'Mariposa':         { coords: [37.4852, -119.9663],  type: 'city' },
  'Yosemite NP':      { coords: [37.8651, -119.5383],  type: 'park' },
  'San Francisco':    { coords: [37.7749, -122.4194],  type: 'city' },
  'Big Sur':          { coords: [36.2704, -121.8081],  type: 'park' },
  'Redwood NP':       { coords: [41.2132, -124.0046],  type: 'park' },
  'Crater Lake NP':   { coords: [42.9446, -122.1090],  type: 'park' },
  'Bend':             { coords: [44.0582, -121.3153],  type: 'city' },
  'Columbia Gorge':   { coords: [45.7054, -121.5218],  type: 'park' },
  'Portland':         { coords: [45.5051, -122.6750],  type: 'city' },
  "Coeur d'Alene":    { coords: [47.6777, -116.7805],  type: 'city' },
  'Missoula':         { coords: [46.8721, -113.9940],  type: 'city' },
  'Kalispell':        { coords: [48.1960, -114.3115],  type: 'charger' },
  'Glacier NP':       { coords: [48.6961, -113.7178],  type: 'park' },
  'Billings':         { coords: [45.7833, -108.5007],  type: 'city' },
  'Bismarck':         { coords: [46.8083, -100.7837],  type: 'city' },
  'Sage Creek':       { coords: [43.9554, -102.5397],  type: 'camp' },
  'Bridger-Teton':    { coords: [43.5000, -110.5000],  type: 'camp' },
}

// Simplified route polyline (lat/lng waypoints)
export const ROUTE: [number, number][] = [
  [42.3601, -71.0589],   // Boston
  [41.4993, -81.6944],   // Cleveland
  [41.8781, -87.6298],   // Chicago
  [43.5446, -96.7311],   // Sioux Falls
  [43.8554, -102.3397],  // Badlands
  [44.0805, -103.2310],  // Rapid City
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
  [45.7054, -121.5218],  // Columbia Gorge
  [47.6777, -116.7805],  // Coeur d'Alene
  [46.8721, -113.9940],  // Missoula
  [48.1960, -114.3115],  // Kalispell
  [48.6961, -113.7178],  // Glacier
  [45.7833, -108.5007],  // Billings
  [46.8083, -100.7837],  // Bismarck
  [42.3601, -71.0589],   // Boston (return)
]

export function parseDayTable(block: string): Day[] {
  const lines = block.split('\n')
  const tableLines = lines.filter(
    l => l.startsWith('|') && !l.match(/^\|[-\s|]+$/)
  )
  // tableLines[0] is the header row (Day | Route & drive | Charge | Sleep)
  return tableLines
    .slice(1)
    .map(line => {
      const cells = line.split('|').slice(1, -1).map(c => c.trim())
      if (cells.length < 4) return null
      const [day, route, charge, sleep] = cells
      const cleanDay = day.replace(/\*\*/g, '').trim()
      if (!cleanDay || cleanDay === 'Day') return null
      const cleanSleep = sleep.replace(/\*\*/g, '').trim()
      return {
        day: cleanDay,
        route: route.replace(/\*\*/g, '').trim(),
        charge: charge.replace(/\*\*/g, '').trim(),
        sleep: cleanSleep,
        sleep_type: sleep.includes('🏕') ? 'camp' : 'hotel',
      } satisfies Day
    })
    .filter((d): d is Day => d !== null)
}

export function parseStageBlock(block: string): Stage {
  const headerMatch = block.match(/^## Stage (\d+) — (.+)/m)
  if (!headerMatch) throw new Error(`No stage header found in block: ${block.slice(0, 50)}`)
  const id = parseInt(headerMatch[1], 10)
  const name = headerMatch[2].trim()

  // Match: *Days 1–8 · ~2,000 mi · ...* or *Day 56+ · ...* (miles optional)
  const summaryMatch = block.match(/^\*Days?\s+([^·\u00b7*]+?)\s*[·\u00b7](?:\s*~([\d,]+)\s*mi)?/m)
  if (!summaryMatch) {
    console.warn(`[parse-trip] Could not parse summary line for Stage ${id} — days/miles will be empty`)
  }
  const days = summaryMatch ? `Days ${summaryMatch[1].trim()}` : ''
  const miles = summaryMatch && summaryMatch[2] ? `~${summaryMatch[2]} mi` : ''

  const notesMatch = block.match(/\*\*Notes:\*\*\s*(.+?)(?=\n\n|\n>|\n##|$)/s)
  const notes = notesMatch
    ? notesMatch[1].replace(/\n/g, ' ').trim()
    : ''

  return { id, name, days, miles, notes, days_list: parseDayTable(block) }
}

export function parseStages(md: string): Stage[] {
  // Split on stage headers, keeping each ## Stage N block together
  const parts = md.split(/(?=^## Stage \d+)/m)
  return parts
    .filter(p => /^## Stage \d+/.test(p))
    .map(parseStageBlock)
}

export function buildMarkers(stages: Stage[]): MapMarker[] {
  const markers: MapMarker[] = []
  const seen = new Set<string>()

  for (const stage of stages) {
    for (const day of stage.days_list) {
      const searchText = `${day.route} ${day.sleep}`.toLowerCase()
      for (const [name, { coords, type }] of Object.entries(COORDS)) {
        if (seen.has(name)) continue
        if (!searchText.includes(name.toLowerCase())) continue
        seen.add(name)
        // Override type based on the night's sleep category
        const sleepText = day.sleep.toLowerCase()
        const nameMatch = sleepText.includes(name.toLowerCase())
        const isCampNight = day.sleep_type === 'camp' && nameMatch
        const isHotelNight = day.sleep_type === 'hotel' && nameMatch
        markers.push({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          name,
          lat: coords[0],
          lng: coords[1],
          type: isCampNight ? 'camp' : isHotelNight ? 'hotel' : type,
          day: `Day ${day.day}`,
          notes: day.route.replace(/\*\*/g, ''),
          tags: [stage.name],
        })
      }
    }
  }
  return markers
}

// Entry point — only runs when executed directly, not when imported by tests
const isEntryPoint = process.argv[1] === __filename
if (isEntryPoint) {
  const mdPath = resolve(__dirname, '../data/road_trip_field_guide.md')
  const outPath = resolve(__dirname, '../src/data/trip.json')

  const md = readFileSync(mdPath, 'utf-8')
  const stages = parseStages(md)
  const markers = buildMarkers(stages)

  const tripData: TripData = {
    title: 'Boston → The West → Boston',
    subtitle: 'A Tesla Model Y National-Parks Field Guide',
    stats: { days: 56, miles: 7800, people: 2 },
    stages,
    markers,
    route: ROUTE,
  }

  mkdirSync(resolve(__dirname, '../src/data'), { recursive: true })
  writeFileSync(outPath, JSON.stringify(tripData, null, 2))
  console.log(`✓ ${stages.length} stages, ${markers.length} markers → ${outPath}`)
}
