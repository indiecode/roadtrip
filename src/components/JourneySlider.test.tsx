import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { JourneySlider } from './JourneySlider'

describe('JourneySlider', () => {
  it('range input change fires onChange with the new numeric value', () => {
    const handleChange = vi.fn()
    render(<JourneySlider count={5} value={2} onChange={handleChange} label="Day 10–12" />)
    const range = screen.getByRole('slider')
    fireEvent.change(range, { target: { value: '4' } })
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('prev button is disabled at value === 0 and not called by clicks while disabled', () => {
    const handleChange = vi.fn()
    render(<JourneySlider count={5} value={0} onChange={handleChange} label="Day 1" />)
    const prev = screen.getByRole('button', { name: 'Previous day' })
    expect(prev).toHaveAttribute('disabled')
    fireEvent.click(prev)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('prev button at value > 0 calls onChange with value - 1', () => {
    const handleChange = vi.fn()
    render(<JourneySlider count={5} value={2} onChange={handleChange} label="Day 10–12" />)
    const prev = screen.getByRole('button', { name: 'Previous day' })
    fireEvent.click(prev)
    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('next button is disabled at value === count - 1', () => {
    const handleChange = vi.fn()
    render(<JourneySlider count={5} value={4} onChange={handleChange} label="Day 10–12" />)
    const next = screen.getByRole('button', { name: 'Next day' })
    expect(next).toHaveAttribute('disabled')
  })

  it('next button below the cap calls onChange with value + 1', () => {
    const handleChange = vi.fn()
    render(<JourneySlider count={5} value={2} onChange={handleChange} label="Day 10–12" />)
    const next = screen.getByRole('button', { name: 'Next day' })
    fireEvent.click(next)
    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('the label prop is rendered as text inside the day-label div', () => {
    render(<JourneySlider count={5} value={2} onChange={() => {}} label="Day 10–12" />)
    expect(screen.getByText('Day 10–12')).toBeInTheDocument()
  })
})
