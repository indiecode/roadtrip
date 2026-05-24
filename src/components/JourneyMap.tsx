import { useEffect } from 'react'
import { MapContainer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapLayers } from './MapLayers'
import type { MapMarker } from '../types'

function MapFlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.6 })
  }, [center[0], center[1], zoom, map])
  return null
}

interface Props {
  markers: MapMarker[]
  route: [number, number][]
  routeSplitIndex: number
  center: [number, number]
  zoom: number
}

export default function JourneyMap({ markers, route, routeSplitIndex, center, zoom }: Props) {
  return (
    <MapContainer center={center} zoom={zoom} className="journey-map">
      <MapLayers markers={markers} route={route} routeSplitIndex={routeSplitIndex} />
      <MapFlyTo center={center} zoom={zoom} />
    </MapContainer>
  )
}
