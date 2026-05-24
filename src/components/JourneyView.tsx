import { useState, useMemo } from 'react'
import type { Stage, MapMarker, Day } from '../types'
import { DayCard } from './DayCard'
import JourneyMap from './JourneyMap'
import { JourneySlider } from './JourneySlider'

interface Props {
  stages: Stage[]
  markers: MapMarker[]
  route: [number, number][]
  routeSplitIndex: number
}

export function JourneyView({ stages, markers, route, routeSplitIndex }: Props) {
  const entries = useMemo(
    () => stages.flatMap(stage => stage.days_list.map(day => ({ day, stage }))),
    [stages]
  )

  const [entryIndex, setEntryIndex] = useState(0)
  const current = entries[entryIndex] ?? entries[0]
  const label = `Day ${current.day.day} · ${current.stage.name}`

  return (
    <div className="journey-view">
      <JourneyMap
        markers={markers}
        route={route}
        routeSplitIndex={routeSplitIndex}
        center={current.day.mapCenter}
        zoom={current.day.mapZoom}
      />
      <div className="journey-stage-label">Stage {current.stage.id} — {current.stage.name}</div>
      <DayCard day={current.day} />
      <JourneySlider
        count={entries.length}
        value={entryIndex}
        onChange={setEntryIndex}
        label={label}
      />
    </div>
  )
}
