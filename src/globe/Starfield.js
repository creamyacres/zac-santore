import * as THREE from 'three'

// Uniform random point on a sphere surface
function randomSpherePoint(radius) {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  )
}

// Gaussian spread around a point on the sphere surface
function gaussianOnSphere(center, spread, RADIUS) {
  const basisX = new THREE.Vector3(1, 0, 0)
  if (Math.abs(center.dot(basisX)) > 0.9) basisX.set(0, 1, 0)
  const bx = new THREE.Vector3().crossVectors(center, basisX).normalize()
  const by = new THREE.Vector3().crossVectors(center, bx).normalize()

  const angle = Math.random() * Math.PI * 2
  const r = spread * Math.sqrt(-2 * Math.log(Math.random() + 0.0001)) * 0.45
  const offset = new THREE.Vector3()
    .addScaledVector(bx, Math.cos(angle) * r)
    .addScaledVector(by, Math.sin(angle) * r)
  return { point: center.clone().add(offset).normalize().multiplyScalar(RADIUS), r, spread }
}

// Add a spiral galaxy blob at a given center direction
function addGalaxy(scene, center, RADIUS, { starCount = 600, spread = 22, tiltX = 0, tiltZ = 0, color = null } = {}) {
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)

  // Build local axes for the disk
  const basisX = new THREE.Vector3(1, 0, 0)
  if (Math.abs(center.dot(basisX)) > 0.9) basisX.set(0, 1, 0)
  const bx = new THREE.Vector3().crossVectors(center, basisX).normalize()
  const by = new THREE.Vector3().crossVectors(center, bx).normalize()

  for (let i = 0; i < starCount; i++) {
    // Mix gaussian core with loose spiral arms
    const armIndex = Math.floor(Math.random() * 3) // 3 arms
    const armAngle = (armIndex / 3) * Math.PI * 2
    const r = spread * Math.sqrt(-2 * Math.log(Math.random() + 0.0001)) * 0.4
    const spiralOffset = r * 0.6 // arms curl outward
    const angle = armAngle + spiralOffset * 0.15 + Math.random() * 0.8

    // Core halo: some stars just gaussian, not on arms
    const useCore = Math.random() < 0.35
    const finalAngle = useCore ? Math.random() * Math.PI * 2 : angle
    const finalR = useCore ? r * 0.5 : r

    const offset = new THREE.Vector3()
      .addScaledVector(bx, Math.cos(finalAngle) * finalR)
      .addScaledVector(by, Math.sin(finalAngle) * finalR)
    const p = center.clone().add(offset).normalize().multiplyScalar(RADIUS)

    positions[i * 3]     = p.x
    positions[i * 3 + 1] = p.y
    positions[i * 3 + 2] = p.z

    const brightness = Math.max(0.08, 0.95 - (finalR / spread) * 0.72) * (0.5 + Math.random() * 0.5)
    if (color) {
      colors[i * 3]     = brightness * color[0]
      colors[i * 3 + 1] = brightness * color[1]
      colors[i * 3 + 2] = brightness * color[2]
    } else {
      colors[i * 3]     = brightness
      colors[i * 3 + 1] = brightness
      colors[i * 3 + 2] = brightness
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
  })

  const mesh = new THREE.Points(geo, mat)
  mesh.rotation.x = tiltX
  mesh.rotation.z = tiltZ
  scene.add(mesh)
  return mesh
}

