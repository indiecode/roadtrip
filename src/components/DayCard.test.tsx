import { render, screen } from '@testing-library/react'
import { DayCard } from './DayCard'
import type { Day } from '../types'

const hotelDay: Day = {
  day: '1',
  route: 'Boston → Cleveland, OH — long highway day, pure transit',
  charge: 'I-90 Superchargers all along',
  sleep: 'Cleveland hotel (cheap, easy)',
  sleep_type: 'hotel',
  mapCenter: [41.5, -81.6],
  mapZoom: 6,
}

const campDay: Day = {
  day: '5',
  route: 'Sioux Falls → Badlands NP — arrive afternoon, sunset over spires',
  charge: 'Rapid City / Wall area',
  sleep: '🏕 Sage Creek (free, bison)',
  sleep_type: 'camp',
  mapCenter: [41.5, -81.6],
  mapZoom: 6,
}

const rangeDay: Day = {
  day: '10–12',
  route: 'Yellowstone (3 days)',
  charge: 'West Yellowstone overnight',
  sleep: 'West Yellowstone hotel',
  sleep_type: 'hotel',
  mapCenter: [41.5, -81.6],
  mapZoom: 6,
}

const campDayFillsFast: Day = {
  day: '16',
  route: 'Yellowstone → Grand Teton',
  charge: 'Jackson Supercharger',
  sleep: 'Colter Bay RV Park or Snake River KOA, Jackson',
  sleep_type: 'camp',
  fills_fast: true,
  mapCenter: [41.5, -81.6],
  mapZoom: 6,
}

describe('DayCard', () => {
  it('renders day number for a single day', () => {
    render(<DayCard day={hotelDay} />)
    expect(screen.getByText('DAY 1')).toBeInTheDocument()
  })

  it('renders day range', () => {
    render(<DayCard day={rangeDay} />)
    expect(screen.getByText('DAY 10–12')).toBeInTheDocument()
  })

  it('renders the route text', () => {
    render(<DayCard day={hotelDay} />)
    expect(screen.getByText(/Boston → Cleveland/)).toBeInTheDocument()
  })

  it('renders the charge note', () => {
    render(<DayCard day={hotelDay} />)
    expect(screen.getByText(/I-90 Superchargers/)).toBeInTheDocument()
  })

  it('shows Hotel badge for hotel nights', () => {
    render(<DayCard day={hotelDay} />)
    expect(screen.getByText('🏨 Hotel')).toBeInTheDocument()
  })

  it('shows Camp badge for camp nights', () => {
    render(<DayCard day={campDay} />)
    expect(screen.getByText('🏕 Camp')).toBeInTheDocument()
  })

  it('applies hotel CSS class for hotel nights', () => {
    const { container } = render(<DayCard day={hotelDay} />)
    expect(container.firstChild).toHaveClass('day-card--hotel')
  })

  it('applies camp CSS class for camp nights', () => {
    const { container } = render(<DayCard day={campDay} />)
    expect(container.firstChild).toHaveClass('day-card--camp')
  })

  it('shows Fast badge for fills-fast camp nights', () => {
    render(<DayCard day={campDayFillsFast} />)
    expect(screen.getByText('⚠️ Fast')).toBeInTheDocument()
  })

  it('applies fills-fast CSS class when fills_fast=true', () => {
    const { container } = render(<DayCard day={campDayFillsFast} />)
    expect(container.firstChild).toHaveClass('day-card--fills-fast')
  })

  it('does not show Fast badge for normal camp nights', () => {
    render(<DayCard day={campDay} />)
    expect(screen.queryByText('⚠️ Fast')).not.toBeInTheDocument()
  })
})
