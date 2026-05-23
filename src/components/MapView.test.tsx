import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MapView } from './MapView'
import type { MapMarker } from '../types'

// react-leaflet uses browser APIs not available in jsdom — mock it
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="leaflet-map">{children}</div>
  ),
  TileLayer: () => null,
  Polyline: () => null,
  CircleMarker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="circle-marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

const markers: MapMarker[] = [
  {
    id: 'badlands-np',
    name: 'Badlands NP',
    lat: 43.8554,
    lng: -102.3397,
    type: 'park',
    day: 'Day 5',
  },
  {
    id: 'kalispell',
    name: 'Kalispell',
    lat: 48.1960,
    lng: -114.3115,
    type: 'charger',
    day: 'Day 52',
  },
  {
    id: 'sage-creek',
    name: 'Sage Creek',
    lat: 43.9554,
    lng: -102.5397,
    type: 'camp',
    day: 'Day 5',
  },
]

const route: [number, number][] = [[42.36, -71.06], [41.50, -81.69]]

describe('MapView', () => {
  it('renders the map container', () => {
    render(<MapView markers={markers} route={route} routeSplitIndex={1} />)
    expect(screen.getByTestId('leaflet-map')).toBeInTheDocument()
  })

  it('renders filter pills', () => {
    render(<MapView markers={markers} route={route} routeSplitIndex={1} />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Parks/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Chargers/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Camps/ })).toBeInTheDocument()
  })

  it('renders all markers by default', () => {
    render(<MapView markers={markers} route={route} routeSplitIndex={1} />)
    expect(screen.getAllByTestId('circle-marker')).toHaveLength(3)
  })

  it('filters to only park markers when Parks is clicked', () => {
    render(<MapView markers={markers} route={route} routeSplitIndex={1} />)
    fireEvent.click(screen.getByRole('button', { name: /Parks/ }))
    expect(screen.getAllByTestId('circle-marker')).toHaveLength(1)
    expect(screen.getByText('Badlands NP')).toBeInTheDocument()
  })

  it('filters to only charger markers when Chargers is clicked', () => {
    render(<MapView markers={markers} route={route} routeSplitIndex={1} />)
    fireEvent.click(screen.getByRole('button', { name: /Chargers/ }))
    expect(screen.getAllByTestId('circle-marker')).toHaveLength(1)
    expect(screen.getByText('Kalispell')).toBeInTheDocument()
  })

  it('restores all markers when All is clicked after filtering', () => {
    render(<MapView markers={markers} route={route} routeSplitIndex={1} />)
    fireEvent.click(screen.getByRole('button', { name: /Parks/ }))
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByTestId('circle-marker')).toHaveLength(3)
  })
})