// Add a globular cluster (tight, spherical, very bright core)
function addGlobularCluster(scene, center, RADIUS, starCount = 280, spread = 10) {
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)

  const basisX = new THREE.Vector3(1, 0, 0)
  if (Math.abs(center.dot(basisX)) > 0.9) basisX.set(0, 1, 0)
  const bx = new THREE.Vector3().crossVectors(center, basisX).normalize()
  const by = new THREE.Vector3().crossVectors(center, bx).normalize()

  for (let i = 0; i < starCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = spread * Math.pow(Math.random(), 1.8) // concentrate toward center
    const offset = new THREE.Vector3()
      .addScaledVector(bx, Math.cos(angle) * r)
      .addScaledVector(by, Math.sin(angle) * r)
    const p = center.clone().add(offset).normalize().multiplyScalar(RADIUS)

    positions[i * 3]     = p.x
    positions[i * 3 + 1] = p.y
    positions[i * 3 + 2] = p.z

    const brightness = Math.max(0.3, 1.0 - (r / spread) * 0.6)
    // Globular clusters skew slightly warm/gold
    colors[i * 3]     = brightness
    colors[i * 3 + 1] = brightness * 0.92
    colors[i * 3 + 2] = brightness * 0.78
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 1.0,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
  })

  scene.add(new THREE.Points(geo, mat))
}

// Nebula haze — large diffuse cloud of dim stars
function addNebula(scene, center, RADIUS, starCount = 400, spread = 45) {
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)

  const basisX = new THREE.Vector3(1, 0, 0)
  if (Math.abs(center.dot(basisX)) > 0.9) basisX.set(0, 1, 0)
  const bx = new THREE.Vector3().crossVectors(center, basisX).normalize()
  const by = new THREE.Vector3().crossVectors(center, bx).normalize()

  for (let i = 0; i < starCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = spread * Math.random() // uniform disk
    const offset = new THREE.Vector3()
      .addScaledVector(bx, Math.cos(angle) * r)
      .addScaledVector(by, Math.sin(angle) * r)
    const p = center.clone().add(offset).normalize().multiplyScalar(RADIUS)

    positions[i * 3]     = p.x
    positions[i * 3 + 1] = p.y
    positions[i * 3 + 2] = p.z

    const brightness = 0.04 + Math.random() * 0.18
    // Slight cool-blue tint
    colors[i * 3]     = brightness * 0.7
    colors[i * 3 + 1] = brightness * 0.82
    colors[i * 3 + 2] = brightness
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
  })

  scene.add(new THREE.Points(geo, mat))
}

