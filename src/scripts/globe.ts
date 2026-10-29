// Hero globe: a dotted sphere drawn with Canvas 2D, Karachi pinned with a pulse,
// arcs to a few cities with a dot travelling along each. Rewritten from
// docs/reference/globe.js. Loaded lazily by Hero.astro after the page is idle.

type Vec3 = [number, number, number];

export interface GlobeOptions {
  /** Tilt toward the cursor while idle (mouse devices). */
  tilt: boolean;
  /**
   * Where a horizontal drag may start (any pointer). Drags only start inside the
   * globe's circle, never on links or buttons. Gets `data-globe-cursor` ("grab" or
   * "grabbing") for a mouse, so CSS can show the cursor.
   */
  dragArea: HTMLElement;
  /** Called after the first frame is drawn, so the canvas can fade in. */
  onReady?: () => void;
}

const KARACHI: [number, number] = [24.86, 67.0];
const CITIES: [number, number][] = [
  [51.5, -0.1], // London
  [40.7, -74.0], // New York
  [25.2, 55.3], // Dubai
  [52.5, 13.4], // Berlin
  [1.35, 103.8], // Singapore
  [37.8, -122.4], // San Francisco
  [43.7, -79.4], // Toronto
];
const ARC_STEPS = 48;
const DOT_SHADES = 16; // brightness steps for the dots, from the edge to the front
const IDLE_FPS = 30; // frame rate while nobody is dragging (DECISIONS #41)
const IDLE_FRAME_MS = 1000 / IDLE_FPS;
const IDLE_SLACK_MS = 4; // a frame this early still counts, so timing jitter skips none
// Turns Karachi toward the viewer. (The reference used -67°, which put Karachi on
// the far side; a point at longitude L faces the viewer at a yaw of +L.)
const HOME_YAW = (KARACHI[1] * Math.PI) / 180;
// Tips the north pole slightly toward the viewer, so Karachi sits just above center.
const BASE_PITCH = 0.32;
const EASE_MS = 270; // time constant for easing toward the idle angle
const GLIDE_MS = 320; // time constant for the momentum glide after a drag
const MAX_GLIDE = 0.008; // radians per ms

const latLon = (lat: number, lon: number): Vec3 => {
  const p = (lat * Math.PI) / 180;
  const l = (lon * Math.PI) / 180;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
};

// Points spread evenly over the sphere.
function fibonacciSphere(count: number): Vec3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
  });
}

// Great-circle arc from a to b, lifted off the surface in the middle.
function arc(a: Vec3, b: Vec3): Vec3[] {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega) || 1;
  return Array.from({ length: ARC_STEPS + 1 }, (_, k) => {
    const t = k / ARC_STEPS;
    const s1 = Math.sin((1 - t) * omega) / sinOmega;
    const s2 = Math.sin(t * omega) / sinOmega;
    const lift = 1 + 0.22 * Math.sin(Math.PI * t);
    return [
      (a[0] * s1 + b[0] * s2) * lift,
      (a[1] * s1 + b[1] * s2) * lift,
      (a[2] * s1 + b[2] * s2) * lift,
    ];
  });
}

