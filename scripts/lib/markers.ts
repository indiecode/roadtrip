import { COORDS, matchesName } from './coords.js'
import type { Stage, MapMarker } from '../../src/types.js'

export function buildMarkers(stages: Stage[]): MapMarker[] {
  const markers: MapMarker[] = []
  const seen = new Set<string>()
  const coordEntries = Object.entries(COORDS)

  for (const stage of stages) {
    for (const day of stage.days_list) {
      const searchText = `${day.route} ${day.charge} ${day.sleep}`.toLowerCase()
      for (const [name, { coords, type }] of coordEntries) {
        if (seen.has(name)) continue
        if (!matchesName(searchText, name)) continue
        seen.add(name)
        let finalType = type
        if (type === 'city') {
          const sleepText = day.sleep.toLowerCase()
          const nameInSleep = matchesName(sleepText, name)
          if (nameInSleep && day.sleep_type === 'camp') finalType = 'camp'
          else if (nameInSleep && day.sleep_type === 'hotel') finalType = 'hotel'
        }
        markers.push({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          name,
          lat: coords[0],
          lng: coords[1],
          type: finalType,
          day: `Day ${day.day}`,
          notes: day.route.replace(/\*\*/g, ''),
          tags: [stage.name],
        })
      }
    }
  }
  return markers
}
