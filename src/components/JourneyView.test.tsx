import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { JourneyView } from './JourneyView'

describe('JourneyView', () => {
  const stage1: Stage = {
    id: 1,
    name: 'Boston to the Black Hills',
    days: 'Days 1–8',
    miles: '~2,000 mi',
    notes: 'Warm-up miles',
    days_list: [
      { day: '1', route: 'Boston → Cleveland', charge: 'I-90', sleep: 'Hotel', sleep_type: 'hotel', mapCenter: [41.5, -81.6], mapZoom: 6 },
      { day: '2', route: 'Cleveland → Columbus', charge: 'I-71', sleep: 'Hotel', sleep_type: 'hotel', mapCenter: [40.5, -82.6], mapZoom: 6 },
    ],
  }

  const stage2: Stage = {
    id: 2,
    name: 'Yellowstone & Grand Teton',
    days: 'Days 9–16',
    miles: '~800 mi',
    notes: 'Gateway-town Superchargers',
    days_list: [
      { day: '9', route: 'Black Hills → West Yellowstone', charge: 'Sheridan', sleep: 'Hotel', sleep_type: 'hotel', mapCenter: [44.5, -110.7], mapZoom: 6 },
      { day: '10', route: 'Yellowstone → Grand Teton', charge: 'Jackson', sleep: 'Hotel', sleep_type: 'hotel', mapCenter: [43.8, -110.6], mapZoom: 6 },
    ],
  }

  const markers: { id: string; name: string; lat: number; lng: number; type: string }[] = []

  it('mounts at entry index 0: renders day 1 route via DayCard, mocked JourneyMap shows day-1 center, stage label shows first stage name', () => {
    vi.mock('./JourneyMap', () => ({
      default: ({ center, zoom }: { center: [number, number]; zoom: number }) => (
        <div data-testid="mock-journeymap">
          Center: [{center[0]}, {center[1]}] Zoom: {zoom}
        </div>
      ),
    }))

    render(
      <JourneyView
        stages={[stage1, stage2]}
        markers={markers}
        route={[[40, -100], [41, -101]]}
        routeSplitIndex={0}
      />
    )

    expect(screen.getByText('Boston → Cleveland')).toBeInTheDocument()
    expect(screen.getByText('DAY 1')).toBeInTheDocument()
    expect(screen.getByText('Stage 1 — Boston to the Black Hills')).toBeInTheDocument()
    expect(screen.getByText('Center: [41.5, -81.6] Zoom: 6')).toBeInTheDocument()
  })

  it('scrub: firing change on range input to value=2 re-renders with day-3 route and center', () => {
    vi.mock('./JourneyMap', () => ({
      default: ({ center, zoom }: { center: [number, number]; zoom: number }) => (
        <div data-testid="mock-journeymap">
          Center: [{center[0]}, {center[1]}] Zoom: {zoom}
        </div>
      ),
    }))

    const { rerender } = render(
      <JourneyView
        stages={[stage1, stage2]}
        markers={markers}
        route={[[40, -100], [41, -101]]}
        routeSplitIndex={0}
      />
    )

    expect(screen.getByText('DAY 1')).toBeInTheDocument()

    const range = screen.getByRole('slider')
    fireEvent.change(range, { target: { value: '2' } })

    expect(screen.getByText('DAY 9')).toBeInTheDocument()
    expect(screen.getByText('Center: [44.5, -110.7] Zoom: 6')).toBeInTheDocument()
  })

  it('stage boundary: scrubbing from stage 1 to stage 2 updates stage label text', () => {
    vi.mock('./JourneyMap', () => ({
      default: ({ center, zoom }: { center: [number, number]; zoom: number }) => (
        <div data-testid="mock-journeymap">
          Center: [{center[0]}, {center[1]}] Zoom: {zoom}
        </div>
      ),
    }))

    const { rerender } = render(
      <JourneyView
        stages={[stage1, stage2]}
        markers={markers}
        route={[[40, -100], [41, -101]]}
        routeSplitIndex={0}
      />
    )

    expect(screen.getByText('Stage 1 — Boston to the Black Hills')).toBeInTheDocument()

    const range = screen.getByRole('slider')
    fireEvent.change(range, { target: { value: '2' } })

    expect(screen.getByText('Stage 2 — Yellowstone & Grand Teton')).toBeInTheDocument()
  })
})
