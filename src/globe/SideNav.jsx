import { motion, AnimatePresence } from 'framer-motion'
import './SideNav.css'

const EASE_OUT = [0.23, 1, 0.32, 1]

export function SideNav({ places, selectedPlace, onSelect, isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="side-nav__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Nav panel — desktop: always visible sidebar; mobile: bottom sheet */}
      <nav
        className={`side-nav ${isOpen ? 'side-nav--open' : ''}`}
        aria-label="Events"
      >
        <p className="side-nav__heading">// events</p>
        <ul className="side-nav__list">
          {places.map((place, i) => (
            <motion.li
              key={place.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT, delay: i * 0.03 }}
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
    </>
  )
}
