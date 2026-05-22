import { useState } from 'react'
import { DayCard } from './DayCard'
import type { Stage } from '../types'

interface Props {
  stages: Stage[]
}

export function PlanView({ stages }: Props) {
  const [selectedId, setSelectedId] = useState(stages[0]?.id ?? 1)
  const selected = stages.find(s => s.id === selectedId) ?? stages[0]

  return (
    <div className="plan-view">
      <div className="stage-pills">
        {stages.map(stage => (
          <button
            key={stage.id}
            className={`stage-pill${stage.id === selectedId ? ' active' : ''}`}
            onClick={() => setSelectedId(stage.id)}
          >
            Stage {stage.id} · {stage.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div className="stage-header">
            <p className="stage-meta">{selected.days} · {selected.miles}</p>
            <h2 className="stage-name">Stage {selected.id} — {selected.name}</h2>
            {selected.notes && <p className="stage-notes">{selected.notes}</p>}
          </div>
          <div className="day-list">
            {selected.days_list.map((day, i) => (
              <DayCard key={i} day={day} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
