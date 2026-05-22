import { render, screen, fireEvent } from '@testing-library/react'
import { PlanView } from './PlanView'
import type { Stage } from '../types'

const stages: Stage[] = [
  {
    id: 1,
    name: 'Boston to the Black Hills',
    days: 'Days 1–8',
    miles: '~2,000 mi',
    notes: 'Easy charging the whole way.',
    days_list: [
      {
        day: '1',
        route: 'Boston → Cleveland, OH',
        charge: 'I-90 Superchargers',
        sleep: 'Cleveland hotel',
        sleep_type: 'hotel',
      },
    ],
  },
  {
    id: 2,
    name: 'Yellowstone & Grand Teton',
    days: 'Days 9–16',
    miles: '~800 mi',
    notes: 'Gateway-town Superchargers.',
    days_list: [
      {
        day: '9',
        route: 'Black Hills → West Yellowstone',
        charge: 'Sheridan / Cody corridor',
        sleep: 'West Yellowstone hotel',
        sleep_type: 'hotel',
      },
    ],
  },
]

describe('PlanView', () => {
  it('renders a pill for every stage', () => {
    render(<PlanView stages={stages} />)
    expect(screen.getByText(/Black Hills/)).toBeInTheDocument()
    expect(screen.getByText(/Yellowstone/)).toBeInTheDocument()
  })

  it('shows the first stage by default', () => {
    render(<PlanView stages={stages} />)
    expect(screen.getByText(/Boston → Cleveland/)).toBeInTheDocument()
    expect(screen.queryByText(/Black Hills → West Yellowstone/)).not.toBeInTheDocument()
  })

  it('switches to the selected stage when a pill is clicked', () => {
    render(<PlanView stages={stages} />)
    fireEvent.click(screen.getByText(/Yellowstone/))
    expect(screen.getByText(/Black Hills → West Yellowstone/)).toBeInTheDocument()
    expect(screen.queryByText(/Boston → Cleveland/)).not.toBeInTheDocument()
  })

  it('shows the stage header with day range and mileage', () => {
    render(<PlanView stages={stages} />)
    expect(screen.getByText(/Days 1–8/)).toBeInTheDocument()
    expect(screen.getByText(/2,000 mi/)).toBeInTheDocument()
  })

  it('shows stage notes', () => {
    render(<PlanView stages={stages} />)
    expect(screen.getByText(/Easy charging/)).toBeInTheDocument()
  })
})