// "#8fb3ff" to "143,179,255", so token colors can take a varying alpha.
function hexToRgb(hex: string, fallback: string): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return fallback;
  const n = parseInt(match[1], 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

export function initGlobe(canvas: HTMLCanvasElement, options: GlobeOptions): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const styles = getComputedStyle(canvas);
  const accent = hexToRgb(styles.getPropertyValue('--accent'), '143,179,255');
  const ink = hexToRgb(styles.getPropertyValue('--ink'), '237,235,229');
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // One fill style per brightness step (see the dots in draw()).
  const dotStyles = Array.from(
    { length: DOT_SHADES },
    (_, shade) => `rgba(${ink},${(0.12 + (0.55 * shade) / (DOT_SHADES - 1)).toFixed(3)})`,
  );
  const dotPaths: Path2D[] = [];

  const home = latLon(...KARACHI);
  const arcs = CITIES.map(([lat, lon]) => arc(home, latLon(lat, lon)));
  let points: Vec3[] = [];

  let size = 0;
  let radius = 0;
  let yaw = HOME_YAW;
  let pitch = BASE_PITCH;
  let offset = 0; // yaw left by drags and glides, on top of the idle angle
  let glide = 0; // momentum after a drag, radians per ms
  const pointer = { x: 0, y: 0 };
  const drag = { on: false, id: -1, startX: 0, startYaw: 0, x: 0, t: 0, velocity: 0 };

  let frame = 0;
  let lastTime = 0;
  let prevTime = 0;
  let running = false;
  let visible = false;
  let ready = false;

  // Matches the canvas to its slot. Returns true when the size changed (which clears it).
  function resize(): boolean {
    const next = Math.round(canvas.parentElement?.clientWidth ?? 0);
    if (!next || next === size) return false;
    const pointCount = next < 450 ? 650 : 900;
    if (points.length !== pointCount) points = fibonacciSphere(pointCount);
    size = next;
    radius = size * 0.39;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  // The idle angle: home, the gentle sway, and the cursor tilt.
  const idleYaw = (time: number) =>
    HOME_YAW + Math.sin(time / 4200) * 0.55 + (options.tilt ? pointer.x * 0.5 : 0);

  function step(time: number) {
    const dt = prevTime ? Math.min(Math.max(time - prevTime, 0), 100) : 16;
    prevTime = time;

    if (reducedQuery.matches) {
      yaw = HOME_YAW;
      pitch = BASE_PITCH;
      offset = glide = 0;
      return;
    }

    // Dragging: the front follows the pointer one to one (a pixel of movement turns
    // the surface at the center by a pixel), with no easing, sway, or tilt.
    if (drag.on) {
      yaw = drag.startYaw - (drag.x - drag.startX) / radius;
      return;
    }

    if (glide) {
      yaw += glide * dt;
      offset += glide * dt;
      glide *= Math.exp(-dt / GLIDE_MS);
      if (Math.abs(glide) < 1e-5) glide = 0;
    }

    const ease = 1 - Math.exp(-dt / EASE_MS);
    yaw += (idleYaw(time) + offset - yaw) * ease;
    pitch += (BASE_PITCH + (options.tilt ? pointer.y * 0.25 : 0) - pitch) * ease;
  }

  function draw(time: number) {
    lastTime = time;
    step(time);
    const reduced = reducedQuery.matches;

    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const center = size / 2;
    const project = (p: Vec3): Vec3 => {
      const x1 = p[0] * cy - p[2] * sy;
      const z1 = p[0] * sy + p[2] * cy;
      const y2 = p[1] * cp - z1 * sp;
      const z2 = p[1] * sp + z1 * cp;
      return [center + x1 * radius, center - y2 * radius, z2];
    };

    ctx!.clearRect(0, 0, size, size);

    // Soft halo
    const halo = ctx!.createRadialGradient(
      center - radius * 0.24,
      center - radius * 0.32,
      20,
      center,
      center,
      radius * 1.25,
    );
    halo.addColorStop(0, `rgba(${accent},0.10)`);
    halo.addColorStop(1, `rgba(${accent},0)`);
    ctx!.fillStyle = halo;
    ctx!.beginPath();
    ctx!.arc(center, center, radius * 1.25, 0, Math.PI * 2);
    ctx!.fill();

    // Dots, brighter toward the viewer; the far side is skipped. Dots are grouped into
    // DOT_SHADES brightness steps and each step is filled once, so a frame costs a dozen
    // fills instead of one per dot (a big saving on slow phones).
    for (let shade = 0; shade < DOT_SHADES; shade++) dotPaths[shade] = new Path2D();
    for (const p of points) {
      const q = project(p);
      if (q[2] < -0.05) continue;
      const shade = Math.min(DOT_SHADES - 1, Math.max(0, Math.round(q[2] * (DOT_SHADES - 1))));
      const r = 1.1 + q[2] * 0.6;
      dotPaths[shade].moveTo(q[0] + r, q[1]);
      dotPaths[shade].arc(q[0], q[1], r, 0, Math.PI * 2);
    }
    for (let shade = 0; shade < DOT_SHADES; shade++) {
      ctx!.fillStyle = dotStyles[shade];
      ctx!.fill(dotPaths[shade]);
    }

    // Arcs, each with a travelling dot
    ctx!.lineWidth = 1.2;
    arcs.forEach((segment, i) => {
      ctx!.strokeStyle = `rgba(${accent},0.35)`;
      ctx!.beginPath();
      let drawing = false;
      for (const p of segment) {
        const q = project(p);
        if (q[2] > -0.02) {
          if (drawing) ctx!.lineTo(q[0], q[1]);
          else ctx!.moveTo(q[0], q[1]);
          drawing = true;
        } else {
          drawing = false;
        }
      }
      ctx!.stroke();

      const phase = reduced ? 0.6 : (time / 2600 + i * 0.17) % 1;
      const q = project(segment[Math.floor(phase * ARC_STEPS)]);
      if (q[2] > -0.02) {
        ctx!.fillStyle = `rgb(${accent})`;
        ctx!.beginPath();
        ctx!.arc(q[0], q[1], 2.4, 0, Math.PI * 2);
        ctx!.fill();
      }
    });

    // Karachi pin with a pulse
    const h = project(home);
    if (h[2] > 0) {
      const pulse = reduced ? 0.5 : (time / 1600) % 1;
      ctx!.strokeStyle = `rgba(${accent},${(0.6 * (1 - pulse)).toFixed(3)})`;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(h[0], h[1], 6 + pulse * 18, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.fillStyle = `rgb(${accent})`;
      ctx!.beginPath();
      ctx!.arc(h[0], h[1], 5, 0, Math.PI * 2);
      ctx!.fill();
    }

    if (!ready) {
      ready = true;
      options.onReady?.();
    }
  }

  // Idle (sway, tilt, travelling dots) draws at IDLE_FPS, which saves about a third of
  // the globe's main-thread time; a drag and its glide draw every frame so they stay
  // smooth. Idle frames follow a running schedule rather than "time since the last
  // draw", so a browser running below 60 fps still averages IDLE_FPS instead of
  // dropping to every third frame.
  let nextIdleDraw = 0;
  function loop(time: number) {
    if (drag.on || glide) {
      draw(time);
      nextIdleDraw = time + IDLE_FRAME_MS;
    } else if (time >= nextIdleDraw - IDLE_SLACK_MS) {
      draw(time);
      // Behind by more than a frame (after a pause or a long task): start over from now.
      nextIdleDraw = time - nextIdleDraw > IDLE_FRAME_MS ? time + IDLE_FRAME_MS : nextIdleDraw + IDLE_FRAME_MS;
    }
    if (running) frame = requestAnimationFrame(loop);
  }

  // Animate only while on screen, with the tab visible and motion allowed.
  // Under reduced motion one still frame is drawn instead.
  function update() {
    const shouldRun = visible && !document.hidden && !reducedQuery.matches;
    if (shouldRun && !running) {
      running = true;
      prevTime = 0; // no catch-up jump after a pause
      frame = requestAnimationFrame(loop);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(frame);
    }
    // Still frame: under reduced motion (centered, no tilt), or before the first animated frame.
    if (!running && size && (reducedQuery.matches || !ready)) {
      if (reducedQuery.matches) pointer.x = pointer.y = 0;
      draw(lastTime);
    }
  }

  const insideGlobe = (event: PointerEvent) => {
    if (!(event.target instanceof Element) || event.target.closest('a, button')) return false;
    const box = canvas.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    return Math.hypot(dx, dy) <= radius;
  };

  const area = options.dragArea;
  const setCursor = (cursor: 'grab' | 'grabbing' | '') => {
    if (cursor) area.dataset.globeCursor = cursor;
    else delete area.dataset.globeCursor;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (reducedQuery.matches) return;
    if (drag.on) {
      if (event.pointerId !== drag.id) return;
      // Smoothed angular speed, kept for the glide on release.
      const dt = event.timeStamp - drag.t;
      if (dt > 0) {
        const speed = -(event.clientX - drag.x) / radius / dt;
        drag.velocity = drag.velocity * 0.6 + speed * 0.4;
      }
      drag.x = event.clientX;
      drag.t = event.timeStamp;
      return;
    }
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  // Grab cursor while a mouse is over the globe (not over a link or button).
  const onAreaMove = (event: PointerEvent) => {
    if (drag.on || event.pointerType !== 'mouse') return;
    setCursor(!reducedQuery.matches && insideGlobe(event) ? 'grab' : '');
  };

  const onAreaLeave = () => {
    if (!drag.on) setCursor('');
  };

  const onPointerDown = (event: PointerEvent) => {
    if (reducedQuery.matches || drag.on || event.button !== 0 || !insideGlobe(event)) return;
    event.preventDefault(); // a mouse or pen drag would otherwise select the hero text
    drag.on = true;
    drag.id = event.pointerId;
    drag.startX = drag.x = event.clientX;
    drag.t = event.timeStamp;
    drag.startYaw = yaw;
    drag.velocity = 0;
    glide = 0;
    if (event.pointerType === 'mouse') setCursor('grabbing');
  };

  // Release: the idle angle picks up from where the drag left the globe, so the
  // sway resumes from the current angle, plus a short glide if it was flicked.
  const onPointerUp = (event: PointerEvent) => {
    if (!drag.on || event.pointerId !== drag.id) return;
    drag.on = false;
    offset = yaw - idleYaw(performance.now());
    const stale = event.type === 'pointercancel' || event.timeStamp - drag.t > 80;
    glide = stale ? 0 : Math.max(-MAX_GLIDE, Math.min(MAX_GLIDE, drag.velocity));
    if (event.pointerType === 'mouse') setCursor(insideGlobe(event) ? 'grab' : '');
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  area.addEventListener('pointermove', onAreaMove, { passive: true });
  area.addEventListener('pointerleave', onAreaLeave);
  area.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });
  observer.observe(canvas);

  // Resizing clears the canvas; a paused globe redraws its last frame.
  const resizeObserver = new ResizeObserver(() => {
    if (resize() && !running) draw(lastTime);
  });
  resizeObserver.observe(canvas.parentElement ?? canvas);

  document.addEventListener('visibilitychange', update);
  reducedQuery.addEventListener('change', update);

  resize();
  update();

  return function stop() {
    running = false;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    area.removeEventListener('pointermove', onAreaMove);
    area.removeEventListener('pointerleave', onAreaLeave);
    area.removeEventListener('pointerdown', onPointerDown);
    setCursor('');
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    document.removeEventListener('visibilitychange', update);
    reducedQuery.removeEventListener('change', update);
  };
}
