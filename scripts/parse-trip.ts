import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { TripData } from '../src/types.js'
import { parseStages } from './lib/parse-markdown.js'
import { buildMarkers } from './lib/markers.js'
import { ROUTE } from './lib/coords.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isEntryPoint = process.argv[1] === __filename
if (isEntryPoint) {
  const mdPath = resolve(__dirname, '../data/road_trip_field_guide.md')
  const outPath = resolve(__dirname, '../src/data/trip.json')

  const md = readFileSync(mdPath, 'utf-8')
  const stages = parseStages(md)
  const markers = buildMarkers(stages)

  const geoPath = resolve(__dirname, '../src/data/route-geometry.json')
  let route: [number, number][] = ROUTE
  try {
    route = JSON.parse(readFileSync(geoPath, 'utf-8'))
    console.log(`  Using detailed route geometry (${route.length} points)`)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
    console.log(`  No route-geometry.json found — using straight-line waypoints. Run: npx tsx scripts/fetch-route.ts`)
  }

  const TURNAROUND: [number, number] = [45.7054, -121.5218]
  let routeSplitIndex = Math.floor(route.length / 2)
  let minDist = Infinity
  for (let i = 0; i < route.length; i++) {
    const d = (route[i][0] - TURNAROUND[0]) ** 2 + (route[i][1] - TURNAROUND[1]) ** 2
    if (d < minDist) { minDist = d; routeSplitIndex = i }
  }
  console.log(`  Route split at index ${routeSplitIndex} of ${route.length}`)

  const tripData: TripData = {
    title: 'Boston → The West → Boston',
    subtitle: 'A Tesla Model Y National-Parks Field Guide',
    stats: { days: 56, miles: 7800, people: 2 },
    stages,
    markers,
    route,
    routeSplitIndex,
  }

  mkdirSync(resolve(__dirname, '../src/data'), { recursive: true })
  writeFileSync(outPath, JSON.stringify(tripData, null, 2))
  console.log(`✓ ${stages.length} stages, ${markers.length} markers → ${outPath}`)
}
