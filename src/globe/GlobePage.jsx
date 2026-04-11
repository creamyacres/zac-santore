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
  const [navOpen, setNavOpen] = useState(false)

  const handlePlaceClick = useCallback((place) => {
    setSelectedPlace(place)
    setFocusPlace(place)
  }, [])

  const handleNavSelect = useCallback((place) => {
    setSelectedPlace(place)
    setFocusPlace(place)
    setNavOpen(false) // close nav on mobile after selecting
  }, [])

  const handleClose = useCallback(() => {
    setSelectedPlace(null)
  }, [])

  return (
    <div className="globe-page">
      <header className="globe-page__header">
        <Link to="/" className="globe-page__back">← back</Link>
        <span className="globe-page__title">// events</span>
        <div className="globe-page__header-right">
          <span className="globe-page__count">{places.length} events</span>
          <button
            className="globe-page__nav-toggle"
            onClick={() => setNavOpen((o) => !o)}
            aria-label="Toggle event list"
            aria-expanded={navOpen}
          >
            {navOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <SideNav
        places={places}
        selectedPlace={selectedPlace}
        onSelect={handleNavSelect}
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
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
