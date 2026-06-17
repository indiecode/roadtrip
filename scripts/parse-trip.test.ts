import { describe, it, expect } from 'vitest'
import { COORDS, ROUTE } from './lib/coords.js'
import { parseStageBlock, parseDayTable, parseStages } from './lib/parse-markdown.js'
import { buildMarkers } from './lib/markers.js'

const SAMPLE_STAGE = `## Stage 1 — Boston to the Black Hills
*Days 1–8 · ~2,000 mi · Easy charging the whole way — dense Supercharger coverage on I-90/I-80. These are your warm-up miles.*

| Day | Route & drive | Charge | Sleep |
|---|---|---|---|
| 1 | **Boston → Cleveland, OH** — long highway day, pure transit | I-90 Superchargers all along | Cleveland hotel (cheap, easy) |
| 5 | **Sioux Falls → Badlands NP** — arrive afternoon, sunset over spires | Rapid City / Wall area | 🏕 Sage Creek (free, bison) |
| 8 | **Buffer / explore** — Custer State Park wildlife loop | Rapid City / Custer | Hotel |

**Notes:** Charging here is effortless — just top off in any I-90 town.`

const TWO_STAGES = `${SAMPLE_STAGE}

---

## Stage 2 — Yellowstone & Grand Teton
*Days 9–16 · ~800 mi · Gateway-town Superchargers; Level 2 only inside the parks.*

| Day | Route & drive | Charge | Sleep |
|---|---|---|---|
| 9 | **Black Hills → West Yellowstone** — long scenic drive west | Sheridan / Cody corridor | West Yellowstone hotel |

**Notes:** West Yellowstone is your fast-charge anchor.`

describe('parseDayTable', () => {
  it('returns one Day per table row (excluding header)', () => {
    const days = parseDayTable(SAMPLE_STAGE)
    expect(days).toHaveLength(3)
  })

  it('strips markdown bold markers from route', () => {
    const days = parseDayTable(SAMPLE_STAGE)
    expect(days[0].route).not.toContain('**')
    expect(days[0].route).toContain('Boston → Cleveland, OH')
  })

  it('marks hotel nights correctly', () => {
    const days = parseDayTable(SAMPLE_STAGE)
    expect(days[0].sleep_type).toBe('hotel')
  })

  it('marks camp nights correctly', () => {
    const days = parseDayTable(SAMPLE_STAGE)
    expect(days[1].sleep_type).toBe('camp')
  })

  it('parses day number as string', () => {
    const days = parseDayTable(SAMPLE_STAGE)
    expect(days[0].day).toBe('1')
    expect(days[1].day).toBe('5')
  })
})

describe('parseStageBlock', () => {
  it('parses stage id', () => {
    const stage = parseStageBlock(SAMPLE_STAGE)
    expect(stage.id).toBe(1)
  })

  it('parses stage name', () => {
    const stage = parseStageBlock(SAMPLE_STAGE)
    expect(stage.name).toBe('Boston to the Black Hills')
  })

  it('parses day range', () => {
    const stage = parseStageBlock(SAMPLE_STAGE)
    expect(stage.days).toContain('1–8')
  })

  it('parses mileage', () => {
    const stage = parseStageBlock(SAMPLE_STAGE)
    expect(stage.miles).toBe('~2,000 mi')
  })

  it('parses notes', () => {
    const stage = parseStageBlock(SAMPLE_STAGE)
    expect(stage.notes).toContain('effortless')
  })

  it('includes parsed days_list', () => {
    const stage = parseStageBlock(SAMPLE_STAGE)
    expect(stage.days_list).toHaveLength(3)
  })
})

describe('parseStages', () => {
  it('returns one stage per ## Stage header', () => {
    const stages = parseStages(TWO_STAGES)
    expect(stages).toHaveLength(2)
  })

  it('assigns correct ids to each stage', () => {
    const stages = parseStages(TWO_STAGES)
    expect(stages[0].id).toBe(1)
    expect(stages[1].id).toBe(2)
  })

  it('each stage has its own days_list', () => {
    const stages = parseStages(TWO_STAGES)
    expect(stages[0].days_list).toHaveLength(3)
    expect(stages[1].days_list).toHaveLength(1)
  })
})

