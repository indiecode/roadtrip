export interface Day {
  day: string           // e.g. "1" or "10–12"
  route: string         // e.g. "Boston → Cleveland, OH — long highway day"
  charge: string        // e.g. "I-90 Superchargers all along"
  sleep: string         // e.g. "Cleveland hotel" or "🏕 Sage Creek (free, bison)"
  sleep_type: 'hotel' | 'camp'
  fills_fast?: boolean  // camp nights that book out fast (high demand)
  mapCenter: [number, number]
  mapZoom: number
}

export interface Stage {
  id: number
  name: string          // e.g. "Boston to the Black Hills"
  days: string          // e.g. "Days 1–8"
  miles: string         // e.g. "~2,000 mi"
  notes: string
  days_list: Day[]
}

export interface MapMarker {
  id: string            // e.g. "badlands-np"
  name: string          // e.g. "Badlands NP"
  lat: number
  lng: number
  type: 'park' | 'charger' | 'camp' | 'city' | 'hotel'
  day?: string          // e.g. "Day 5"
  fillsFast?: boolean   // camp nights that book out fast
  notes?: string
  tags?: string[]
}

export interface TripData {
  title: string
  subtitle: string
  stats: {
    days: number
    miles: number
    people: number
  }
  stages: Stage[]
  markers: MapMarker[]
  route: [number, number][]        // [lat, lng] pairs for the polyline
  routeSplitIndex: number          // index where outbound ends and return begins
}
