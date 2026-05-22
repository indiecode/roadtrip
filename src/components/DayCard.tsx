import type { Day } from '../types'

interface Props {
  day: Day
}

export function DayCard({ day }: Props) {
  const isCamp = day.sleep_type === 'camp'

  return (
    <div className={`day-card day-card--${isCamp ? 'camp' : 'hotel'}`}>
      <div className="day-card-main">
        <span className="day-number">DAY {day.day}</span>
        <p className="day-route">{day.route}</p>
        <p className="day-charge">{day.charge}</p>
      </div>
      <span className={`sleep-badge sleep-badge--${isCamp ? 'camp' : 'hotel'}`}>
        {isCamp ? '🏕 Camp' : '🏨 Hotel'}
      </span>
    </div>
  )
}
