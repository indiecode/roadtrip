import { describe, it, expect, vi } from 'vitest'
import { COORDS } from './coords.js'
import type { Day, Stage, MapMarker } from '../src/types.js'
import { computeDayGeometry, pickZoom, GAP_DAY_LOCATIONS } from './day-geometry.js'

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}))

describe('computeDayGeometry', () => {
  it('centroid path: Day with two markers → mapCenter is arithmetic mean', () => {
    const day: Day = { day: '5', route: 'Boston → Cleveland', charge: 'I-90', sleep: 'Hotel', sleep_type: 'hotel', mapCenter: [0, 0], mapZoom: 6 }
    const stage: Stage = { id: 1, name: 'Test', days: 'Day 5', miles: '100', notes: '', days_list: [day] }
    const markers: MapMarker[] = [
      { id: 'cleveland-1', name: 'Cleveland 1', lat: 41.4, lng: -81.7, type: 'city', day: 'Day 5' },
      { id: 'cleveland-2', name: 'Cleveland 2', lat: 41.5, lng: -81.6, type: 'city', day: 'Day 5' },
    ]

    computeDayGeometry([stage], markers)

    expect(day.mapCenter[0]).toBeCloseTo(41.45)
    expect(day.mapCenter[1]).toBeCloseTo(-81.65)
  })

  it('gap-lookup path: Day with day=10–12 and no markers → mapCenter = Yellowstone coords', () => {
    const day: Day = { day: '10–12', route: 'Yellowstone', charge: '', sleep: '', sleep_type: 'hotel', mapCenter: [0, 0], mapZoom: 6 }
    const stage: Stage = { id: 1, name: 'Test', days: 'Days 10–12', miles: '500', notes: '', days_list: [day] }
    const markers: MapMarker[] = [{ id: 'other', name: 'Other', lat: 40, lng: -100, type: 'park', day: 'Day 10' }]

    computeDayGeometry([stage], markers)

    const expected = COORDS[GAP_DAY_LOCATIONS['10–12']].coords
    expect(day.mapCenter).toEqual(expected)
    expect(day.mapZoom).toBe(8)
  })

  it('fallback path: unknown day with previous day center → uses previous center', () => {
    const consoleWarn = vi.fn()
    global.console.warn = consoleWarn

    const day1: Day = { day: '5', route: 'Test', charge: '', sleep: '', sleep_type: 'hotel', mapCenter: [41, -81], mapZoom: 6 }
    const day2: Day = { day: 'zzz', route: 'Unknown', charge: '', sleep: '', sleep_type: 'hotel', mapCenter: [0, 0], mapZoom: 6 }
    const stage: Stage = { id: 1, name: 'Test', days: 'Days 1-2', miles: '500', notes: '', days_list: [day1, day2] }
    const markers: MapMarker[] = [{ id: 'test', name: 'Test', lat: 40, lng: -100, type: 'park', day: 'Day 5' }]

    computeDayGeometry([stage], markers)

    expect(day2.mapCenter).toEqual(day1.mapCenter)
    expect(consoleWarn).toHaveBeenCalledWith('[day-geometry] no center for Day zzz; using previous entry')
  })

  it('fallback path: unknown day with no previous → uses Boston coords', () => {
    const consoleWarn = vi.fn()
    global.console.warn = consoleWarn

    const day: Day = { day: 'unknown', route: 'Test', charge: '', sleep: '', sleep_type: 'hotel', mapCenter: [0, 0], mapZoom: 6 }
    const stage: Stage = { id: 1, name: 'Test', days: 'Day unknown', miles: '500', notes: '', days_list: [day] }
    const markers: MapMarker[] = []

    computeDayGeometry([stage], markers)

    expect(day.mapCenter).toEqual([42.3601, -71.0589])
    expect(consoleWarn).toHaveBeenCalledWith('[day-geometry] no center for Day unknown; using previous entry')
  })
})

describe('pickZoom', () => {
  it('day.includes(–) → 8', () => {
    const day = { day: '10–12', route: 'Test', charge: '', sleep: '', sleep_type: 'hotel' } as Day
    expect(pickZoom(day)).toBe(8)
  })

  it('long highway day → 5', () => {
    const day = { day: '5', route: 'Boston → Cleveland — long highway day', charge: '', sleep: '', sleep_type: 'hotel' } as Day
    expect(pickZoom(day)).toBe(5)
  })

  it('interstate → 5', () => {
    const day = { day: '5', route: 'I-90 interstate drive', charge: '', sleep: '', sleep_type: 'hotel' } as Day
    expect(pickZoom(day)).toBe(5)
  })

  it('regional route → 6', () => {
    const day = { day: '3', route: 'Regional drive', charge: '', sleep: '', sleep_type: 'hotel' } as Day
    expect(pickZoom(day)).toBe(6)
  })
})
