import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './PlaceCard.css'

const EASE_OUT = [0.23, 1, 0.32, 1]

function ServiceTag({ children, index }) {
  return (
    <motion.li
      className="place-card__service"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.22,
        ease: EASE_OUT,
        delay: 0.28 + index * 0.04,
      }}
    >
      {children}
    </motion.li>
  )
}

export function PlaceCard({ place, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence mode="wait">
      {place && (
        <motion.div key={place.id}>
          <motion.div
            className="place-card__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
          />

          <motion.div
            className="place-card"
            role="dialog"
            aria-label={place.name}
            initial={{ x: '100%', opacity: 0, scale: 0.97 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: '100%', opacity: 0, transition: { duration: 0.16, ease: 'easeIn' } }}
            transition={{
              x: { duration: 0.28, ease: EASE_OUT },
              opacity: { duration: 0.22, ease: EASE_OUT },
              scale: { duration: 0.22, ease: EASE_OUT },
            }}
          >
            <div className="place-card__inner">
              {/* Header */}
              <div className="place-card__header">
                <div>
                  <span className="place-card__badge">◆ work event</span>
                  <h2 className="place-card__name">{place.name}</h2>
                  <p className="place-card__location">{place.location}</p>
                </div>
                <button
                  className="place-card__close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="place-card__divider" />

              {/* Stats */}
              <div className="place-card__stats">
                <div className="place-card__stat">
                  <span className="place-card__stat-value">
                    {place.attendees.toLocaleString()}
                  </span>
                  <span className="place-card__stat-label">attendees</span>
                </div>
                <div className="place-card__stat">
                  <span className="place-card__stat-value">{place.date}</span>
                  <span className="place-card__stat-label">year</span>
                </div>
              </div>

              <div className="place-card__divider" />

              {/* Services */}
              <div className="place-card__section">
                <h3 className="place-card__section-title">// services delivered</h3>
                <ul className="place-card__services">
                  {place.services.map((s, i) => (
                    <ServiceTag key={s} index={i}>{s}</ServiceTag>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
