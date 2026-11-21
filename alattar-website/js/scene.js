/* =========================================================
   Al-Attar — 3D scroll story
   A seed potato floats in the hero, gets planted as you scroll,
   then the whole field grows while the camera flies over it.
   ========================================================= */
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ---------- helpers ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function hash3(x, y, z) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c = (a, b, d) => hash3(xi + a, yi + b, zi + d);
  const x1 = lerp(c(0, 0, 0), c(1, 0, 0), u), x2 = lerp(c(0, 1, 0), c(1, 1, 0), u);
  const x3 = lerp(c(0, 0, 1), c(1, 0, 1), u), x4 = lerp(c(0, 1, 1), c(1, 1, 1), u);
  return lerp(lerp(x1, x2, v), lerp(x3, x4, v), w);
}
const noise2 = (x, z) => noise3(x, 0.5, z);

let seed = 7;
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

/* ---------- terrain ---------- */
const FIELD = { x0: -28, x1: 28, z0: -62, z1: 20 };
const CANAL_X = 39;
function fieldMask(x, z) {
  const dx = Math.max(FIELD.x0 - x, 0, x - FIELD.x1);
  const dz = Math.max(FIELD.z0 - z, 0, z - FIELD.z1);
  return 1 - smooth(0, 5, Math.hypot(dx, dz));
}
function heightAt(x, z) {
  const hills = 2.4 * noise2(x * 0.03 + 10, z * 0.03) + 1.0 * noise2(x * 0.09, z * 0.09 + 5) - 1.5;
  const far = smooth(25, 95, Math.hypot(x, z + 20));
  const m = fieldMask(x, z);
  let h = hills * (0.35 + far * 3.2) * (1 - m);
  h += m * 0.22 * Math.cos(x * Math.PI * 2 / 1.5);
  const canal = smooth(3.4, 1.4, Math.abs(x - CANAL_X));
  h = lerp(h, -1.3, canal);
  return h;
}

/* ---------- geometries ---------- */
const ni = g => (g.index ? g.toNonIndexed() : g);

function plantGeometry() {
  const parts = [];
  const stem = new THREE.CylinderGeometry(0.03, 0.05, 0.55, 5);
  stem.translate(0, 0.27, 0); parts.push(stem);
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.SphereGeometry(0.3, 7, 5);
    leaf.scale(1, 0.26, 0.55);
    leaf.translate(0.3, 0, 0);
    leaf.rotateZ(0.35 + (i % 3) * 0.22);
    leaf.rotateY((i / 7) * Math.PI * 2 + (i % 2) * 0.5);
    leaf.translate(0, 0.22 + (i % 3) * 0.13, 0);
    parts.push(leaf);
  }
  const top = new THREE.IcosahedronGeometry(0.2, 0);
  top.translate(0, 0.62, 0); parts.push(top);
  return mergeGeometries(parts.map(ni));
}

function palmGeometries() {
  const H = 5.2;
  const trunk = new THREE.CylinderGeometry(0.16, 0.3, H, 7, 6);
  trunk.translate(0, H / 2, 0);
  const pos = trunk.attributes.position;
  for (let i = 0; i < pos.count; i++) { // slight curve
    const y = pos.getY(i);
    pos.setX(i, pos.getX(i) + Math.pow(y / H, 2) * 0.6);
  }
  const fronds = [];
  for (let i = 0; i < 9; i++) {
    const f = new THREE.ConeGeometry(0.42, 3.2, 4);
    f.scale(1, 1, 0.22);
    f.rotateZ(-Math.PI / 2);
    f.translate(1.6, 0, 0);
    f.rotateZ(-0.25 - (i % 3) * 0.18);
    f.rotateY((i / 9) * Math.PI * 2);
    f.translate(0.6, H, 0);
    fronds.push(f);
  }
  return { trunk: ni(trunk), crown: mergeGeometries(fronds.map(ni)) };
}

function treeGeometries() {
  const trunk = new THREE.CylinderGeometry(0.18, 0.28, 2, 6);
  trunk.translate(0, 1, 0);
  const a = new THREE.IcosahedronGeometry(1.4, 1); a.translate(0, 2.8, 0);
  const b = new THREE.IcosahedronGeometry(1.0, 1); b.translate(0.7, 3.5, 0.3);
  const c = new THREE.IcosahedronGeometry(0.9, 1); c.translate(-0.6, 3.4, -0.4);
  return { trunk: ni(trunk), crown: mergeGeometries([a, b, c].map(ni)) };
}

