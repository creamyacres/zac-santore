import * as THREE from 'three'

// Random point on a sphere surface (uniform distribution)
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

// Random point in a cone direction — for galaxy clusters
function randomConePoint(center, spread, count, positions, brightnesses, i) {
  const basisX = new THREE.Vector3().crossVectors(center, THREE.Object3D.DEFAULT_UP).normalize()
  const basisY = new THREE.Vector3().crossVectors(center, basisX).normalize()

  for (let j = 0; j < count; j++) {
    const angle = Math.random() * Math.PI * 2
    // Gaussian-ish distribution via Box-Muller
    const r = spread * Math.sqrt(-2 * Math.log(Math.random() + 0.0001)) * 0.5
    const offset = new THREE.Vector3()
      .addScaledVector(basisX, Math.cos(angle) * r)
      .addScaledVector(basisY, Math.sin(angle) * r)
    const p = center.clone().add(offset).normalize().multiplyScalar(center.length())
    positions[i * 3 + j * 3 + 0] = p.x
    positions[i * 3 + j * 3 + 1] = p.y
    positions[i * 3 + j * 3 + 2] = p.z
    // Galaxy stars: mostly dim with a bright core falloff
    brightnesses[i + j] = Math.max(0.15, 1.0 - (r / spread) * 0.8) * (0.4 + Math.random() * 0.6)
  }
}

export function addStarfield(scene) {
  const STAR_COUNT = 4000
  const GALAXY_STARS = 800
  const RADIUS = 400  // Large sphere around the scene

  // ── Background stars ──────────────────────────────────────────────
  const starPositions = new Float32Array(STAR_COUNT * 3)
  const starColors = new Float32Array(STAR_COUNT * 3)

  for (let i = 0; i < STAR_COUNT; i++) {
    const p = randomSpherePoint(RADIUS + (Math.random() - 0.5) * 60)
    starPositions[i * 3]     = p.x
    starPositions[i * 3 + 1] = p.y
    starPositions[i * 3 + 2] = p.z

    // Brightness varies — maps to different dither levels
    const brightness = 0.2 + Math.random() * 0.8
    // Slight warm/cool tint on a few stars — still dithers to mono
    const tint = Math.random()
    if (tint > 0.95) {
      // Blue-white
      starColors[i * 3]     = brightness * 0.85
      starColors[i * 3 + 1] = brightness * 0.90
      starColors[i * 3 + 2] = brightness
    } else if (tint > 0.90) {
      // Warm
      starColors[i * 3]     = brightness
      starColors[i * 3 + 1] = brightness * 0.88
      starColors[i * 3 + 2] = brightness * 0.75
    } else {
      starColors[i * 3]     = brightness
      starColors[i * 3 + 1] = brightness
      starColors[i * 3 + 2] = brightness
    }
  }

  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

  const starMat = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
  })

  const stars = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  // ── Galaxy band (Milky Way-ish arc) ────────────────────────────────
  const BAND_COUNT = 2200
  const bandPositions = new Float32Array(BAND_COUNT * 3)
  const bandColors = new Float32Array(BAND_COUNT * 3)

  for (let i = 0; i < BAND_COUNT; i++) {
    // Concentrate points around the equatorial band with gaussian spread
    const lon = Math.random() * Math.PI * 2
    const lat = (Math.random() + Math.random() + Math.random() - 1.5) * 0.35 // ~gaussian, narrow band
    const r = RADIUS + (Math.random() - 0.5) * 40

    bandPositions[i * 3]     = r * Math.cos(lat) * Math.cos(lon)
    bandPositions[i * 3 + 1] = r * Math.sin(lat)
    bandPositions[i * 3 + 2] = r * Math.cos(lat) * Math.sin(lon)

    const brightness = 0.08 + Math.random() * 0.45
    bandColors[i * 3]     = brightness
    bandColors[i * 3 + 1] = brightness
    bandColors[i * 3 + 2] = brightness
  }

  const bandGeo = new THREE.BufferGeometry()
  bandGeo.setAttribute('position', new THREE.BufferAttribute(bandPositions, 3))
  bandGeo.setAttribute('color', new THREE.BufferAttribute(bandColors, 3))

  const bandMat = new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.65,
  })

  const band = new THREE.Points(bandGeo, bandMat)
  // Tilt the band ~60° to look like a proper galaxy plane
  band.rotation.x = Math.PI * 0.32
  band.rotation.z = Math.PI * 0.15
  scene.add(band)

  // ── Galaxy cluster blobs (2 dense regions) ─────────────────────────
  const clusterCenters = [
    randomSpherePoint(RADIUS).normalize().multiplyScalar(RADIUS),
    randomSpherePoint(RADIUS).normalize().multiplyScalar(RADIUS),
  ]

  clusterCenters.forEach((center) => {
    const COUNT = 350
    const clusterPos = new Float32Array(COUNT * 3)
    const clusterCol = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      const basisX = new THREE.Vector3(1, 0, 0)
      if (Math.abs(center.dot(basisX)) > 0.9) basisX.set(0, 1, 0)
      const bx = new THREE.Vector3().crossVectors(center, basisX).normalize()
      const by = new THREE.Vector3().crossVectors(center, bx).normalize()

      const angle = Math.random() * Math.PI * 2
      const r = 18 * Math.sqrt(-2 * Math.log(Math.random() + 0.0001)) * 0.4
      const offset = new THREE.Vector3()
        .addScaledVector(bx, Math.cos(angle) * r)
        .addScaledVector(by, Math.sin(angle) * r)
      const p = center.clone().add(offset).normalize().multiplyScalar(RADIUS)

      clusterPos[i * 3]     = p.x
      clusterPos[i * 3 + 1] = p.y
      clusterPos[i * 3 + 2] = p.z

      const brightness = Math.max(0.1, 0.9 - (r / 18) * 0.7)
      clusterCol[i * 3]     = brightness
      clusterCol[i * 3 + 1] = brightness
      clusterCol[i * 3 + 2] = brightness
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(clusterPos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(clusterCol, 3))

    const mat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    })

    scene.add(new THREE.Points(geo, mat))
  })

  // Return slow rotation update — call each frame
  return function tickStars(delta) {
    stars.rotation.y += 0.00003
    band.rotation.y  += 0.00002
  }
}
