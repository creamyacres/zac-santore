import { useState, useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import GlobePage from './globe/GlobePage.jsx'
import './App.css'

const PROJECTS = [
  {
    id: 1,
    name: 'Lefty AI',
    year: '2025',
    tags: ['AI', 'Automation', 'Local Business'],
    description:
      'White-glove AI automation for local businesses. Missed call text-back, 24/7 AI chat, Google profile optimization, and smart email workflows — set up in 48 hours.',
    url: 'https://www.lefty-ai.com',
  },
  {
    id: 2,
    name: 'CooCheena',
    year: '2024',
    tags: ['React', 'Supabase', 'AI'],
    description:
      'AI-powered recipe and meal planning app. Generate recipes from ideas or URLs, organize them into collections, plan weekly meals, and auto-generate grocery lists.',
    url: 'https://coocheena.com',
  },
  {
    id: 3,
    name: 'HEIC Converter',
    year: '2025',
    tags: ['Electron', 'Node.js'],
    description:
      'Drag-and-drop desktop app for bulk HEIC to JPEG/PNG conversion. Runs entirely local — no uploads, no accounts, no waiting.',
    url: null,
  },
  {
    id: 4,
    name: 'Diorama',
    year: '2025',
    tags: ['AI', 'React', 'Three.js'],
    description:
      'Event-focused AI prompt app for generating 3D layout concepts. Describe a space, get an interactive floor plan — built for event producers thinking in rooms, not pixels.',
    url: 'https://diorama-tau.vercel.app',
  },
  {
    id: 5,
    name: 'Motion GPU Playground',
    year: '2025',
    tags: ['WebGL', 'GLSL', 'Three.js'],
    description:
      'A personal sandbox for GPU-driven motion experiments — shader effects, particle systems, and generative animation running entirely on the graphics card.',
    url: 'https://motion-gpu-playground.vercel.app',
  },
]

const EVENTS = [
  {
    id: 1,
    name: 'Global Technology Summit',
    client: 'Placeholder Client A',
    type: 'Conference',
    attendees: 14200,
    year: '2024',
    location: 'Las Vegas, NV',
    scope: ['Registration platform', 'Badge printing', 'Session management', 'Mobile app'],
  },
  {
    id: 2,
    name: 'Annual Leadership Forum',
    client: 'Placeholder Client B',
    type: 'Corporate',
    attendees: 3800,
    year: '2024',
    location: 'Chicago, IL',
    scope: ['End-to-end registration', 'Attendee communications', 'On-site check-in'],
  },
  {
    id: 3,
    name: 'National Sales Kickoff',
    client: 'Placeholder Client C',
    type: 'Internal',
    attendees: 6500,
    year: '2023',
    location: 'Orlando, FL',
    scope: ['Multi-track registration', 'Housing management', 'Real-time reporting'],
  },
  {
    id: 4,
    name: 'Healthcare Innovation Congress',
    client: 'Placeholder Client D',
    type: 'Association',
    attendees: 9100,
    year: '2023',
    location: 'Washington, D.C.',
    scope: ['Abstract management', 'CME tracking', 'Exhibitor portal', 'Mobile app'],
  },
  {
    id: 5,
    name: 'Consumer Brand Expo',
    client: 'Placeholder Client E',
    type: 'Trade Show',
    attendees: 22000,
    year: '2022',
    location: 'New York, NY',
    scope: ['Large-scale registration', 'Lead retrieval', 'Exhibitor management'],
  },
  {
    id: 6,
    name: 'Executive Retreat Series',
    client: 'Placeholder Client F',
    type: 'Corporate',
    attendees: 420,
    year: '2022',
    location: 'Napa, CA',
    scope: ['Invitation management', 'Custom registration flow', 'Concierge portal'],
  },
]

// Shared motion config
const EASE = [0.16, 1, 0.3, 1]
const fadeUp   = { hidden: { opacity: 0, y: 28 },        visible: { opacity: 1, y: 0 } }
const fadeLeft = { hidden: { opacity: 0, x: -32 },       visible: { opacity: 1, x: 0 } }
const fadeIn   = { hidden: { opacity: 0 },               visible: { opacity: 1 } }
const reveal   = { hidden: { clipPath: 'inset(0 100% 0 0)' }, visible: { clipPath: 'inset(0 0% 0 0)' } }

function Nav() {
  const { scrollY } = useScroll()

  // Gradually transition over 300–700px of scroll
  const navBg = useTransform(scrollY, [300, 700], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)'])
  const navBorder = useTransform(scrollY, [300, 700], ['rgba(229,231,235,0)', 'rgba(229,231,235,1)'])
  const logoColor = useTransform(scrollY, [300, 700], ['rgba(255,255,255,0.85)', 'rgba(10,10,10,1)'])
  const linkColor = useTransform(scrollY, [300, 700], ['rgba(255,255,255,0.5)', 'rgba(107,114,128,1)'])

  return (
    <motion.nav
      className="nav"
      style={{ background: navBg, borderBottomColor: navBorder }}
    >
      <motion.span className="nav-logo" style={{ color: logoColor }}>ZS</motion.span>
      <div className="nav-links">
        {[['About', 'about'], ['Day Job', 'work'], ['Projects', 'projects'], ['Contact', 'contact']].map(([label, id]) => (
          <motion.a key={id} href={`#${id}`} style={{ color: linkColor }}>
            {label}
          </motion.a>
        ))}
      </div>
    </motion.nav>
  )
}

function Hero() {
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 22 })

  // Wipe-dissolve: name clips from right, rest fades + rises
  const nameClipPct = useTransform(smooth, [0.02, 0.35], [0, 100])
  const nameClipPath = useTransform(nameClipPct, v => `inset(0 ${v}% 0 0)`)

  const eyebrowOpacity = useTransform(smooth, [0, 0.35], [1, 0])
  const eyebrowY = useTransform(smooth, [0, 0.35], [0, -18])

  const subOpacity = useTransform(smooth, [0.05, 0.45], [1, 0])
  const subBlurRaw = useTransform(smooth, [0.05, 0.45], [0, 12])
  const subFilter = useTransform(subBlurRaw, v => `blur(${v}px)`)
  const subY = useTransform(smooth, [0.05, 0.45], [0, -24])

  const ctaOpacity = useTransform(smooth, [0.1, 0.4], [1, 0])
  const ctaY = useTransform(smooth, [0.1, 0.4], [0, -16])

  const hintOpacity = useTransform(smooth, [0, 0.2], [1, 0])

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Grain overlay — fixed, pointer-events-none */}
      <div className="hero-grain" aria-hidden="true" />

      {/* Light streak — sweeps once on mount */}
      <motion.div
        className="hero-streak"
        aria-hidden="true"
        initial={{ x: '-30vw', opacity: 0 }}
        animate={{ x: '130vw', opacity: [0, 1, 1, 0.3, 0] }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }}
      />

      <div className="hero-inner">
        <div className="hero-text">
          {/* Eyebrow */}
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ opacity: eyebrowOpacity, y: eyebrowY }}
          >
            Product &amp; Software
          </motion.p>

          {/* Name — wipe-reveal on load, wipe-out on scroll */}
          <motion.h1
            className="hero-name"
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 1 }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            style={{ clipPath: nameClipPath }}
          >
            Zac<br />Santore.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            style={{ opacity: subOpacity, filter: subFilter, y: subY }}
          >
            I build products that are fast, focused, and worth using.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="hero-cta-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <a href="#projects" className="btn-primary">See my work</a>
            <a href="#contact" className="btn-ghost">Get in touch</a>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        className="hero-scroll-hint"
        aria-label="Scroll to about"
        style={{ opacity: hintOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="0.75" y="0.75" width="14.5" height="22.5" rx="7.25" stroke="currentColor" strokeWidth="1.5"/>
          <rect className="scroll-dot" x="7" y="5" width="2" height="5" rx="1" fill="currentColor"/>
        </svg>
      </motion.a>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about">
      <div className="section-inner about-inner">

        {/* Headshot — slides in from left */}
        <motion.div
          className="about-headshot-col"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="headshot-frame">
            <img src="/zac.jpeg" alt="Zac Santore" className="headshot-img" />
          </div>
          <div className="about-tags">
            <span className="meta-tag">Based in Longmont, CO</span>
          </div>
        </motion.div>

        {/* Bio — staggered children */}
        <motion.div
          className="about-bio-col"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.p className="section-label" variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}>About</motion.p>
          <motion.h2 className="section-heading" variants={reveal} transition={{ duration: 0.9, ease: EASE }}>
            Hi, I'm Zac.
          </motion.h2>
          <motion.div variants={fadeUp} transition={{ duration: 0.7, ease: EASE }}>
            <p className="bio-p">For the past 10+ years I've been the person making sure events run smoothly — registration systems, access control, experiential buildouts, all the behind-the-scenes stuff that makes a great experience possible.</p>
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.7, ease: EASE }}>
            <p className="bio-p">Outside of work, I'm building things with AI, shooting film and digital, and enjoying Colorado life with my little family. <span aria-label="two guys and a cat">👨‍👨‍🐱</span></p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  return (
    <motion.article
      className="project-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.07 }}
    >
      <div className="project-card-top">
        <div className="project-name-row">
          <h3 className="project-name">{project.name}</h3>
          <span className="project-year">{project.year}</span>
        </div>
        <p className="project-desc">{project.description}</p>
      </div>
      <div className="project-card-bottom">
        <div className="project-tags">
          {project.tags.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        {project.url ? (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Visit
          </a>
        ) : (
          <span className="project-wip">In progress</span>
        )}
      </div>
    </motion.article>
  )
}

