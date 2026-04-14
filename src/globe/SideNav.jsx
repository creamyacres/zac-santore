import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './SideNav.css'

const EASE_OUT = [0.23, 1, 0.32, 1]

/** Build ordered list of nav items — singles stay in place, grouped events
 *  collapse into one expandable row at the position of the first child. */
function buildNavItems(places) {
  const groupMap = {}
  const result = []
  const seen = new Set()

  places.forEach((place) => {
    if (place.parentId) {
      if (!groupMap[place.parentId]) {
        groupMap[place.parentId] = []
      }
      groupMap[place.parentId].push(place)

      if (!seen.has(place.parentId)) {
        seen.add(place.parentId)
        result.push({ type: 'group', parentId: place.parentId, children: groupMap[place.parentId] })
      }
    } else {
      result.push({ type: 'single', place })
    }
  })

  return result
}

function SingleItem({ place, selectedPlace, onSelect, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT, delay: index * 0.025 }}
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
  )
}

function GroupItem({ parentId, children, selectedPlace, onSelect, isExpanded, onToggle, index }) {
  const label = children[0].name
  const date = children[0].date
  const hasActiveChild = children.some((c) => c.id === selectedPlace?.id)

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT, delay: index * 0.025 }}
    >
      {/* Group header */}
      <button
        className={`side-nav__item side-nav__item--group ${hasActiveChild ? 'side-nav__item--active' : ''}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span className="side-nav__indicator">{isExpanded ? '◈' : '◆'}</span>
        <span className="side-nav__name">{label}</span>
        <span className="side-nav__group-meta">
          <span className="side-nav__date">{date}</span>
          <span className="side-nav__chevron" data-open={isExpanded}>›</span>
        </span>
      </button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.ul
            className="side-nav__children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            {children.map((place, i) => (
              <motion.li
                key={place.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18, ease: EASE_OUT, delay: i * 0.04 }}
              >
                <button
                  className={`side-nav__item side-nav__item--child ${selectedPlace?.id === place.id ? 'side-nav__item--active' : ''}`}
                  onClick={() => onSelect(place)}
                >
                  <span className="side-nav__child-dot">·</span>
                  <span className="side-nav__name">{place.location}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export function SideNav({ places, selectedPlace, onSelect, isOpen, onClose }) {
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const navItems = buildNavItems(places)

  // Auto-expand group when a child place is selected (e.g. via globe pin click)
  useEffect(() => {
    if (selectedPlace?.parentId) {
      setExpandedGroups((prev) => {
        if (prev.has(selectedPlace.parentId)) return prev
        return new Set([...prev, selectedPlace.parentId])
      })
    }
  }, [selectedPlace])

  const toggleGroup = (parentId) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(parentId)) next.delete(parentId)
      else next.add(parentId)
      return next
    })
  }

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
          {navItems.map((item, i) =>
            item.type === 'single' ? (
              <SingleItem
                key={item.place.id}
                place={item.place}
                selectedPlace={selectedPlace}
                onSelect={onSelect}
                index={i}
              />
            ) : (
              <GroupItem
                key={item.parentId}
                parentId={item.parentId}
                children={item.children}
                selectedPlace={selectedPlace}
                onSelect={onSelect}
                isExpanded={expandedGroups.has(item.parentId)}
                onToggle={() => toggleGroup(item.parentId)}
                index={i}
              />
            )
          )}
        </ul>
      </nav>
    </>
  )
}
