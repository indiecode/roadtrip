import type { MapMarker } from '../types'

interface Props {
  marker: MapMarker
}

export function MarkerPopup({ marker }: Props) {
  return (
    <div className="marker-popup">
      <p className="popup-name">{marker.name}</p>
      {marker.day && <p className="popup-day">{marker.day}</p>}
      {marker.notes && <p className="popup-notes">{marker.notes}</p>}
      {marker.tags && marker.tags.length > 0 && (
        <div className="popup-tags">
          {marker.tags.map(tag => (
            <span key={tag} className="popup-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}
