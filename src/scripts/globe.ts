// Hero globe: a dotted sphere drawn with Canvas 2D, Karachi pinned with a pulse,
// arcs to a few cities with a dot travelling along each. Rewritten from
// docs/reference/globe.js. Loaded lazily by Hero.astro after the page is idle.

type Vec3 = [number, number, number];

export interface GlobeOptions {
  /** 'pointer' tilts toward the cursor (mouse); 'drag' turns with a horizontal drag (touch). */
  interactive: 'pointer' | 'drag';
  /** Where a drag may start. Drags only start inside the globe's circle, never on links or buttons. */
  dragArea?: HTMLElement;
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
// Turns Karachi toward the viewer. (The reference used -67°, which put Karachi on
// the far side; a point at longitude L faces the viewer at a yaw of +L.)
const HOME_YAW = (KARACHI[1] * Math.PI) / 180;
// Tips the north pole slightly toward the viewer, so Karachi sits just above center.
const BASE_PITCH = 0.32;

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

  const home = latLon(...KARACHI);
  const arcs = CITIES.map(([lat, lon]) => arc(home, latLon(lat, lon)));
  let points: Vec3[] = [];

  let size = 0;
  let radius = 0;
  let yaw = HOME_YAW;
  let pitch = BASE_PITCH;
  const pointer = { x: 0, y: 0 };
  const drag = { on: false, id: -1, startX: 0, base: 0, offset: 0 };

  let frame = 0;
  let lastTime = 0;
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

  function draw(time: number) {
    lastTime = time;
    const reduced = reducedQuery.matches;
    const sway = reduced || drag.on ? 0 : Math.sin(time / 4200) * 0.55;
    const targetYaw = HOME_YAW + sway + pointer.x * 0.5 + drag.offset;
    const targetPitch = BASE_PITCH + pointer.y * 0.25;
    // Ease toward the target; a still frame jumps straight there.
    const ease = reduced ? 1 : 0.06;
    yaw += (targetYaw - yaw) * ease;
    pitch += (targetPitch - pitch) * ease;

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

    // Dots, brighter toward the viewer; the far side is skipped.
    for (const p of points) {
      const q = project(p);
      if (q[2] < -0.05) continue;
      ctx!.fillStyle = `rgba(${ink},${(0.12 + 0.55 * q[2]).toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(q[0], q[1], 1.1 + q[2] * 0.6, 0, Math.PI * 2);
      ctx!.fill();
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

  function loop(time: number) {
    draw(time);
    if (running) frame = requestAnimationFrame(loop);
  }

  // Animate only while on screen, with the tab visible and motion allowed.
  // Under reduced motion one still frame is drawn instead.
  function update() {
    const shouldRun = visible && !document.hidden && !reducedQuery.matches;
    if (shouldRun && !running) {
      running = true;
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

  const onPointerMove = (event: PointerEvent) => {
    if (reducedQuery.matches) return;
    if (options.interactive === 'pointer') {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    } else if (drag.on && event.pointerId === drag.id) {
      drag.offset = drag.base + (event.clientX - drag.startX) * 0.012;
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    if (reducedQuery.matches || drag.on) return;
    if ((event.target as Element).closest('a, button')) return;
    const box = canvas.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    if (Math.hypot(dx, dy) > radius) return;
    event.preventDefault(); // a mouse or pen drag would otherwise select the hero text
    drag.on = true;
    drag.id = event.pointerId;
    drag.startX = event.clientX;
    drag.base = drag.offset;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId === drag.id) drag.on = false;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  const dragArea = options.interactive === 'drag' ? options.dragArea : undefined;
  dragArea?.addEventListener('pointerdown', onPointerDown);
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
    dragArea?.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    document.removeEventListener('visibilitychange', update);
    reducedQuery.removeEventListener('change', update);
  };
}