/* realistic seed potato: high-res lumpy body, netted skin, lenticels,
   shallow eyes and short knobbly chitted sprouts */
function fbm(x, y, z, oct = 4) {
  let a = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { a += amp * noise3(x * f, y * f, z * f); f *= 2.03; amp *= 0.5; }
  return a;
}
function potatoGroup(envMap) {
  let g = new THREE.IcosahedronGeometry(1, 72);
  g.deleteAttribute('normal'); g.deleteAttribute('uv');
  g = mergeVertices(g);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const skinA = new THREE.Color('#D8B271'), skinB = new THREE.Color('#BE9152'), skinC = new THREE.Color('#A07443');
  const net = new THREE.Color('#9C7440'), lent = new THREE.Color('#F1DDAE'), dirt = new THREE.Color('#7E5F3C'), eyeC = new THREE.Color('#6F4A26');
  const tmp = new THREE.Color();
  seed = 17;
  const eyes = [];
  for (let i = 0; i < 13; i++) eyes.push(new THREE.Vector3(rand() * 2 - 1, (rand() * 2 - 1) * 0.8, rand() * 2 - 1).normalize());
  eyes[9] = new THREE.Vector3(1, 0.15, 0.1).normalize(); // apical "rose" end
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    // broad irregular lumps + gentle flattening
    let r = 1 + (fbm(v.x * 1.1 + 4, v.y * 1.1, v.z * 1.1, 3) - 0.5) * 0.17;
    r += (noise3(v.x * 3.2, v.y * 3.2 + 7, v.z * 3.2) - 0.5) * 0.035;
    // fine skin relief (netting)
    const n1 = noise3(v.x * 26, v.y * 26, v.z * 26);
    const ridge = 1 - Math.abs(n1 - 0.5) * 2;
    r += (ridge - 0.5) * 0.0035 + (noise3(v.x * 55, v.y * 55, v.z * 55) - 0.5) * 0.0025;
    // eyes: shallow dimple with raised brow
    let eye = 0, brow = 0;
    for (const e of eyes) {
      const d = v.dot(e);
      eye = Math.max(eye, smooth(0.9965, 0.9996, d));
      brow = Math.max(brow, smooth(0.988, 0.994, d) * (1 - smooth(0.9955, 0.998, d)));
    }
    r += brow * 0.006 - eye * 0.02;
    const p = v.clone().multiplyScalar(r);
    p.x *= 1.42; p.y *= 0.92; p.z *= 1.08;
    pos.setXYZ(i, p.x, p.y, p.z);

    // skin colour
    const lo = fbm(v.x * 2.2 + 9, v.y * 2.2, v.z * 2.2, 3);
    tmp.copy(skinA).lerp(skinB, smooth(0.3, 0.7, lo)).lerp(skinC, smooth(0.58, 0.8, lo) * 0.75);
    tmp.lerp(lent, smooth(0.62, 0.8, fbm(v.x * 1.6 + 30, v.y * 1.6, v.z * 1.6, 2)) * 0.35);
    tmp.lerp(net, smooth(0.86, 0.97, ridge) * 0.45);
    const dots = noise3(v.x * 48 + 3, v.y * 48, v.z * 48);
    tmp.lerp(lent, smooth(0.78, 0.88, dots) * 0.6);
    tmp.lerp(net, smooth(0.8, 0.9, noise3(v.x * 34 + 8, v.y * 34, v.z * 34)) * 0.45);
    const dd = fbm(v.x * 4 + 20, v.y * 4, v.z * 4, 3);
    tmp.lerp(dirt, smooth(0.62, 0.78, dd) * 0.38);
    tmp.lerp(dirt, smooth(0.86, 0.95, noise3(v.x * 70, v.y * 70 + 3, v.z * 70)) * 0.4);
    tmp.lerp(eyeC, eye * 0.7 + brow * 0.15);
    colors.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();

  const group = new THREE.Group();
  const skin = new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.78, metalness: 0,
    sheen: 0.25, sheenRoughness: 0.9, sheenColor: new THREE.Color('#F1DFB8'),
    envMap, envMapIntensity: 0.3
  });
  const body = new THREE.Mesh(g, skin);
  body.castShadow = true;
  group.add(body);

  // chitted sprouts: short, thick, knobbly, purple-white with green tips
  const sproutMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.55, sheen: 0.4, sheenColor: new THREE.Color('#ffffff'), envMap, envMapIntensity: 0.5 });
  const base = new THREE.Color('#EADFCF'), mid = new THREE.Color('#A97393'), tip = new THREE.Color('#6F8F45');
  const surf = dir => { const s = dir.clone(); let r = 0; // find surface radius along dir
    const tv = dir.clone().normalize();
    r = 1 + (fbm(tv.x * 1.1 + 4, tv.y * 1.1, tv.z * 1.1, 3) - 0.5) * 0.17 + (noise3(tv.x * 3.2, tv.y * 3.2 + 7, tv.z * 3.2) - 0.5) * 0.035 - 0.05;
    s.copy(tv).multiplyScalar(r); s.x *= 1.42; s.y *= 0.92; s.z *= 1.08; return s; };
  [eyes[9], eyes[1], eyes[4], eyes[6]].forEach((e, j) => {
    const dir = e.clone(); if (dir.y < -0.2) dir.y = -dir.y; dir.normalize();
    const start = surf(dir);
    const len = [0.3, 0.22, 0.17, 0.12][j];
    const bend = new THREE.Vector3(rand() - 0.5, 0.8, rand() - 0.5).normalize();
    const parts = [];
    const curve = new THREE.CatmullRomCurve3([0, 0.35, 0.7, 1].map(t =>
      start.clone().addScaledVector(dir, t * len).addScaledVector(bend, t * t * len * 0.6)));
    const TS = 24, RS = 10;
    const tube = new THREE.TubeGeometry(curve, TS, 1, RS, false);
    const tp = tube.attributes.position, tc = new Float32Array(tp.count * 3), cp = new THREE.Vector3();
    for (let ring = 0; ring <= TS; ring++) {
      const t = ring / TS;
      curve.getPointAt(t, cp);
      const rad = lerp(0.11, 0.05, Math.pow(t, 1.4)) * (1 + Math.sin(t * 17 + j) * 0.06) * (t > 0.92 ? Math.sqrt(Math.max(0.05, (1 - t) / 0.08)) : 1);
      const c = new THREE.Color().copy(base).lerp(mid, smooth(0.05, 0.6, t)).lerp(tip, smooth(0.6, 1, t));
      for (let k = 0; k <= RS; k++) {
        const i = ring * (RS + 1) + k;
        const vx = tp.getX(i) - cp.x, vy = tp.getY(i) - cp.y, vz = tp.getZ(i) - cp.z; // unit offset
        tp.setXYZ(i, cp.x + vx * rad, cp.y + vy * rad, cp.z + vz * rad);
        tc.set([c.r, c.g, c.b], i * 3);
      }
    }
    tube.setAttribute('color', new THREE.BufferAttribute(tc, 3));
    tube.computeVertexNormals();
    parts.push(tube);
    const foot = new THREE.SphereGeometry(0.1, 12, 8); foot.translate(start.x, start.y, start.z);
    const cap = new THREE.SphereGeometry(0.012, 6, 4); const end = curve.getPointAt(1); cap.translate(end.x, end.y, end.z);
    for (const [geo, col] of [[foot, base], [cap, tip]]) {
      const ca = new Float32Array(geo.attributes.position.count * 3);
      for (let q = 0; q < geo.attributes.position.count; q++) ca.set([col.r, col.g, col.b], q * 3);
      geo.setAttribute('color', new THREE.BufferAttribute(ca, 3)); parts.push(geo);
    }
    // tiny leaf primordia at the tip
    for (let q = 0; q < 0; q++) {
      const l = new THREE.SphereGeometry(0.028, 8, 6); l.scale(1, 0.45, 0.7);
      const tq = curve.getPointAt(1);
      const a = q / 3 * Math.PI * 2;
      l.translate(tq.x + Math.cos(a) * 0.035, tq.y + 0.02, tq.z + Math.sin(a) * 0.035);
      const ca = new Float32Array(l.attributes.position.count * 3);
      for (let z = 0; z < l.attributes.position.count; z++) ca.set([0.36, 0.55, 0.22], z * 3);
      l.setAttribute('color', new THREE.BufferAttribute(ca, 3));
      parts.push(l);
    }
    const m = new THREE.Mesh(mergeGeometries(parts.map(ni)), sproutMat);
    m.castShadow = true;
    group.add(m);
  });
  return group;
}

