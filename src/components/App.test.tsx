import { render, screen, fireEvent } from '@testing-library/react'
import { App } from './App'
import { vi } from 'vitest'

// Mock child views — we test them separately
vi.mock('./PlanView', () => ({
  PlanView: () => <div data-testid="plan-view">Plan</div>,
}))
vi.mock('./MapView', () => ({
  MapView: () => <div data-testid="map-view">Map</div>,
}))

it('renders the app title', () => {
  render(<App />)
  expect(screen.getByText(/Boston/)).toBeInTheDocument()
})

it('shows plan view by default', () => {
  render(<App />)
  expect(screen.getByTestId('plan-view')).toBeInTheDocument()
  expect(screen.queryByTestId('map-view')).not.toBeInTheDocument()
})

it('switches to map view when Map tab is clicked', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('tab', { name: /Map/i }))
  expect(screen.getByTestId('map-view')).toBeInTheDocument()
  expect(screen.queryByTestId('plan-view')).not.toBeInTheDocument()
})

it('switches back to plan view when Plan tab is clicked', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('tab', { name: /Map/i }))
  fireEvent.click(screen.getByRole('tab', { name: /Plan/i }))
  expect(screen.getByTestId('plan-view')).toBeInTheDocument()
})

it('marks the active tab with aria-selected', () => {
  render(<App />)
  const planTab = screen.getByRole('tab', { name: /Plan/i })
  const mapTab = screen.getByRole('tab', { name: /Map/i })
  expect(planTab).toHaveAttribute('aria-selected', 'true')
  expect(mapTab).toHaveAttribute('aria-selected', 'false')

  fireEvent.click(mapTab)
  expect(planTab).toHaveAttribute('aria-selected', 'false')
  expect(mapTab).toHaveAttribute('aria-selected', 'true')
})
