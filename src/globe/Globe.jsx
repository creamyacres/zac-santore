import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import ReactGlobe from 'react-globe.gl'
import { createDitherPass } from './DitherPass.js'
import { addStarfield } from './Starfield.js'

const COUNTRIES_URL =
  'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson'

// Offset pins that share the same lat/lng so they're all visible.
// Groups them and fans them out by a small fixed radius.
function spreadOverlapping(places) {
  const key = (p) => `${p.lat.toFixed(3)},${p.lng.toFixed(3)}`
  const groups = {}
  places.forEach((p) => {
    const k = key(p)
    if (!groups[k]) groups[k] = []
    groups[k].push(p)
  })

  return places.map((p) => {
    const group = groups[key(p)]
    if (group.length === 1) return p
    const i = group.indexOf(p)
    const total = group.length
    // Fan around a circle — 1.8° radius so pins are clearly separated
    const angle = (2 * Math.PI * i) / total
    return {
      ...p,
      lat: p.lat + 1.8 * Math.cos(angle),
      lng: p.lng + 1.8 * Math.sin(angle),
    }
  })
}

export function Globe({ places, onPlaceClick, selectedPlace, focusPlace }) {
  const globeRef = useRef(null)
  const [countries, setCountries] = useState([])

  const spreadPlaces = useMemo(() => spreadOverlapping(places), [places])

  useEffect(() => {
    fetch(COUNTRIES_URL)
      .then((r) => r.json())
      .then((data) => setCountries(data.features))
      .catch(() => {})
  }, [])

  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return

    const scene = globe.scene()
    const renderer = globe.renderer()

    addStarfield(scene)

    try {
      const composer = globe.postProcessingComposer()
      const ditherPass = createDitherPass(
        renderer.domElement.width,
        renderer.domElement.height
      )
      composer.addPass(ditherPass)
    } catch (e) {
      console.warn('Dither post-processing unavailable:', e)
    }

    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.4
    globe.controls().enableZoom = false
  }, [])

  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    const controls = globe.controls()
    if (controls) controls.autoRotate = !selectedPlace
  }, [selectedPlace])

  useEffect(() => {
    if (!focusPlace) return
    const globe = globeRef.current
    if (!globe) return
    globe.pointOfView({ lat: focusPlace.lat, lng: focusPlace.lng, altitude: 1.8 }, 1200)
  }, [focusPlace])

  return (
    <ReactGlobe
      ref={globeRef}
      onGlobeReady={handleGlobeReady}
      rendererConfig={{ alpha: true, antialias: true }}
      globeImageUrl=""
      backgroundColor="rgba(0,0,0,0)"
      atmosphereColor="#555555"
      atmosphereAltitude={0.12}
      polygonsData={countries}
      polygonAltitude={0.01}
      polygonCapColor={() => '#c0c0c0'}
      polygonSideColor={() => '#3a3a3a'}
      polygonStrokeColor={() => '#ffffff'}
      polygonLabel={({ properties: p }) => p.NAME}
      pointsData={spreadPlaces}
      pointLat={(d) => d.lat}
      pointLng={(d) => d.lng}
      pointAltitude={0.04}
      pointRadius={(d) => d.id === selectedPlace?.id ? 0.8 : 0.55}
      pointColor={() => '#ffffff'}
      pointLabel={(d) => `<span style="font-family:monospace;font-size:12px;color:rgba(255,255,255,0.85);background:#111111;border:1px solid rgba(255,255,255,0.15);padding:3px 8px">${d.name} — ${d.location} (${d.date})</span>`}
      onPointClick={(d) => onPlaceClick(d)}
      pointsMerge={false}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  )
}
