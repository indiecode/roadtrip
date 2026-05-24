import { useState } from 'react'
import { MapContainer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapLayers, MARKER_COLOR } from './MapLayers'
import type { MapMarker } from '../types'

type Filter = 'all' | 'park' | 'charger' | 'camp' | 'hotel'

interface Props {
  markers: MapMarker[]
  route: [number, number][]
  routeSplitIndex: number
}

export function MapView({ markers, route, routeSplitIndex }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',     label: 'All' },
    { key: 'park',    label: '🏔 Parks' },
    { key: 'charger', label: '⚡ Chargers' },
    { key: 'camp',    label: '🏕 Camps' },
    { key: 'hotel',   label: '🏨 Hotels' },
  ]

  return (
    <div className="map-view">
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        className="leaflet-map"
      >
        <MapLayers
          markers={markers}
          route={route}
          routeSplitIndex={routeSplitIndex}
          filter={m => filter === 'all' || m.type === filter}
        />
      </MapContainer>

      <div className="map-filters">
        <span className="route-legend">
          <span className="route-legend-line route-legend-out" /> Outbound
          <span className="route-legend-line route-legend-back" /> Return
        </span>
        <span className="filter-divider" />
        {filters.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-pill${filter === key ? ' active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
