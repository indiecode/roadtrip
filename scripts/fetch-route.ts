import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ROUTE } from './parse-trip.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// OSRM public demo server — free, no API key
const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'

// Ramer-Douglas-Peucker line simplification (iterative to avoid stack overflow on large inputs)
function perpendicularDist(p: [number, number], a: [number, number], b: [number, number]): number {
  const dx = b[1] - a[1]
  const dy = b[0] - a[0]
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return Math.sqrt((p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2)
  return Math.abs(dy * (p[1] - a[1]) - dx * (p[0] - a[0])) / len
}

function simplify(points: [number, number][], epsilon: number): [number, number][] {
  if (points.length <= 2) return points

  const keep = new Uint8Array(points.length)
  keep[0] = 1
  keep[points.length - 1] = 1

  const stack: [number, number][] = [[0, points.length - 1]]
  while (stack.length > 0) {
    const [start, end] = stack.pop()!
    let maxDist = 0
    let maxIdx = start
    for (let i = start + 1; i < end; i++) {
      const d = perpendicularDist(points[i], points[start], points[end])
      if (d > maxDist) { maxDist = d; maxIdx = i }
    }
    if (maxDist > epsilon) {
      keep[maxIdx] = 1
      if (maxIdx - start > 1) stack.push([start, maxIdx])
      if (end - maxIdx > 1) stack.push([maxIdx, end])
    }
  }

  return points.filter((_, i) => keep[i])
}

async function fetchRoute(): Promise<[number, number][]> {
  // OSRM wants lng,lat (opposite of Leaflet's lat,lng)
  const coords = ROUTE.map(([lat, lng]) => `${lng},${lat}`).join(';')
  const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson`

  console.log(`Fetching route from OSRM (${ROUTE.length} waypoints)...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`OSRM returned ${res.status}: ${(await res.text()).slice(0, 500)}`)

  const data = await res.json()
  if (data.code !== 'Ok') throw new Error(`OSRM error: ${data.code} — ${data.message}`)

  // GeoJSON coordinates are [lng, lat] — convert to [lat, lng] for Leaflet
  const geojsonCoords: [number, number][] = data.routes[0].geometry.coordinates
  const latLngRoute: [number, number][] = geojsonCoords.map(([lng, lat]) => [lat, lng])

  const distMiles = Math.round(data.routes[0].distance * 0.000621371)
  const durationHrs = Math.round(data.routes[0].duration / 3600)
  console.log(`Raw: ${latLngRoute.length} points, ~${distMiles} mi, ~${durationHrs} hrs driving`)

  return latLngRoute
}

async function main() {
  const raw = await fetchRoute()

  // Simplify: epsilon ~0.001 degrees (~100m) keeps highway curves smooth
  // while dramatically reducing point count
  const simplified = simplify(raw, 0.001)
  console.log(`Simplified: ${simplified.length} points (from ${raw.length})`)

  // Round to 4 decimal places (~11m precision) to save bytes
  const rounded: [number, number][] = simplified.map(([lat, lng]) => [
    Math.round(lat * 10000) / 10000,
    Math.round(lng * 10000) / 10000,
  ])

  const outPath = resolve(__dirname, '../src/data/route-geometry.json')
  const json = JSON.stringify(rounded)
  writeFileSync(outPath, json)

  const sizeMB = (Buffer.byteLength(json) / 1024 / 1024).toFixed(2)
  console.log(`Saved to ${outPath} (${sizeMB} MB)`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
