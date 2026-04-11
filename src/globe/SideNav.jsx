import { motion } from 'framer-motion'
import './SideNav.css'

const EASE_OUT = [0.23, 1, 0.32, 1]

export function SideNav({ places, selectedPlace, onSelect }) {
  return (
    <nav className="side-nav" aria-label="Places">
      <p className="side-nav__heading">// visited</p>
      <ul className="side-nav__list">
        {places.map((place, i) => (
          <motion.li
            key={place.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT, delay: i * 0.04 }}
          >
            <button
              className={`side-nav__item ${selectedPlace?.id === place.id ? 'side-nav__item--active' : ''}`}
              onClick={() => onSelect(place)}
            >
              <span className="side-nav__indicator">◆</span>
              <span className="side-nav__name">{place.name}</span>
              <span className="side-nav__date">{place.date}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}

function formatYear(dateStr) {
  return dateStr.split('-')[0]
}
