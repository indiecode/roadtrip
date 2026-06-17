/* eslint-disable react-refresh/only-export-components */
import { TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet'
import { MarkerPopup } from './MarkerPopup'
import type { MapMarker } from '../types'

export const MARKER_COLOR: Record<MapMarker['type'], string> = {
  park:    '#ff6b6b',
  charger: '#4a9eff',
  camp:    '#51cf66',
  hotel:   '#c084fc',
  city:    '#aaaaaa',
}

// Amber color for fills-fast camps
const FILL_FAST_COLOR = '#e2b96f'

interface Props {
  markers: MapMarker[]
  route: [number, number][]
  routeSplitIndex: number
  filter?: (m: MapMarker) => boolean
}

export function MapLayers({ markers, route, routeSplitIndex, filter }: Props) {
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route.length > 1 && (
        <>
          <Polyline
            positions={route.slice(0, routeSplitIndex + 1)}
            pathOptions={{ color: '#e05555', weight: 2.5, dashArray: '6 3', opacity: 0.8 }}
          />
          <Polyline
            positions={route.slice(routeSplitIndex)}
            pathOptions={{ color: '#4a9eff', weight: 2.5, dashArray: '6 3', opacity: 0.8 }}
          />
        </>
      )}
      {markers.filter(m => m.type !== 'city').filter(m => filter ? filter(m) : true).map(marker => {
        const markerColor = marker.fillsFast ? FILL_FAST_COLOR : MARKER_COLOR[marker.type]
        return <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={8}
          pathOptions={{
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.9,
            weight: 1.5,
          }}
        >
          <Popup>
            <MarkerPopup marker={marker} />
          </Popup>
        </CircleMarker>
      })}
    </>
  )
}
