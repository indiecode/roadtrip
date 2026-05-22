import { useState } from 'react'
import { PlanView } from './PlanView'
import { MapView } from './MapView'
import tripData from '../data/trip.json'
import type { TripData } from '../types'

type Tab = 'plan' | 'map'

const data = tripData as TripData

export function App() {
  const [tab, setTab] = useState<Tab>('plan')

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">🚗 {data.title}</span>
        <nav className="tab-nav">
          <button
            className={`tab-btn${tab === 'plan' ? ' active' : ''}`}
            onClick={() => setTab('plan')}
          >
            Plan
          </button>
          <button
            className={`tab-btn${tab === 'map' ? ' active' : ''}`}
            onClick={() => setTab('map')}
          >
            Map
          </button>
        </nav>
      </header>
      {tab === 'plan' ? (
        <PlanView stages={data.stages} />
      ) : (
        <MapView markers={data.markers} route={data.route} />
      )}
    </div>
  )
}
