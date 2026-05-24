interface Props {
  count: number
  value: number
  onChange: (v: number) => void
  label: string
}

export function JourneySlider({ count, value, onChange, label }: Props) {
  const prev = () => onChange(Math.max(0, value - 1))
  const next = () => onChange(Math.min(count - 1, value + 1))

  return (
    <>
      <div className="journey-slider-row">
        <button
          className="journey-slider-prev"
          aria-label="Previous day"
          onClick={prev}
          disabled={value === 0}
        >
          ‹
        </button>
        <input
          type="range"
          min={0}
          max={count - 1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="journey-slider-range"
          aria-label="Trip day"
        />
        <button
          className="journey-slider-next"
          aria-label="Next day"
          onClick={next}
          disabled={value === count - 1}
        >
          ›
        </button>
      </div>
      <div className="journey-day-label">{label}</div>
    </>
  )
}
