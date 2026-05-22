import { describe, it, expect } from 'vitest'
import { parseStageBlock, parseDayTable, parseStages } from './parse-trip'

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