describe('buildMarkers', () => {
  const stages = parseStages(TWO_STAGES)

  it('returns markers for known locations found in day data', () => {
    const markers = buildMarkers(stages)
    expect(markers.length).toBeGreaterThan(0)
  })

  it('does not duplicate markers for the same location', () => {
    const markers = buildMarkers(stages)
    const ids = markers.map(m => m.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('generates url-safe ids from location names', () => {
    const markers = buildMarkers(stages)
    for (const marker of markers) {
      expect(marker.id).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('correctly identifies camp nights', () => {
    // Stage 1 in SAMPLE_STAGE has day 5 → "🏕 Sage Creek (free, bison)"
    const markers = buildMarkers(stages)
    const sageCreek = markers.find(m => m.name === 'Sage Creek')
    expect(sageCreek?.type).toBe('camp')
  })
})

const SPLIT_STAGE = `## Stage 1 — Boston to the Black Hills
*Days 1–8 · ~2,000 mi · warm-up miles.*

| Day | Route & drive | Charge | Sleep |
|---|---|---|---|
| 1a | **Boston → Watkins Glen, NY** | Geneva, OH | Watkins Glen hotel |
| 1b | **Watkins Glen → Cleveland, OH** | I-90 | Cleveland hotel |
| 4a | **Chicago → Madison, WI** | Madison | Madison hotel |
| 9a | **Black Hills → Cody, WY** | Cody | Cody hotel |
| 50a | **Bend → Pendleton, OR** | Pendleton | Pendleton hotel |

**Notes:** split-day fixture.`

describe('new split-stop markers', () => {
  it('buildMarkers contains marker for Watkins Glen tagged "Day 1a"', () => {
    const markers = buildMarkers(parseStages(SPLIT_STAGE))
    const WatkinsGlenMarker = markers.find(m => m.name === 'Watkins Glen')
    expect(WatkinsGlenMarker).toBeDefined()
    expect(WatkinsGlenMarker?.day).toBe('Day 1a')
    expect(WatkinsGlenMarker?.lng).toBeCloseTo(-76.8744)
  })

  it('buildMarkers contains marker for Madison tagged "Day 4a"', () => {
    const markers = buildMarkers(parseStages(SPLIT_STAGE))
    const MadisonMarker = markers.find(m => m.name === 'Madison')
    expect(MadisonMarker).toBeDefined()
    expect(MadisonMarker?.day).toBe('Day 4a')
  })

  it('buildMarkers contains marker for Cody tagged "Day 9a"', () => {
    const markers = buildMarkers(parseStages(SPLIT_STAGE))
    const CodyMarker = markers.find(m => m.name === 'Cody')
    expect(CodyMarker).toBeDefined()
    expect(CodyMarker?.day).toBe('Day 9a')
  })

  it('buildMarkers contains marker for Pendleton tagged "Day 50a"', () => {
    const markers = buildMarkers(parseStages(SPLIT_STAGE))
    const PendletonMarker = markers.find(m => m.name === 'Pendleton')
    expect(PendletonMarker).toBeDefined()
    expect(PendletonMarker?.day).toBe('Day 50a')
  })

  it('COORDS["Watkins Glen"].coords toEqual [42.3812, -76.8744]', () => {
    expect(COORDS['Watkins Glen'].coords).toEqual([42.3812, -76.8744])
  })

  it('COORDS["Madison"].coords toEqual [43.0731, -89.4012]', () => {
    expect(COORDS['Madison'].coords).toEqual([43.0731, -89.4012])
  })

  it('COORDS["Cody"].coords toEqual [44.5263, -109.0565]', () => {
    expect(COORDS['Cody'].coords).toEqual([44.5263, -109.0565])
  })

  it('COORDS["Pendleton"].coords toEqual [45.6721, -118.7886]', () => {
    expect(COORDS['Pendleton'].coords).toEqual([45.6721, -118.7886])
  })

  it('ROUTE ordering: Watkins Glen is between Boston and Cleveland', () => {
    const bostonIdx = ROUTE.findIndex(p => p[0] === 42.3601 && p[1] === -71.0589)
    const WatkinsGlenIdx = ROUTE.findIndex(p => p[0] === 42.3812 && p[1] === -76.8744)
    const clevelandIdx = ROUTE.findIndex(p => p[0] === 41.4993 && p[1] === -81.6944)
    expect(WatkinsGlenIdx).toBeGreaterThan(bostonIdx)
    expect(WatkinsGlenIdx).toBeLessThan(clevelandIdx)
  })

  it('ROUTE ordering: Madison is between Chicago and Sioux Falls', () => {
    const chicagoIdx = ROUTE.findIndex(p => p[0] === 41.8781 && p[1] === -87.6298)
    const MadisonIdx = ROUTE.findIndex(p => p[0] === 43.0731 && p[1] === -89.4012)
    const siouxFallsIdx = ROUTE.findIndex(p => p[0] === 43.5446 && p[1] === -96.7311)
    expect(MadisonIdx).toBeGreaterThan(chicagoIdx)
    expect(MadisonIdx).toBeLessThan(siouxFallsIdx)
  })

  it('ROUTE ordering: Cody is between Rapid City and West Yellowstone', () => {
    const rapidCityIdx = ROUTE.findIndex(p => p[0] === 44.0805 && p[1] === -103.2310)
    const CodyIdx = ROUTE.findIndex(p => p[0] === 44.5263 && p[1] === -109.0565)
    const westYellowstoneIdx = ROUTE.findIndex(p => p[0] === 44.6602 && p[1] === -111.0983)
    expect(CodyIdx).toBeGreaterThan(rapidCityIdx)
    expect(CodyIdx).toBeLessThan(westYellowstoneIdx)
  })

  it('ROUTE ordering: Pendleton is between Bend and Coeur d\'Alene', () => {
    const bendIdx = ROUTE.findIndex(p => p[0] === 44.0582 && p[1] === -121.3153)
    const PendletonIdx = ROUTE.findIndex(p => p[0] === 45.6721 && p[1] === -118.7886)
    const coeursdAleneIdx = ROUTE.findIndex(p => p[0] === 47.6777 && p[1] === -116.7805)
    expect(PendletonIdx).toBeGreaterThan(bendIdx)
    expect(PendletonIdx).toBeLessThan(coeursdAleneIdx)
  })
})

describe('fills_fast feature', () => {
  const SAMPLE_FILL_FAST = `## Stage 1 — Boston to the Black Hills
*Days 1–10 · ~2,000 mi · Easy charging*

| Day | Route & drive | Charge | Sleep |
|---|---|---|---|
| 1 | **Boston → Watkins Glen** | Geneva | Watkins Glen hotel |
| 7 | **Sioux Falls → Badlands NP** | Rapid City | 🏕 Badlands/White River KOA ⏳ (High-demand, books out fast) |
| 10 | **Buffer / explore** | Rapid City | Hotel |

**Notes:** Buffer day.`
  
  it('marks day with ⏳ as fills_fast=true', () => {
    const stage = parseStageBlock(SAMPLE_FILL_FAST)
    const dayWithFillFast = stage.days_list.find(d => d.sleep.includes('Badlands/White River'))
    expect(dayWithFillFast).toBeDefined()
    expect(dayWithFillFast?.fills_fast).toBe(true)
  })
  
  it('strips ⏳ token from displayed sleep string', () => {
    const stage = parseStageBlock(SAMPLE_FILL_FAST)
    const dayWithFillFast = stage.days_list.find(d => d.sleep.includes('Badlands/White River'))
    expect(dayWithFillFast?.sleep).not.toContain('⏳')
    expect(dayWithFillFast?.sleep).toContain('Badlands/White River KOA')
  })
  
  it('normal camp days have fills_fast=undefined', () => {
    const stage = parseStageBlock(SAMPLE_FILL_FAST)
    const normalCamp = stage.days_list.find(d => d.sleep_type === 'camp' && !d.sleep.includes('Badlands'))
    expect(normalCamp?.fills_fast).toBeUndefined()
  })
})
