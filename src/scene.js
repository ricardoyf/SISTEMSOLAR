import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// An illustrative, deliberately compressed map. The scientific comparison views
// in the application use physical values; these radii and distances only improve
// legibility. Angles are reproducible, not ephemerides for the current date.
const VISUAL = {
  sun: { radius: 9, distance: 0, phase: 0 },
  mercury: { radius: 1.05, distance: 23, phase: 0.1 },
  venus: { radius: 1.65, distance: 33, phase: 2.4 },
  earth: { radius: 1.85, distance: 45, phase: 4.8 },
  moon: { radius: 0.52, distance: 5.5, phase: 0.8 },
  mars: { radius: 1.35, distance: 59, phase: 0.85 },
  jupiter: { radius: 6.2, distance: 84, phase: 2.8 },
  saturn: { radius: 5.2, distance: 113, phase: 5.8 },
  uranus: { radius: 3.6, distance: 142, phase: 4.0 },
  neptune: { radius: 3.45, distance: 173, phase: 0.6 },
};
const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

function seededRandom(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w = 768, h = 384) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No se puede crear la textura de los planetas.');
  return { canvas, ctx: context, w, h };
}

function globeTexture(id, baseColor) {
  const { canvas, ctx, w, h } = makeCanvas(id === 'earth' ? 1024 : 768, id === 'earth' ? 512 : 384);
  const rng = seededRandom([...id].reduce((a, b) => a + b.charCodeAt(0), 180));
  ctx.fillStyle = baseColor || '#8c9aa7';
  ctx.fillRect(0, 0, w, h);

  if (id === 'earth') {
    const sea = ctx.createLinearGradient(0, 0, 0, h);
    sea.addColorStop(0, '#357792');
    sea.addColorStop(0.48, '#19658a');
    sea.addColorStop(1, '#2a7392');
    ctx.fillStyle = sea;
    ctx.fillRect(0, 0, w, h);
    // Recognisable, hand-drawn continental silhouettes: an illustration, not a
    // photographic map or a representation of political boundaries.
    const land = [
      [[-168,66],[-151,70],[-134,69],[-125,73],[-109,73],[-94,72],[-81,64],[-62,60],[-56,50],[-65,44],[-74,42],[-81,25],[-88,21],[-96,17],[-103,20],[-111,30],[-118,34],[-124,42],[-128,50],[-141,58],[-160,58]],
      [[-81,12],[-70,12],[-61,8],[-52,5],[-36,-5],[-40,-21],[-48,-28],[-54,-39],[-66,-55],[-74,-50],[-74,-30],[-79,-10]],
      [[-53,59],[-42,61],[-22,72],[-20,82],[-46,83],[-60,77]],
      [[-10,36],[-9,44],[0,45],[3,50],[10,54],[5,59],[16,70],[29,71],[32,61],[40,65],[57,68],[74,72],[104,76],[129,71],[150,64],[174,64],[179,51],[156,54],[144,46],[135,35],[122,24],[110,20],[106,9],[99,8],[94,19],[88,22],[81,8],[75,9],[68,24],[59,25],[49,30],[43,13],[34,12],[35,31],[28,40],[18,40],[15,37],[9,43],[3,41]],
      [[-17,21],[-7,32],[8,36],[23,33],[33,31],[35,19],[43,12],[51,11],[44,-10],[36,-18],[30,-30],[18,-35],[11,-22],[12,-5],[4,4],[-8,5],[-17,14]],
      [[113,-22],[123,-13],[134,-12],[137,-17],[145,-13],[153,-26],[147,-39],[131,-32],[115,-35]],
      [[96,5],[106,-7],[116,-8],[120,-5],[112,0],[104,1]],
      [[130,-3],[142,-3],[150,-9],[140,-9]],
      [[47,-13],[50,-16],[47,-25],[44,-24]],
      [[166,-34],[177,-38],[172,-45],[165,-47],[169,-40]],
      [[-180,-73],[-140,-71],[-105,-75],[-75,-66],[-60,-72],[-20,-73],[10,-70],[50,-67],[85,-67],[120,-66],[155,-69],[180,-73],[180,-90],[-180,-90]],
    ];
    land.forEach((poly, i) => {
      ctx.beginPath();
      poly.forEach(([lon, lat], j) => {
        const x = ((lon + 180) / 360) * w;
        const y = ((90 - lat) / 180) * h;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = i === 2 || i === 10 ? '#e1e9df' : ['#76936c', '#648465', '#d8e3d9', '#9b9d78', '#bfa77a'][i % 5];
      ctx.fill();
      ctx.strokeStyle = 'rgba(159,188,135,0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    // Soft clouds, including a few spiral systems.
    for (let i = 0; i < 135; i++) {
      const x = rng() * w, y = h * (0.12 + rng() * 0.76);
      ctx.beginPath();
      ctx.ellipse(x, y, 7 + rng() * 43, 1.1 + rng() * 3.5, -0.3 + rng() * 0.6, 0, TAU);
      ctx.fillStyle = `rgba(248,253,255,${0.1 + rng() * 0.35})`;
      ctx.fill();
    }
  } else if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(id)) {
    const palettes = {
      jupiter: ['#d6bb98', '#9e7357', '#efddba', '#be9475', '#e0c8a8', '#8e6252'],
      saturn: ['#d7c29a', '#ead8b0', '#baa887', '#d7c29a', '#bda888'],
      uranus: ['#b5d8d5', '#acd4d2', '#bbdedb', '#a5cecf'],
      neptune: ['#6298ae', '#5791a6', '#6ba4b8', '#639ab0'],
    };
    const colors = palettes[id];
    const count = id === 'jupiter' || id === 'saturn' ? 43 : 70;
    for (let i = 0; i < count; i++) {
      const y = (i / count) * h;
      const height = h / count + 2;
      ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const wobble = Math.sin(x / 62 + i * 0.42) * (id === 'jupiter' ? 3 : 1.2);
        if (x === 0) ctx.moveTo(x, y + wobble); else ctx.lineTo(x, y + wobble);
      }
      ctx.lineTo(w, y + height); ctx.lineTo(0, y + height); ctx.closePath(); ctx.fill();
    }
    if (id === 'jupiter') {
      for (let k = 8; k > 0; k--) {
        ctx.beginPath();
        ctx.ellipse(w * 0.66, h * 0.62, k * 5.8, k * 2.65, -0.08, 0, TAU);
        ctx.fillStyle = ['#d4ad8a', '#b67a61', '#c58968', '#a66655'][k % 4];
        ctx.fill();
      }
    }
  } else if (id === 'sun') {
    ctx.fillStyle = '#ffbb47';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 10000; i++) {
      const x = rng() * w, y = rng() * h, size = 0.5 + rng() * 3.2;
      ctx.fillStyle = rng() > 0.5 ? 'rgba(255,234,133,0.22)' : 'rgba(232,99,22,0.19)';
      ctx.fillRect(x, y, size * 2, size);
    }
  } else if (id === 'venus') {
    ctx.fillStyle = '#d2b17b';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 110; i++) {
      ctx.beginPath();
      const y = rng() * h;
      for (let x = -20; x <= w + 20; x += 12) {
        const yy = y + Math.sin(x / 180 + y / 80) * 30;
        if (x < 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = rng() > 0.5 ? 'rgba(247,228,178,0.16)' : 'rgba(168,126,83,0.12)';
      ctx.lineWidth = 2 + rng() * 13;
      ctx.stroke();
    }
  } else {
    for (let i = 0; i < 750; i++) {
      const x = rng() * w, y = rng() * h;
      const radius = (id === 'mars' ? 3 : 1.5) + rng() * (id === 'mars' ? 24 : 14);
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 1.3, radius * 0.7, rng(), 0, TAU);
      ctx.fillStyle = id === 'mars' ? (rng() > 0.55 ? 'rgba(114,66,47,0.13)' : 'rgba(224,149,107,0.11)') : 'rgba(33,36,43,0.10)';
      ctx.fill();
      if (id !== 'mars') {
        ctx.strokeStyle = 'rgba(220,218,205,0.13)';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
    }
    if (id === 'mars') {
      ctx.fillStyle = '#dbd5c7';
      ctx.fillRect(0, 0, w, h * 0.04);
      ctx.fillRect(0, h * 0.97, w, h * 0.03);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeGlow() {
  const { canvas, ctx, w, h } = makeCanvas(128, 128);
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  grad.addColorStop(0, 'rgba(255,216,129,1)');
  grad.addColorStop(0.28, 'rgba(255,185,74,0.55)');
  grad.addColorStop(0.52, 'rgba(249,134,44,0.12)');
  grad.addColorStop(1, 'rgba(249,134,44,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  return new THREE.CanvasTexture(canvas);
}

function addSaturnRings(parent, radius, resources) {
  const geo = new THREE.RingGeometry(radius * 1.35, radius * 2.25, 112, 1);
  const pos = geo.attributes.position;
  const colors = [];
  const rng = seededRandom(75);
  for (let i = 0; i < pos.count; i++) {
    const c = new THREE.Color('#ccba96').multiplyScalar(0.86 + rng() * 0.14);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.MeshStandardMaterial({ color: '#ddcbaa', vertexColors: true, side: THREE.DoubleSide, roughness: 1, transparent: true, opacity: 0.88 });
  const ring = new THREE.Mesh(geo, material);
  ring.rotation.x = -Math.PI / 2;
  parent.add(ring);
  resources.push(geo, material);
  // Narrow radial bands and the Cassini division, simplified to remain visible.
  [[1.36, 1.43, 0.45], [1.68, 1.77, 0.18], [1.91, 1.96, 0.9], [2.11, 2.15, 0.25]].forEach(([a, b, opacity]) => {
    const g = new THREE.RingGeometry(radius * a, radius * b, 112);
    const m = new THREE.MeshBasicMaterial({ color: '#182125', side: THREE.DoubleSide, transparent: true, opacity, depthWrite: false });
    const band = new THREE.Mesh(g, m);
    band.rotation.x = -Math.PI / 2;
    band.position.y = 0.018;
    parent.add(band);
    resources.push(g, m);
  });
}

/**
 * Builds the independent, responsive 3D layer. All time is expressed in Earth
 * days. The Moon's orbital parent is the Earth's translating group, never its
 * spinning mesh. An actual sidereal day controls rotation; at high time speeds
 * the apparent spin may alias, just as in any discretely sampled animation.
 */
export function createSolarScene({ container, bodies = [], onSelect = () => {}, onTick = () => {}, onReady = () => {}, onError = () => {} } = {}) {
  let days = 0, paused = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let speed = 12, selectedId = null, view = 'perspective', showLabels = true, showOrbits = true;
  let destroyed = false, frame = 0, lastTime = 0, lastTick = 0;
  const getState = () => ({ days, paused, selectedId, speed, view, showLabels, showOrbits });
  const noop = () => {};
  const fallback = { select: noop, setPaused: noop, setSpeed: noop, setView: noop, reset: noop, setLabels: noop, setOrbits: noop, zoom: noop, resize: noop, destroy: noop, getState };
  if (!container) { onError(new Error('Falta el contenedor del mapa.')); return fallback; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (error) {
    onError(error);
    return fallback;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x060e19, 0);
  renderer.domElement.setAttribute('aria-label', 'Modelo tridimensional del sistema solar. Arrastra para girar y usa dos dedos o la rueda para acercarte. También puedes elegir los cuerpos en la lista.');
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none;';
  renderer.domElement.tabIndex = -1;
  container.appendChild(renderer.domElement);

  const style = document.createElement('style');
  style.textContent = `.solar-scene-layer{position:absolute;inset:0;overflow:hidden;pointer-events:none}.solar-label{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:5px;min-height:32px;padding:4px 7px;border:1px solid transparent;border-radius:8px;background:rgba(5,14,24,.48);color:#c7d4df;font:inherit;font-size:11px;font-weight:500;line-height:1.2;letter-spacing:.02em;white-space:nowrap;pointer-events:auto;cursor:pointer;transform:translate(-50%,-50%);backdrop-filter:blur(3px);text-shadow:0 1px 5px #000}.solar-label[hidden]{display:none}.solar-label:hover,.solar-label:focus-visible,.solar-label[aria-pressed=true]{color:#e1fff0;border-color:rgba(163,231,190,.48);background:rgba(13,35,40,.88);outline:none}.solar-label::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--body-color,#b7d7ce)}@media(max-width:600px){.solar-label{font-size:10px;min-height:30px;padding:3px 5px}}`;
  container.appendChild(style);
  const layer = document.createElement('div');
  layer.className = 'solar-scene-layer';
  container.appendChild(layer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.08, 2200);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.minDistance = 2.5;
  controls.maxDistance = 950;
  controls.maxPolarAngle = Math.PI * 0.96;
  controls.rotateSpeed = 0.62;
  controls.zoomSpeed = 0.9;

  const ambient = new THREE.AmbientLight('#d9e9f4', 0.72);
  scene.add(ambient);
  // Constant attenuation is an illustrative lighting choice: the same daylight
  // remains visible on distant planets, while light still arrives from the Sun.
  const solarLight = new THREE.PointLight('#fff2db', 2.8, 0, 0);
  scene.add(solarLight);
  const resources = [];

  const starRng = seededRandom(1197);
  const starPositions = [], starColors = [];
  for (let i = 0; i < 1000; i++) {
    const u = starRng() * 2 - 1, phi = starRng() * TAU, r = 650 + starRng() * 300;
    const radial = Math.sqrt(1 - u * u);
    starPositions.push(Math.cos(phi) * radial * r, u * r, Math.sin(phi) * radial * r);
    const value = 0.3 + starRng() * 0.55;
    starColors.push(value * 0.88, value * 0.94, value);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
  const starMaterial = new THREE.PointsMaterial({ size: 1.35, vertexColors: true, transparent: true, opacity: 0.72, sizeAttenuation: false, depthWrite: false });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  resources.push(starGeometry, starMaterial);

  const items = new Map();
  const clickable = [];
  const orbits = new THREE.Group();
  scene.add(orbits);
  const defaultColors = { sun: '#ffb343', mercury: '#9d9589', venus: '#d4b783', earth: '#4c9cb4', moon: '#a6aaa7', mars: '#b77655', jupiter: '#cfb28b', saturn: '#d7c49b', uranus: '#afd8d6', neptune: '#689bae' };

  function addOrbit(radius, parent = orbits, moon = false) {
    const pts = [];
    for (let i = 0; i < 160; i++) {
      const a = i / 160 * TAU;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({ color: moon ? '#8da6a4' : '#8ba9bb', transparent: true, opacity: moon ? 0.22 : 0.18, depthWrite: false });
    const line = new THREE.LineLoop(g, m);
    parent.add(line);
    resources.push(g, m);
    return line;
  }

  for (const body of bodies) {
    const visual = VISUAL[body.id];
    if (!visual) continue;
    const group = new THREE.Group();
    group.name = body.id;
    const axis = new THREE.Group();
    // Retrograde rotation is encoded by signed rotationHours. For Uranus its
    // 97.8° obliquity already reverses the spin axis, so avoid reversing twice.
    // Lunar obliquity and libration are omitted together with its orbital
    // inclination in this coplanar illustration, keeping tidal locking exact.
    axis.rotation.z = body.id === 'moon' ? 0 : THREE.MathUtils.degToRad(body.tiltDeg || 0);
    group.add(axis);
    const geometry = new THREE.SphereGeometry(visual.radius, body.id === 'sun' ? 48 : 40, 28);
    let texture = null;
    try { texture = globeTexture(body.id, defaultColors[body.id] || body.color); resources.push(texture); } catch (_) { /* Base colour remains usable without Canvas2D. */ }
    const material = body.id === 'sun'
      ? new THREE.MeshBasicMaterial({ map: texture, color: texture ? '#ffffff' : defaultColors.sun, toneMapped: false })
      : new THREE.MeshStandardMaterial({ map: texture, color: texture ? '#ffffff' : (defaultColors[body.id] || body.color), roughness: 1, metalness: 0 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.bodyId = body.id;
    axis.add(mesh);
    clickable.push(mesh);
    resources.push(geometry, material);
    if (body.id === 'saturn') addSaturnRings(axis, visual.radius, resources);
    if (body.id === 'sun') {
      try {
        const map = makeGlow();
        const glowMaterial = new THREE.SpriteMaterial({ map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.62 });
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.setScalar(visual.radius * 6);
        group.add(glow);
        resources.push(map, glowMaterial);
      } catch (_) { /* Sun itself is still visible. */ }
    }
    if (body.id === 'earth') {
      const g = new THREE.SphereGeometry(visual.radius * 1.055, 32, 24);
      const m = new THREE.MeshBasicMaterial({ color: '#6db9d4', side: THREE.BackSide, transparent: true, opacity: 0.18, depthWrite: false });
      axis.add(new THREE.Mesh(g, m));
      resources.push(g, m);
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'solar-label';
    button.textContent = body.name;
    button.setAttribute('aria-label', `Explorar ${body.name}`);
    button.setAttribute('aria-pressed', 'false');
    button.style.setProperty('--body-color', body.color || defaultColors[body.id]);
    button.addEventListener('click', () => { if (!destroyed) { select(body.id); onSelect(body.id); } });
    layer.appendChild(button);
    const item = { body, visual, group, axis, mesh, button, world: new THREE.Vector3(), orbit: null };
    items.set(body.id, item);
    scene.add(group);
    if (body.id !== 'sun' && body.id !== 'moon') item.orbit = addOrbit(visual.distance);
  }

  const moon = items.get('moon');
  const earth = items.get('earth');
  if (moon && earth) {
    // This group moves with Earth but is completely independent of Earth spin.
    earth.group.add(moon.group);
    moon.orbit = addOrbit(moon.visual.distance, earth.group, true);
  }

  let width = 1, height = 1;
  let transition = null;
  let previousFollow = null;
  const aim = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const cameraOffset = new THREE.Vector3();
  const deltaFollow = new THREE.Vector3();
  const objectPosition = new THREE.Vector3();
  const viewDirection = new THREE.Vector3();
  const down = new THREE.Vector2();
  let pointerDown = false, pointerDragged = false, pointerId = null;

  function positionBodies() {
    items.forEach((item, id) => {
      const { body, visual, group, mesh } = item;
      if (id !== 'sun') {
        const orbitalPeriod = id === 'moon' ? 27.321661 : Number(body.orbitDays);
        const angle = visual.phase + TAU * (days % orbitalPeriod) / orbitalPeriod;
        group.position.set(Math.cos(angle) * visual.distance, 0, -Math.sin(angle) * visual.distance);
      }
      const rotHours = Number(body.rotationHours) || (id === 'sun' ? 609.12 : 24);
      const periodDays = Math.abs(rotHours) / 24;
      // A >90° axial tilt already gives the retrograde angular momentum.
      const sign = Number(body.tiltDeg) > 90 ? 1 : Math.sign(rotHours);
      mesh.rotation.y = TAU * (days % periodDays) / periodDays * sign + (id === 'earth' ? 2.3 : 0.2);
      if (id === 'moon') {
        // The Moon's sidereal spin matches its orbital period. A fixed texture
        // longitude therefore faces Earth throughout the circular model.
        mesh.rotation.y = visual.phase + TAU * (days % 27.321661) / 27.321661;
      }
    });
    scene.updateMatrixWorld(true);
  }

  function generalPosition() {
    const aspect = Math.max(0.5, width / height);
    const distance = Math.max(340, 193 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(aspect, 1.45)));
    return view === 'top' ? new THREE.Vector3(0, distance, 0.01) : new THREE.Vector3(0, distance * 0.61, distance * 0.793);
  }

  function goTo(position, target, duration = 0.7) {
    transition = {
      elapsed: 0, duration,
      startPosition: camera.position.clone(), startTarget: controls.target.clone(),
      endPosition: position.clone(), endTarget: target.clone(),
    };
    controls.enabled = false;
  }

  function select(id) {
    if (destroyed) return;
    if (id === null) {
      selectedId = null;
      previousFollow = null;
      items.forEach(p => p.button.setAttribute('aria-pressed', 'false'));
      goTo(generalPosition(), new THREE.Vector3(0, 0, 0));
      emitTick();
      return;
    }
    if (!items.has(id)) return;
    selectedId = id;
    const item = items.get(id);
    item.group.getWorldPosition(aim);
    const r = item.visual.radius * (id === 'saturn' ? 2.15 : 1);
    const distance = Math.max(8, r * 5.3 / Math.min(1, width / height));
    const offset = view === 'top' ? new THREE.Vector3(0, distance, 0.01) : new THREE.Vector3(distance * 0.38, distance * 0.3, distance * 0.86);
    goTo(aim.clone().add(offset), aim);
    previousFollow = aim.clone();
    items.forEach((p, bodyId) => p.button.setAttribute('aria-pressed', String(bodyId === id)));
    emitTick();
  }

  function reset() {
    if (destroyed) return;
    days = 0;
    lastTime = 0;
    positionBodies();
    select(null);
  }

  function setView(next) {
    view = next === 'top' ? 'top' : 'perspective';
    camera.up.set(0, 1, 0);
    if (selectedId) select(selectedId); else goTo(generalPosition(), new THREE.Vector3(0, 0, 0));
  }

  function setPaused(next) { paused = Boolean(next); emitTick(); }
  function setSpeed(next) { if (Number.isFinite(Number(next))) speed = clamp(Number(next), 0.01, 365); emitTick(); }
  function setLabels(next) { showLabels = Boolean(next); layer.style.visibility = showLabels ? 'visible' : 'hidden'; }
  function setOrbits(next) {
    showOrbits = Boolean(next);
    orbits.visible = showOrbits;
    if (moon?.orbit) moon.orbit.visible = showOrbits;
  }
  function zoom(factor) {
    if (!Number.isFinite(factor) || factor <= 0) return;
    transition = null;
    controls.enabled = true;
    cameraOffset.copy(camera.position).sub(controls.target);
    cameraOffset.setLength(clamp(cameraOffset.length() * factor, controls.minDistance, controls.maxDistance));
    camera.position.copy(controls.target).add(cameraOffset);
    controls.update();
  }
  function emitTick() { onTick({ days, paused, selectedId }); }

  function updateLabels() {
    if (!showLabels) return;
    const occupied = [];
    // Selected body wins collision priority, followed by the Sun and planets.
    const labelPriority = item => item.body.id === selectedId ? 0 : item.body.id === 'sun' ? 1 : item.body.id === 'moon' ? 3 : 2;
    const sorted = [...items.values()].sort((a, b) => labelPriority(a) - labelPriority(b) || a.visual.distance - b.visual.distance);
    sorted.forEach(item => {
      item.group.getWorldPosition(item.world);
      projected.copy(item.world).project(camera);
      camera.getWorldDirection(viewDirection);
      objectPosition.copy(item.world).sub(camera.position);
      if (projected.z > 1 || projected.z < -1 || objectPosition.dot(viewDirection) < 0 || Math.abs(projected.x) > 1.15 || Math.abs(projected.y) > 1.15) {
        item.button.hidden = true; return;
      }
      const cameraDistance = Math.max(1, camera.position.distanceTo(item.world));
      const screenRadius = item.visual.radius / cameraDistance * height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      let x = (projected.x + 1) * width / 2;
      let y = (-projected.y + 1) * height / 2 + Math.min(screenRadius, height * 0.26) + 18;
      const labelWidth = item.body.name.length * (width < 600 ? 5.8 : 6.5) + 26;
      x = clamp(x, labelWidth / 2 + 5, width - labelWidth / 2 - 5);
      for (let i = 0; i < 3; i++) {
        if (occupied.some(p => Math.abs(x - p.x) < (labelWidth + p.w) / 2 && Math.abs(y - p.y) < 29)) y += 29;
      }
      if (y > height - 15) { item.button.hidden = true; return; }
      // The Moon would otherwise clutter the Earth label at system scale.
      if (item.body.id === 'moon' && selectedId !== 'moon' && selectedId !== 'earth' && screenRadius < 2.2) { item.button.hidden = true; return; }
      item.button.hidden = false;
      item.button.style.left = `${x}px`;
      item.button.style.top = `${y}px`;
      occupied.push({ x, y, w: labelWidth });
    });
  }

  function resize() {
    if (destroyed) return;
    const rect = container.getBoundingClientRect();
    const nextWidth = Math.max(1, rect.width), nextHeight = Math.max(1, rect.height);
    const sizeChanged = Math.abs(width - nextWidth) > 2 || Math.abs(height - nextHeight) > 2;
    width = nextWidth; height = nextHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (sizeChanged && !selectedId) {
      transition = null;
      controls.enabled = true;
      camera.position.copy(generalPosition());
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }

  function onPointerDown(event) {
    if (event.button !== 0 && event.pointerType !== 'touch') return;
    if (pointerDown) { pointerDragged = true; return; }
    pointerDown = true; pointerDragged = false; pointerId = event.pointerId;
    down.set(event.clientX, event.clientY);
    if (transition) { transition = null; controls.enabled = true; }
  }
  function onPointerMove(event) {
    if (pointerDown && (event.pointerId !== pointerId || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7)) pointerDragged = true;
  }
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function onPointerUp(event) {
    if (!pointerDown || event.pointerId !== pointerId) return;
    pointerDown = false;
    if (pointerDragged || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickable, false);
    if (hits.length) { const id = hits[0].object.userData.bodyId; select(id); onSelect(id); }
  }
  function onPointerCancel() { pointerDown = false; pointerDragged = false; pointerId = null; }
  function onVisibility() { lastTime = 0; }
  function onContextLost(event) { event.preventDefault(); paused = true; onError(new Error('El navegador ha perdido la conexión gráfica. Recarga la página para recuperar el mapa 3D.')); }
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerCancel);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  document.addEventListener('visibilitychange', onVisibility);
  const observer = new ResizeObserver(resize);
  observer.observe(container);

  function animate(now) {
    if (destroyed) return;
    frame = requestAnimationFrame(animate);
    if (document.hidden || width < 2 || height < 2) { lastTime = 0; return; }
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.25) : 0;
    lastTime = now;
    if (!paused) days += dt * speed;
    positionBodies();
    if (selectedId && items.has(selectedId)) {
      const item = items.get(selectedId);
      item.group.getWorldPosition(aim);
      if (previousFollow) {
        deltaFollow.copy(aim).sub(previousFollow);
        if (transition) {
          // Move both endpoints with the planet during camera approach.
          transition.startPosition.add(deltaFollow);
          transition.startTarget.add(deltaFollow);
          transition.endPosition.add(deltaFollow);
          transition.endTarget.add(deltaFollow);
        } else {
          camera.position.add(deltaFollow);
          controls.target.add(deltaFollow);
        }
      }
      if (previousFollow) previousFollow.copy(aim); else previousFollow = aim.clone();
    }
    if (transition) {
      transition.elapsed += dt;
      const t = clamp(transition.elapsed / transition.duration, 0, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(transition.startPosition, transition.endPosition, ease);
      controls.target.lerpVectors(transition.startTarget, transition.endTarget, ease);
      if (t >= 1) { transition = null; controls.enabled = true; }
    }
    controls.update();
    updateLabels();
    renderer.render(scene, camera);
    if (now - lastTick > 250) { lastTick = now; emitTick(); }
  }

  function destroy() {
    destroyed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointercancel', onPointerCancel);
    renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
    controls.dispose();
    resources.forEach(resource => resource.dispose?.());
    renderer.dispose();
    renderer.domElement.remove();
    layer.remove();
    style.remove();
  }

  positionBodies();
  resize();
  camera.position.copy(generalPosition());
  camera.lookAt(0, 0, 0);
  controls.update();
  frame = requestAnimationFrame(animate);
  onReady();
  return { select, setPaused, setSpeed, setView, reset, setLabels, setOrbits, zoom, resize, destroy, getState };
}
