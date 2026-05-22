import { render, screen } from '@testing-library/react'
import { MarkerPopup } from './MarkerPopup'
import type { MapMarker } from '../types'

const marker: MapMarker = {
  id: 'badlands-np',
  name: 'Badlands NP',
  lat: 43.8554,
  lng: -102.3397,
  type: 'park',
  day: 'Day 5',
  notes: 'Notch, Castle, Door & Window trails. Sage Creek free camp.',
  tags: ['Boston to the Black Hills'],
}

const minimalMarker: MapMarker = {
  id: 'chicago',
  name: 'Chicago',
  lat: 41.8781,
  lng: -87.6298,
  type: 'city',
}

describe('MarkerPopup', () => {
  it('renders the marker name', () => {
    render(<MarkerPopup marker={marker} />)
    expect(screen.getByText('Badlands NP')).toBeInTheDocument()
  })

  it('renders the day when present', () => {
    render(<MarkerPopup marker={marker} />)
    expect(screen.getByText('Day 5')).toBeInTheDocument()
  })

  it('renders notes when present', () => {
    render(<MarkerPopup marker={marker} />)
    expect(screen.getByText(/Notch, Castle/)).toBeInTheDocument()
  })

  it('renders tags when present', () => {
    render(<MarkerPopup marker={marker} />)
    expect(screen.getByText('Boston to the Black Hills')).toBeInTheDocument()
  })

  it('renders without crashing when optional fields are absent', () => {
    render(<MarkerPopup marker={minimalMarker} />)
    expect(screen.getByText('Chicago')).toBeInTheDocument()
  })
})
