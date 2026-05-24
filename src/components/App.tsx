import { useState } from 'react'
import { PlanView } from './PlanView'
import { MapView } from './MapView'
import { JourneyView } from './JourneyView'
import tripData from '../data/trip.json'
import type { TripData } from '../types'

type Tab = 'plan' | 'map' | 'journey'

const data = tripData as TripData

export function App() {
  const [tab, setTab] = useState<Tab>('plan')

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">🚗 {data.title}</span>
        <nav className="tab-nav">
          <button
            data-testid="tab-plan"
            role="tab"
            aria-selected={tab === 'plan'}
            className={`tab-btn${tab === 'plan' ? ' active' : ''}`}
            onClick={() => setTab('plan')}
          >
            Plan
          </button>
          <button
            data-testid="tab-map"
            role="tab"
            aria-selected={tab === 'map'}
            className={`tab-btn${tab === 'map' ? ' active' : ''}`}
            onClick={() => setTab('map')}
          >
            Map
          </button>
          <button
            data-testid="tab-journey"
            role="tab"
            aria-selected={tab === 'journey'}
            className={`tab-btn${tab === 'journey' ? ' active' : ''}`}
            onClick={() => setTab('journey')}
          >
            Journey
          </button>
        </nav>
      </header>
      {tab === 'plan' ? (
        <div data-testid="view-plan" className="view plan-view"><PlanView stages={data.stages} /></div>
      ) : tab === 'map' ? (
        <div data-testid="view-map" className="view map-view"><MapView markers={data.markers} route={data.route} routeSplitIndex={data.routeSplitIndex} /></div>
      ) : (
        <div data-testid="view-journey" className="view journey-view"><JourneyView stages={data.stages} markers={data.markers} route={data.route} routeSplitIndex={data.routeSplitIndex} /></div>
      )}
    </div>
  )
}