let cloudMat;
function cloud() {
  const g = new THREE.Group();
  const mat = cloudMat || (cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, emissive: '#ffffff', emissiveIntensity: 0.28, fog: false }));
  const n = 5 + Math.floor(rand() * 4);
  for (let i = 0; i < n; i++) {
    const s = 2 + rand() * 3;
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), mat);
    m.position.set((i - n / 2) * 2.6 + rand() * 1.5, rand() * 1.6, rand() * 2.5);
    m.scale.y = 0.7;
    g.add(m);
  }
  return g;
}

function glowTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, inner); gr.addColorStop(0.25, inner); gr.addColorStop(1, outer);
  x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* centre-pivot irrigation rig (like the real farms) */
function pivotRig() {
  const ARM = 58, H = 3.6, SPANS = 6, L = ARM / SPANS;
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: '#D5DEE3', metalness: 0.55, roughness: 0.35 });
  const rust = new THREE.MeshStandardMaterial({ color: '#B4643A', roughness: 0.7 });
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, ARM, 10), metal);
  pipe.rotation.z = Math.PI / 2; pipe.position.set(ARM / 2, H, 0);
  g.add(pipe);
  const centre = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 1.1, H + 0.6, 4, 1, true), metal);
  centre.position.y = (H + 0.6) / 2; g.add(centre);
  const rod = (a, b, r, m = metal) => {
    const d = new THREE.Vector3().subVectors(b, a), len = d.length();
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 5), m);
    c.position.copy(a).addScaledVector(d, 0.5);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    c.castShadow = true; g.add(c);
  };
  const lines = [], drops = [];
  for (let k = 0; k < SPANS; k++) {
    const xa = k * L, xb = (k + 1) * L;
    const chord = u => new THREE.Vector3(xa + u * L, H - 1.25 * Math.sin(Math.PI * u), 0);
    for (let i = 0; i < 12; i++) { const a = chord(i / 12), b = chord((i + 1) / 12); lines.push(a, b); }
    for (let i = 1; i < 6; i++) {
      const u = i / 6, c = chord(u);
      lines.push(c, new THREE.Vector3(c.x, H, 0.0));
      lines.push(c, new THREE.Vector3(xa + (i - 0.5) / 6 * L, H, 0));
    }
    for (let i = 0; i < 6; i++) {
      const c = chord((i + 0.5) / 6), bottom = new THREE.Vector3(c.x, 1.15, 0);
      lines.push(c, bottom); drops.push(bottom);
    }
    // tower with wheels
    const top = new THREE.Vector3(xb, H, 0);
    for (const s of [-1, 1]) {
      const foot = new THREE.Vector3(xb, 0.55, s * 1.4);
      rod(top, foot, 0.07);
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 14), rust);
      w.rotation.x = Math.PI / 2; w.rotation.z = Math.PI / 2; w.position.copy(foot); w.castShadow = true;
      g.add(w);
    }
    rod(new THREE.Vector3(xb, 0.6, -1.4), new THREE.Vector3(xb, 0.6, 1.4), 0.06);
  }
  const lg = new THREE.BufferGeometry().setFromPoints(lines);
  g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: '#C3CDD3' })));
  pipe.castShadow = true;

  // water spray
  const PER = 9, n = drops.length * PER;
  const sg = new THREE.BufferGeometry();
  const sp = new Float32Array(n * 3);
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const spray = new THREE.Points(sg, new THREE.PointsMaterial({
    map: glowTexture('rgba(235,248,255,1)', 'rgba(200,235,255,0)'), size: 0.35, transparent: true, depthWrite: false, opacity: 0.75
  }));
  g.add(spray);
  const dirs = [];
  for (let i = 0; i < n; i++) { const a = (i % PER) / PER * Math.PI * 2 + i; dirs.push([Math.cos(a) * 0.9, Math.sin(a) * 0.9]); }
  g.userData.update = t => {
    for (let i = 0; i < n; i++) {
      const d = drops[Math.floor(i / PER)], ph = (t * 1.3 + i * 0.137) % 1;
      sp[i * 3] = d.x + dirs[i][0] * ph;
      sp[i * 3 + 1] = d.y - ph * ph * 1.1;
      sp[i * 3 + 2] = d.z + dirs[i][1] * ph;
    }
    sg.attributes.position.needsUpdate = true;
  };
  return g;
}

