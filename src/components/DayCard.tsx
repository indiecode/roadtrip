import type { Day } from '../types'

interface Props {
  day: Day
}

export function DayCard({ day }: Props) {
  const isCamp = day.sleep_type === 'camp'
  const isFillsFast = day.fills_fast === true

  return (
    <div data-testid="day-card" className={`day-card day-card--${isCamp ? 'camp' : 'hotel'}${isFillsFast ? ' day-card--fills-fast' : ''}`}>
      <div className="day-card-main">
        <span className="day-number">DAY {day.day}</span>
        <p className="day-route">{day.route}</p>
        <p className="day-charge">{day.charge}</p>
      </div>
      <div className="sleep-badge-wrapper">
        <span className={`sleep-badge sleep-badge--${isCamp ? 'camp' : 'hotel'}`}>
          {isCamp ? '🏕 Camp' : '🏨 Hotel'}
        </span>
        {isFillsFast && (
          <span className="sleep-badge sleep-badge--fill-fast" title="Books out fast — reserve at your 2-day window">
            ⚠️ Fast
          </span>
        )}
      </div>
    </div>
  )
}
