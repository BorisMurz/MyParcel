import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Polygon, useMap, AttributionControl } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'

type LatLngTuple = [number, number]

const center: LatLngExpression = [55.8, 37.3]

function ZoomToPolygon({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions)
    }
  }, [positions, map])

  return null
}

function parseWktPolygon(wkt: string): LatLngTuple[] {
  if (!wkt) return []

  const clean = wkt.trim()

  if (clean.startsWith('POLYGON')) {
    const inside = clean.replace('POLYGON ((', '').replace('))', '')
    return inside
      .split(',')
      .map((pair) => pair.trim().split(/\s+/).map(Number))
      .filter((pair) => pair.length >= 2)
      .map(([lng, lat]) => [lat, lng] as LatLngTuple)
  }

  if (clean.startsWith('MULTIPOLYGON')) {
    const inside = clean.replace('MULTIPOLYGON (((', '').replace(')))', '')
    return inside
      .split(',')
      .map((pair) => pair.trim().split(/\s+/).map(Number))
      .filter((pair) => pair.length >= 2)
      .map(([lng, lat]) => [lat, lng] as LatLngTuple)
  }

  return []
}

export default function MapPanel({
  geometryList,
  onSelectGeometry,
  selectedWkt,
  onLoadGeometry
}: {
  geometryList: { name: string; WKT: string }[]
  onSelectGeometry: (wkt: string) => void
  selectedWkt: string
  onLoadGeometry: () => Promise<void>
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) {
      onLoadGeometry().then(() => setLoaded(true))
    }
  }, [loaded, onLoadGeometry])

  const positions = useMemo<LatLngTuple[]>(
    () => (selectedWkt ? parseWktPolygon(selectedWkt) : []),
    [selectedWkt]
  )

  return (
    <div className="map-panel">
      <select
        className="geometry-select"
        onClick={() => onLoadGeometry()}
        onChange={(e) => onSelectGeometry(e.target.value)}
      >
        <option value="">Выберите участок</option>
        {geometryList.map((g, idx) => (
          <option key={idx} value={g.WKT}>
            {g.name}
          </option>
        ))}
      </select>

      <MapContainer
        center={center}
        zoom={10}
        className="map"
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors and Boris Murzakaev"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.length > 0 && (
          <>
            <Polygon positions={positions} pathOptions={{ color: '#2563eb' }} />
            <ZoomToPolygon positions={positions} />
          </>
        )}
      </MapContainer>
    </div>
  )
}