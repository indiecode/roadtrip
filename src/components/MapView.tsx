import { useState } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MarkerPopup } from './MarkerPopup'
import type { MapMarker } from '../types'

type Filter = 'all' | 'park' | 'charger' | 'camp'

const MARKER_COLOR: Record<MapMarker['type'], string> = {
  park:    '#ff6b6b',
  charger: '#4a9eff',
  camp:    '#51cf66',
  city:    '#aaaaaa',
}

interface Props {
  markers: MapMarker[]
  route: [number, number][]
}

export function MapView({ markers, route }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = markers
    .filter(m => m.type !== 'city')
    .filter(m => filter === 'all' || m.type === filter)

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',     label: 'All' },
    { key: 'park',    label: '🏔 Parks' },
    { key: 'charger', label: '⚡ Chargers' },
    { key: 'camp',    label: '🏕 Camps' },
  ]

  return (
    <div className="map-view">
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{ color: '#e2b96f', weight: 2.5, dashArray: '6 3', opacity: 0.8 }}
          />
        )}
        {visible.map(marker => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={8}
            pathOptions={{
              color: MARKER_COLOR[marker.type],
              fillColor: MARKER_COLOR[marker.type],
              fillOpacity: 0.9,
              weight: 1.5,
            }}
          >
            <Popup>
              <MarkerPopup marker={marker} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="map-filters">
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
