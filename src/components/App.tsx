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
            role="tab"
            aria-selected={tab === 'plan'}
            className={`tab-btn${tab === 'plan' ? ' active' : ''}`}
            onClick={() => setTab('plan')}
          >
            Plan
          </button>
          <button
            role="tab"
            aria-selected={tab === 'map'}
            className={`tab-btn${tab === 'map' ? ' active' : ''}`}
            onClick={() => setTab('map')}
          >
            Map
          </button>
          <button
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
        <PlanView stages={data.stages} />
      ) : tab === 'map' ? (
        <MapView markers={data.markers} route={data.route} routeSplitIndex={data.routeSplitIndex} />
      ) : (
        <JourneyView stages={data.stages} markers={data.markers} route={data.route} routeSplitIndex={data.routeSplitIndex} />
      )}
    </div>
  )
}