export function addStarfield(scene) {
  const RADIUS = 400
  const objects = [] // for tick rotation

  // ── Background stars (varied sizes) ─────────────────────────────────
  // Layer 1: dense faint field
  {
    const COUNT = 5000
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const p = randomSpherePoint(RADIUS + (Math.random() - 0.5) * 80)
      positions[i * 3]     = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z

      const brightness = 0.08 + Math.random() * 0.4
      colors[i * 3]     = brightness
      colors[i * 3 + 1] = brightness
      colors[i * 3 + 2] = brightness
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({ size: 0.7, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.7 })
    const mesh = new THREE.Points(geo, mat)
    scene.add(mesh)
    objects.push({ mesh, speedY: 0.000025 })
  }

  // Layer 2: brighter mid-field stars with color variety
  {
    const COUNT = 2500
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const p = randomSpherePoint(RADIUS + (Math.random() - 0.5) * 50)
      positions[i * 3]     = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z

      const brightness = 0.35 + Math.random() * 0.65
      const tint = Math.random()
      if (tint > 0.94) {
        // Blue-white (hot star)
        colors[i * 3]     = brightness * 0.82
        colors[i * 3 + 1] = brightness * 0.90
        colors[i * 3 + 2] = brightness
      } else if (tint > 0.88) {
        // Orange-red (cool giant)
        colors[i * 3]     = brightness
        colors[i * 3 + 1] = brightness * 0.65
        colors[i * 3 + 2] = brightness * 0.45
      } else if (tint > 0.82) {
        // Warm yellow
        colors[i * 3]     = brightness
        colors[i * 3 + 1] = brightness * 0.88
        colors[i * 3 + 2] = brightness * 0.65
      } else {
        colors[i * 3]     = brightness
        colors[i * 3 + 1] = brightness
        colors[i * 3 + 2] = brightness
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.9 })
    const mesh = new THREE.Points(geo, mat)
    scene.add(mesh)
    objects.push({ mesh, speedY: 0.00003 })
  }

  // Layer 3: handful of very bright foreground stars
  {
    const COUNT = 120
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const p = randomSpherePoint(RADIUS - 20 + Math.random() * 30)
      positions[i * 3]     = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z

      const tint = Math.random()
      if (tint > 0.6) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.8
      } else {
        colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 1.0
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({ size: 2.8, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 1.0 })
    const mesh = new THREE.Points(geo, mat)
    scene.add(mesh)
    objects.push({ mesh, speedY: 0.000015 })
  }

  // ── Milky Way band ───────────────────────────────────────────────────
  {
    const COUNT = 3500
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const lon = Math.random() * Math.PI * 2
      // Two gaussian layers: thin bright core + wider diffuse halo
      const useCore = Math.random() < 0.4
      const spread = useCore ? 0.18 : 0.55
      const lat = (Math.random() + Math.random() + Math.random() - 1.5) * spread
      const r = RADIUS + (Math.random() - 0.5) * 50

      positions[i * 3]     = r * Math.cos(lat) * Math.cos(lon)
      positions[i * 3 + 1] = r * Math.sin(lat)
      positions[i * 3 + 2] = r * Math.cos(lat) * Math.sin(lon)

      const brightness = useCore
        ? 0.15 + Math.random() * 0.55
        : 0.04 + Math.random() * 0.22
      // Very subtle warm tint in core
      colors[i * 3]     = brightness * (useCore ? 1.0 : 0.9)
      colors[i * 3 + 1] = brightness * (useCore ? 0.95 : 0.92)
      colors[i * 3 + 2] = brightness * (useCore ? 0.82 : 0.98)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({ size: 0.85, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.7 })
    const band = new THREE.Points(geo, mat)
    band.rotation.x = Math.PI * 0.32
    band.rotation.z = Math.PI * 0.15
    scene.add(band)
    objects.push({ mesh: band, speedY: 0.00002 })
  }

  // ── Spiral galaxies (4 spread around the sky) ────────────────────────
  const galaxyConfigs = [
    { color: [1.0, 0.88, 0.70], spread: 28, starCount: 700, tiltX: 0.4, tiltZ: 0.2 },   // warm barred spiral
    { color: [0.78, 0.88, 1.0],  spread: 20, starCount: 500, tiltX: -0.3, tiltZ: 0.5 },  // cool blue edge-on
    { color: [1.0, 0.95, 0.88], spread: 24, starCount: 600, tiltX: 0.6, tiltZ: -0.4 },   // neutral face-on
    { color: [0.90, 0.78, 1.0],  spread: 16, starCount: 380, tiltX: -0.5, tiltZ: 0.3 },  // purple dwarf
  ]

  galaxyConfigs.forEach((cfg) => {
    const center = randomSpherePoint(RADIUS).normalize().multiplyScalar(RADIUS)
    const mesh = addGalaxy(scene, center, RADIUS, cfg)
    objects.push({ mesh, speedY: 0.000018 })
  })

  // ── Globular clusters (3 tight spherical star balls) ─────────────────
  for (let i = 0; i < 3; i++) {
    const center = randomSpherePoint(RADIUS).normalize().multiplyScalar(RADIUS)
    addGlobularCluster(scene, center, RADIUS, 300 + Math.floor(Math.random() * 150), 8 + Math.random() * 10)
  }

  // ── Nebula hazes (2 large diffuse regions) ────────────────────────────
  for (let i = 0; i < 2; i++) {
    const center = randomSpherePoint(RADIUS).normalize().multiplyScalar(RADIUS)
    addNebula(scene, center, RADIUS, 500, 40 + Math.random() * 20)
  }

  // Tick — drift each layer at slightly different speeds for parallax feel
  return function tickStars() {
    objects.forEach(({ mesh, speedY }) => {
      mesh.rotation.y += speedY
    })
  }
}