/* =========================================================
   main
   ========================================================= */
export function initScene({ onReady } = {}) {
  const canvas = document.getElementById('scene');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.body.classList.add('no-webgl');
    onReady && onReady();
    return { setDirection() {} };
  }
  const small = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#dff2fb', 45, 170);
  const camera = new THREE.PerspectiveCamera(small ? 55 : 45, innerWidth / innerHeight, 0.1, 600);

  /* sky dome */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(400, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new THREE.Color('#5DB8F0') }, mid: { value: new THREE.Color('#BFE6FB') }, bottom: { value: new THREE.Color('#F4FBF2') } },

      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP;
        void main(){ float h = normalize(vP).y;
          vec3 c = mix(bottom, mid, smoothstep(-0.02, 0.12, h));
          c = mix(c, top, smoothstep(0.12, 0.6, h));
          gl_FragColor = vec4(c, 1.);
          #include <colorspace_fragment>
        }`
    })
  );
  scene.add(sky);

  /* sun */
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,244,190,1)', 'rgba(255,220,120,0)'), fog: false, depthWrite: false, transparent: true }));
  sun.scale.set(70, 70, 1);
  scene.add(sun);

  /* lights */
  const hemi = new THREE.HemisphereLight('#E4F5FF', '#7C9A45', 1.25);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight('#FFF1D2', 2.4);
  dir.position.set(-30, 45, 25);
  dir.castShadow = true;
  dir.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  Object.assign(dir.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 140 });
  dir.shadow.bias = -0.0006;
  dir.shadow.normalBias = 0.03;
  dir.target.position.set(0, 0, -15);
  scene.add(dir, dir.target);

  /* ground */
  const seg = small ? 150 : 220;
  const groundGeo = new THREE.PlaneGeometry(320, 320, seg, seg);
  groundGeo.rotateX(-Math.PI / 2);
  groundGeo.translate(0, 0, -20);
  {
    const p = groundGeo.attributes.position;
    const col = new Float32Array(p.count * 3);
    const grass1 = new THREE.Color('#86C95B'), grass2 = new THREE.Color('#4E9A3E'), grass3 = new THREE.Color('#B9D86A');
    const soil1 = new THREE.Color('#E6C892'), soil2 = new THREE.Color('#C29560');
    const sand = new THREE.Color('#D8C189'), desert = new THREE.Color('#E4CC98');
    const c = new THREE.Color(), s = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const h = heightAt(x, z);
      p.setY(i, h);
      const n = noise2(x * 0.06, z * 0.06);
      c.copy(grass1).lerp(grass2, n).lerp(grass3, smooth(0.6, 0.9, noise2(x * 0.02 + 40, z * 0.02)) * 0.5);
      c.lerp(desert, smooth(45, 120, Math.hypot(x, z + 20)) * 0.8 + smooth(0.55, 0.75, noise2(x * 0.015, z * 0.015 + 9)) * 0.35);
      const m = fieldMask(x, z);
      const ridge = (Math.cos(x * Math.PI * 2 / 1.5) + 1) / 2;
      s.copy(soil2).lerp(soil1, ridge * 0.8 + n * 0.2);
      c.lerp(s, m);
      c.lerp(sand, smooth(5, 3, Math.abs(x - CANAL_X)) * 0.85);
      col.set([c.r, c.g, c.b], i * 3);
    }
    groundGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    groundGeo.computeVertexNormals();
  }
  const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }));
  ground.receiveShadow = true;
  scene.add(ground);

  /* canal (ترعة) */
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 320, 1, 1),
    new THREE.MeshStandardMaterial({ color: '#4FB3D9', roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.9 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(CANAL_X, -0.75, -20);
  scene.add(water);

  /* plants (instanced) */
  const plantGeo = plantGeometry();
  const plantMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.75, flatShading: true });
  const cols = [], zStep = small ? 1.6 : 1.25;
  for (let x = -27; x <= 27.01; x += small ? 3 : 1.5) cols.push(x);
  const plantsData = [];
  for (const x of cols) for (let z = FIELD.z1 - 1; z >= FIELD.z0 + 1; z -= zStep) {
    const jx = x + (hash3(x, 1, z) - .5) * 0.15, jz = z + (hash3(x, 2, z) - .5) * 0.4;
    plantsData.push({
      x: jx, z: jz, y: heightAt(jx, jz) - 0.02,
      rot: hash3(x, 3, z) * Math.PI * 2,
      size: 0.85 + hash3(x, 4, z) * 0.45,
      delay: ((FIELD.z1 - z) / (FIELD.z1 - FIELD.z0)) * 0.55 + (Math.abs(x) / 28) * 0.12
    });
  }
  const plants = new THREE.InstancedMesh(plantGeo, plantMat, plantsData.length);
  plants.castShadow = true; plants.receiveShadow = true;
  {
    const c = new THREE.Color(), a = new THREE.Color('#2F9E44'), b = new THREE.Color('#7DCB4E');
    plantsData.forEach((d, i) => { c.copy(a).lerp(b, hash3(d.x, 5, d.z)); plants.setColorAt(i, c); });
  }
  scene.add(plants);

  /* centre pivot */
  const pivot = pivotRig();
  pivot.position.set(-29.5, heightAt(-29.5, -21), -21);
  scene.add(pivot);

  /* palms along the canal + trees on hills */
  const palm = palmGeometries();
  const tree = treeGeometries();
  const trunkMat = new THREE.MeshStandardMaterial({ color: '#8A6038', roughness: 0.9, flatShading: true });
  const palmLeafMat = new THREE.MeshStandardMaterial({ color: '#3F9A3A', roughness: 0.8, flatShading: true, side: THREE.DoubleSide });
  const treeLeafMat = new THREE.MeshStandardMaterial({ color: '#5DB04A', roughness: 0.85, flatShading: true });
  const palmSpots = [];
  for (let z = 22; z > -150; z -= 7 + hash3(z, 7, 1) * 6) {
    palmSpots.push([CANAL_X - 4.2 - hash3(z, 1, 1) * 1.5, z]);
    if (hash3(z, 9, 2) > 0.4) palmSpots.push([CANAL_X + 4.2 + hash3(z, 2, 1) * 2, z - 3]);
  }
  for (let z = 10; z > -70; z -= 9) palmSpots.push([-33 - hash3(z, 3, 3) * 4, z]);
  const treeSpots = [];
  seed = 3;
  while (treeSpots.length < (small ? 40 : 90)) {
    const x = (rand() * 2 - 1) * 140, z = 30 - rand() * 200;
    if (fieldMask(x, z) > 0.01 || Math.abs(x - CANAL_X) < 7 || (x > -36 && x < 30 && z > -66 && z < 24)) continue;
    treeSpots.push([x, z]);
  }
  const placeInstances = (geos, mats, spots, scaleFn) => {
    const t = new THREE.InstancedMesh(geos.trunk, mats[0], spots.length);
    const c = new THREE.InstancedMesh(geos.crown, mats[1], spots.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    spots.forEach(([x, z], i) => {
      const k = scaleFn(x, z);
      p.set(x, heightAt(x, z) - 0.1, z);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), hash3(x, z, 4) * Math.PI * 2);
      s.set(k, k * (0.9 + hash3(x, z, 6) * 0.3), k);
      m.compose(p, q, s);
      t.setMatrixAt(i, m); c.setMatrixAt(i, m);
    });
    t.castShadow = c.castShadow = true;
    scene.add(t, c);
  };
  placeInstances(palm, [trunkMat, palmLeafMat], palmSpots, (x, z) => 0.85 + hash3(x, z, 5) * 0.4);
  placeInstances(tree, [trunkMat, treeLeafMat], treeSpots, (x, z) => 0.9 + hash3(x, z, 5) * 0.9);

  /* clouds */
  const clouds = [];
  seed = 21;
  for (let i = 0; i < 14; i++) {
    const c = cloud();
    c.position.set((rand() * 2 - 1) * 160, 32 + rand() * 18, -40 - rand() * 160);
    c.userData.speed = 0.6 + rand() * 1.2;
    c.scale.setScalar(0.9 + rand() * 0.9);
    clouds.push(c); scene.add(c);
  }

  /* floating pollen / seeds */
  const PCOUNT = small ? 260 : 520;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PCOUNT * 3), pBase = new Float32Array(PCOUNT * 3);
  seed = 99;
  for (let i = 0; i < PCOUNT; i++) {
    pBase[i * 3] = (rand() * 2 - 1) * 34;
    pBase[i * 3 + 1] = 0.5 + rand() * 13;
    pBase[i * 3 + 2] = 26 - rand() * 92;
  }
  pPos.set(pBase);
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pollen = new THREE.Points(pGeo, new THREE.PointsMaterial({
    map: glowTexture('rgba(255,250,215,1)', 'rgba(255,240,170,0)'), size: 0.22, transparent: true, depthWrite: false, opacity: 0.9
  }));
  scene.add(pollen);

  /* hero potato */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const potato = potatoGroup(envTex);
  scene.add(potato);
  const heroPos = new THREE.Vector3();
  const plantSpot = new THREE.Vector3(0, 0.2, 4);
  let rtl = document.documentElement.dir === 'rtl';
  const placeHero = () => {
    const narrow = innerWidth / innerHeight < 0.85;
    if (narrow) heroPos.set(0, 7.6, 14);
    else heroPos.set(rtl ? -3.9 : 3.9, 4.0, 14);
  };
  placeHero();

  /* camera path */
  const camPts = [
    [0, 2.6, 25], [7, 8, 16], [-10, 6.5, 2], [-14, 9, -22], [12, 15, -36], [-4, 5.2, 19]
  ].map(a => new THREE.Vector3(...a));
  const lookPts = [
    [0, 4.4, 10], [0, 0.6, 3], [0, 0.8, -14], [2, 0.5, -36], [0, 0, -30], [10, 3.2, -80]
  ].map(a => new THREE.Vector3(...a));
  const camCurve = new THREE.CatmullRomCurve3(camPts, false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(lookPts, false, 'centripetal');

  /* inputs */
  let target = 0, progress = 0;
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  const readScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    target = max > 0 ? clamp(scrollY / max) : 0;
  };
  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('pointermove', e => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    placeHero(); readScroll();
  });
  readScroll();
  progress = target;

  const DAY = {
    top: new THREE.Color('#5DB8F0'), mid: new THREE.Color('#BFE6FB'), bottom: new THREE.Color('#F4FBF2'),
    fog: new THREE.Color('#dff2fb'), light: new THREE.Color('#FFF1D2'), hemi: new THREE.Color('#E4F5FF'),
    sun: new THREE.Color('#ffffff'), cloud: new THREE.Color('#ffffff')
  };
  const DUSK = {
    top: new THREE.Color('#5A6FB0'), mid: new THREE.Color('#F39A62'), bottom: new THREE.Color('#FFD39A'),
    fog: new THREE.Color('#F7C9A0'), light: new THREE.Color('#FFB277'), hemi: new THREE.Color('#FFD6BC'),
    sun: new THREE.Color('#FF9A50'), cloud: new THREE.Color('#FFB59A')
  };

  /* loop */
  const clock = new THREE.Clock();
  const tPos = new THREE.Vector3(), tLook = new THREE.Vector3(), right = new THREE.Vector3();
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let first = true;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    progress += (target - progress) * (1 - Math.pow(0.004, dt));
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.pow(0.02, dt));
    mouse.sy += (mouse.y - mouse.sy) * (1 - Math.pow(0.02, dt));
    const p = progress;

    /* camera */
    camCurve.getPoint(p, tPos);
    lookCurve.getPoint(p, tLook);
    camera.position.copy(tPos);
    camera.lookAt(tLook);
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    const par = reduce ? 0 : 1;
    camera.position.addScaledVector(right, mouse.sx * 0.7 * par);
    camera.position.y += -mouse.sy * 0.35 * par;
    camera.lookAt(tLook);
    sky.position.copy(camera.position);
    /* day → sunset as the page ends (like the farm photos) */
    const ss = smooth(0.58, 0.97, p);
    const U = sky.material.uniforms;
    U.top.value.copy(DAY.top).lerp(DUSK.top, ss);
    U.mid.value.copy(DAY.mid).lerp(DUSK.mid, ss);
    U.bottom.value.copy(DAY.bottom).lerp(DUSK.bottom, ss);
    scene.fog.color.copy(DAY.fog).lerp(DUSK.fog, ss);
    dir.color.copy(DAY.light).lerp(DUSK.light, ss);
    dir.intensity = lerp(2.4, 1.6, ss);
    hemi.color.copy(DAY.hemi).lerp(DUSK.hemi, ss);
    sun.material.color.copy(DAY.sun).lerp(DUSK.sun, ss);
    sun.scale.setScalar(lerp(70, 120, ss));
    cloudMat && cloudMat.emissive.copy(DAY.cloud).lerp(DUSK.cloud, ss);
    sun.position.set(camera.position.x - 70, camera.position.y + lerp(55, 10, ss), camera.position.z - 170);
    pivot.rotation.y = Math.sin(t * 0.045) * 0.5 - 0.05;
    if (!reduce) pivot.userData.update(t);

    /* potato: float → planted */
    const t1 = ease(smooth(0.0, 0.13, p));
    const t2 = smooth(0.11, 0.17, p);
    potato.visible = t2 < 0.999;
    if (potato.visible) {
      potato.position.lerpVectors(heroPos, plantSpot, t1);
      potato.position.y += Math.sin(t * 1.4) * 0.12 * (1 - t1) - t2 * 0.6;
      potato.scale.setScalar(lerp(0.85, 0.3, t1));
      potato.rotation.y = t * (reduce ? 0 : 0.35) + mouse.sx * 0.5;
      potato.rotation.x = 0.25 + mouse.sy * 0.25 + t1 * 1.2;
      potato.rotation.z = 0.15 + Math.sin(t * 0.7) * 0.06;
    }

    /* plants grow */
    const g = smooth(0.09, 0.62, p);
    for (let i = 0; i < plantsData.length; i++) {
      const d = plantsData[i];
      let s = ease(clamp((g - d.delay) / 0.35));
      s = 0.2 + s * 0.8;
      const sway = reduce ? 0 : Math.sin(t * 1.6 + d.x * 0.35 + d.z * 0.22) * 0.07 * s;
      e3.set(sway, d.rot, sway * 0.6);
      q.setFromEuler(e3);
      const k = s * d.size;
      sc.set(k, k * (0.9 + s * 0.3), k);
      ps.set(d.x, d.y, d.z);
      m4.compose(ps, q, sc);
      plants.setMatrixAt(i, m4);
    }
    plants.instanceMatrix.needsUpdate = true;

    /* clouds, pollen, water */
    for (const c of clouds) {
      c.position.x += dt * c.userData.speed;
      if (c.position.x > 180) c.position.x = -180;
    }
    if (!reduce) {
      for (let i = 0; i < PCOUNT; i++) {
        const bx = pBase[i * 3], by = pBase[i * 3 + 1], bz = pBase[i * 3 + 2];
        pPos[i * 3] = bx + Math.sin(t * 0.3 + i) * 0.8;
        pPos[i * 3 + 1] = by + ((t * 0.25 + i * 0.37) % 4) - 2 + Math.sin(t + i) * 0.2;
        pPos[i * 3 + 2] = bz + Math.cos(t * 0.25 + i * 1.3) * 0.8;
      }
      pGeo.attributes.position.needsUpdate = true;
    }
    water.material.color.setHSL(0.54, 0.62, 0.58 + Math.sin(t * 0.8) * 0.02);

    renderer.render(scene, camera);
    if (first) { first = false; onReady && onReady(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    setDirection(isRtl) { rtl = isRtl; placeHero(); }
  };
}
