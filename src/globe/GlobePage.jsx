import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Globe } from './Globe.jsx'
import { PlaceCard } from './PlaceCard.jsx'
import { SideNav } from './SideNav.jsx'
import { places } from './places.js'
import './Globe.css'
import './GlobePage.css'

export default function GlobePage() {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [focusPlace, setFocusPlace] = useState(null)

  const handlePlaceClick = useCallback((place) => {
    setSelectedPlace(place)
    setFocusPlace(place)
  }, [])

  const handleNavSelect = useCallback((place) => {
    setSelectedPlace(place)
    setFocusPlace(place)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedPlace(null)
  }, [])

  return (
    <div className="globe-page">
      <header className="globe-page__header">
        <Link to="/" className="globe-page__back">← zac-santore.com</Link>
        <span className="globe-page__title">// events</span>
        <span className="globe-page__count">{places.length} events</span>
      </header>

      <SideNav
        places={places}
        selectedPlace={selectedPlace}
        onSelect={handleNavSelect}
      />

      <Globe
        places={places}
        onPlaceClick={handlePlaceClick}
        selectedPlace={selectedPlace}
        focusPlace={focusPlace}
      />

      <PlaceCard place={selectedPlace} onClose={handleClose} />
    </div>
  )
}
