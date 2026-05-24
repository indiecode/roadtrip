import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import JourneyMap from './JourneyMap'

describe('JourneyMap', () => {
  it('rendering JourneyMap with center=[40, -100], zoom=6 renders the map', () => {
    vi.mock('react-leaflet', () => ({
      MapContainer: ({ children, className }: { children: React.ReactNode; className?: string }) => <div data-testid="leaflet-map" className={className}>{children}</div>,
      useMap: () => ({ flyTo: vi.fn() }),
      TileLayer: () => null,
      Polyline: () => null,
      CircleMarker: ({ children }: { children: React.ReactNode }) => <div data-testid="circle-marker">{children}</div>,
      Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }))

    render(
      <JourneyMap
        markers={[]}
        route={[]}
        routeSplitIndex={0}
        center={[40, -100]}
        zoom={6}
      />
    )

    const map = screen.getByTestId('leaflet-map')
    expect(map).toBeInTheDocument()
    expect(map).toHaveClass('journey-map')
  })

  it('re-rendering with new center/zoom works correctly', () => {
    vi.mock('react-leaflet', () => ({
      MapContainer: ({ children, className }: { children: React.ReactNode; className?: string }) => <div data-testid="leaflet-map" className={className}>{children}</div>,
      useMap: () => ({ flyTo: vi.fn() }),
      TileLayer: () => null,
      Polyline: () => null,
      CircleMarker: ({ children }: { children: React.ReactNode }) => <div data-testid="circle-marker">{children}</div>,
      Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }))

    const { rerender } = render(
      <JourneyMap
        markers={[]}
        route={[]}
        routeSplitIndex={0}
        center={[40, -100]}
        zoom={6}
      />
    )

    rerender(
      <JourneyMap
        markers={[]}
        route={[]}
        routeSplitIndex={0}
        center={[41, -101]}
        zoom={8}
      />
    )

    const map = screen.getByTestId('leaflet-map')
    expect(map).toBeInTheDocument()
    expect(map).toHaveClass('journey-map')
  })
})
