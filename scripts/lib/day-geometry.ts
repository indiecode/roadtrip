import { COORDS } from './coords.js'
import type { Day, Stage, MapMarker } from '../../src/types.js'

export const GAP_DAY_LOCATIONS: Record<string, string> = {
  '10':    'Rapid City',
  '13–15': 'Yellowstone NP',
  '17–18': 'Grand Teton NP',
  '21–22': 'Rocky Mountain NP',
  '24–25': 'Ouray',
  '37–38': 'Sequoia NP',
  '40–42': 'Yosemite NP',
  '45–46': 'Redwood NP',
  '52':    'Bend',
  '59':    'Glacier NP',
  '61+':   'Boston',
}

export function pickZoom(day: Day): number {
  if (day.day.includes('–')) return 8
  const r = day.route.toLowerCase()
  if (r.includes('long') || r.includes('interstate')) return 5
  return 6
}

export function computeDayGeometry(stages: Stage[], markers: MapMarker[]): void {
  let previousCenter: [number, number] | undefined = undefined

  for (const stage of stages) {
    for (const day of stage.days_list) {
      const dayTaggedMarkers = markers.filter(m => m.day === `Day ${day.day}`)

      if (dayTaggedMarkers.length > 0) {
        const avgLat = dayTaggedMarkers.reduce((sum, m) => sum + m.lat, 0) / dayTaggedMarkers.length
        const avgLng = dayTaggedMarkers.reduce((sum, m) => sum + m.lng, 0) / dayTaggedMarkers.length
        day.mapCenter = [avgLat, avgLng]
      } else {
        const locationName = GAP_DAY_LOCATIONS[day.day]
        if (locationName && COORDS[locationName]) {
          day.mapCenter = COORDS[locationName].coords
        } else {
          console.warn(`[day-geometry] no center for Day ${day.day}; using previous entry`)
          day.mapCenter = previousCenter || COORDS['Boston'].coords
        }
      }

      day.mapZoom = pickZoom(day)
      previousCenter = day.mapCenter
    }
  }
}