function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-inner">

        {/* Header — label fades, heading wipes in */}
        <motion.div
          className="section-header"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.p className="section-label" variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}>Work</motion.p>
          <motion.h2 className="section-heading" variants={reveal} transition={{ duration: 0.9, ease: EASE }}>Selected projects.</motion.h2>
        </motion.div>

        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.08 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('sent')
  }

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact-grain" aria-hidden="true" />

      {inView && (
        <motion.div
          className="contact-streak"
          aria-hidden="true"
          initial={{ x: '-30vw', opacity: 0 }}
          animate={{ x: '130vw', opacity: [0, 1, 1, 0.3, 0] }}
          transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        />
      )}

      <div className="section-inner contact-inner">

        {/* Left col — staggered */}
        <motion.div
          className="contact-left"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p className="section-label" variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}>Contact</motion.p>
          <motion.h2 className="section-heading" variants={reveal} transition={{ duration: 0.9, ease: EASE }}>Let's talk.</motion.h2>
          <motion.p className="contact-blurb" variants={fadeUp} transition={{ duration: 0.7, ease: EASE }}>
            Have a project in mind, want to collaborate, or just want to say hello — I'd like to hear from you.
          </motion.p>
          <motion.div className="contact-links" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
            {[
              { href: 'mailto:ztsantore@gmail.com', label: 'ztsantore@gmail.com', icon: (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <rect x="0.75" y="2.75" width="13.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M0.75 4.5l6.75 4.5 6.75-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )},
              { href: 'https://github.com', label: 'GitHub', external: true, icon: (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 1.333A6.667 6.667 0 001.333 8c0 2.947 1.91 5.44 4.559 6.32.333.06.455-.145.455-.32v-1.12c-1.854.403-2.244-.895-2.244-.895-.303-.77-.74-1.975-.74-1.975-.605-.413.046-.405.046-.405.669.047 1.02.687 1.02.687.594 1.018 1.558.724 1.938.553.06-.43.232-.723.422-.889-1.48-.168-3.035-.74-3.035-3.293 0-.727.26-1.322.687-1.788-.069-.168-.298-.846.065-1.763 0 0 .56-.179 1.834.683A6.39 6.39 0 018 4.98c.567.003 1.138.077 1.671.225 1.273-.862 1.832-.683 1.832-.683.364.917.135 1.595.066 1.763.428.466.686 1.06.686 1.788 0 2.56-1.558 3.123-3.042 3.287.239.206.452.613.452 1.235v1.831c0 .177.12.383.458.318A6.669 6.669 0 0014.667 8 6.667 6.667 0 008 1.333z" fill="currentColor"/>
                </svg>
              )},
              { href: 'https://linkedin.com', label: 'LinkedIn', external: true, icon: (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="1.333" y="1.333" width="13.333" height="13.333" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 6.667V12M4 4.667v.001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 12V9.333C8 8 9.333 6.667 10.667 6.667S12 8 12 9.333V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 6.667V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )},
            ].map(({ href, label, external, icon }) => (
              <motion.a
                key={label}
                href={href}
                className="contact-link-item"
                variants={fadeLeft}
                transition={{ duration: 0.6, ease: EASE }}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {icon}{label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right col — form fades up with staggered fields */}
        <motion.div
          className="contact-right"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {status === 'sent' ? (
            <motion.div className="form-success" variants={fadeIn} transition={{ duration: 0.6, ease: EASE }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="12.25" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8.75 14l3.5 3.5 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Message received. I'll be in touch.</p>
            </motion.div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {[
                { id: 'name',    type: 'text',  label: 'Name',    placeholder: 'Your name',        autoComplete: 'name' },
                { id: 'email',   type: 'email', label: 'Email',   placeholder: 'you@example.com',  autoComplete: 'email' },
              ].map(({ id, type, label, placeholder, autoComplete }) => (
                <motion.div key={id} className="field" variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}>
                  <label htmlFor={id}>{label}</label>
                  <input id={id} name={id} type={type} autoComplete={autoComplete} required
                    value={form[id]} onChange={handleChange} placeholder={placeholder} />
                </motion.div>
              ))}
              <motion.div className="field" variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required rows={5}
                  value={form.message} onChange={handleChange} placeholder="What's on your mind?" />
              </motion.div>
              <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}>
                <button type="submit" className="btn-primary btn-full">Send message</button>
              </motion.div>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  )
}

function NineToFive() {
  return (
    <section className="ninetofive" id="work">
      <div className="section-inner">

        {/* Header */}
        <motion.div
          className="ntf-header"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p className="section-label" variants={fadeUp} transition={{ duration: 0.6, ease: EASE }}>Day job</motion.p>
          <motion.h2 className="section-heading" variants={reveal} transition={{ duration: 0.9, ease: EASE }}>
            Account Director,<br />Event Technology.
          </motion.h2>
          <motion.div className="ntf-intro" variants={fadeUp} transition={{ duration: 0.7, ease: EASE }}>
            <p>
              10+ years implementing event registration and technology platforms for large-scale conferences, trade shows, and corporate events. I manage the full client relationship — from scoping and platform configuration through on-site execution and post-event analysis.
            </p>
            <div className="ntf-stats">
              <div className="ntf-stat">
                <span className="ntf-stat-value">10+</span>
                <span className="ntf-stat-label">Years experience</span>
              </div>
              <div className="ntf-stat">
                <span className="ntf-stat-value">100+</span>
                <span className="ntf-stat-label">Events delivered</span>
              </div>
              <div className="ntf-stat">
                <span className="ntf-stat-value">500k+</span>
                <span className="ntf-stat-label">Attendees registered</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* See all events link */}
        <motion.div
          className="ntf-globe-row"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link to="/globe" className="ntf-globe-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.5"/>
              <ellipse cx="8" cy="8" rx="2.75" ry="6.75" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M1.5 6h13M1.5 10h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            See all events
          </Link>
        </motion.div>

        {/* Desktop table */}
        <motion.div
          className="ntf-table-wrap"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <table className="ntf-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Location</th>
                <th className="ntf-th-num">Attendees</th>
                <th>Scope</th>
                <th className="ntf-th-year">Year</th>
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((ev, i) => (
                <motion.tr
                  key={ev.id}
                  className="ntf-row"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                >
                  <td className="ntf-td-name">
                    <span className="ntf-event-name">{ev.name}</span>
                    <span className="ntf-client">{ev.client}</span>
                  </td>
                  <td><span className="ntf-type-tag">{ev.type}</span></td>
                  <td className="ntf-td-loc">{ev.location}</td>
                  <td className="ntf-td-num">{ev.attendees.toLocaleString()}</td>
                  <td className="ntf-td-scope">
                    <div className="ntf-scope-pills">
                      {ev.scope.map(s => <span key={s} className="ntf-pill">{s}</span>)}
                    </div>
                  </td>
                  <td className="ntf-td-year">{ev.year}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile cards */}
        <div className="ntf-cards">
          {EVENTS.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="ntf-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
            >
              <div className="ntf-card-top">
                <div>
                  <span className="ntf-event-name">{ev.name}</span>
                  <span className="ntf-client">{ev.client}</span>
                </div>
                <span className="ntf-td-year">{ev.year}</span>
              </div>
              <div className="ntf-card-meta">
                <span className="ntf-type-tag">{ev.type}</span>
                <span className="ntf-card-loc">{ev.location}</span>
                <span className="ntf-card-attendees">{ev.attendees.toLocaleString()} attendees</span>
              </div>
              <div className="ntf-scope-pills">
                {ev.scope.map(s => <span key={s} className="ntf-pill">{s}</span>)}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <span className="footer-name">Zac Santore</span>
      <span className="footer-copy">&copy; {new Date().getFullYear()}</span>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <NineToFive />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/globe" element={<GlobePage />} />
    </Routes>
  )
}
