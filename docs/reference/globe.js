// Reference implementation of the hero globe from the design phase.
// Dotted sphere, Karachi pinned, arcs to cities with moving dots.
// Plain Canvas 2D, no dependencies. Rewrite cleanly for production
// (types, module structure), but keep the behaviour.
//
// Usage:
//   const stop = initGlobe(canvasElement, { size: 640, accent: '#8fb3ff', interactive: 'pointer' });
//   // interactive: 'pointer' (tilt toward the cursor, desktop) or 'drag' (horizontal drag, touch)
//   // call stop() to clean up.

export function initGlobe(canvas, opts = {}) {
  const size = opts.size ?? 640;
  const accent = opts.accent ?? '#8fb3ff';
  const ink = opts.ink ?? '237,235,229';
  const pointCount = opts.points ?? (size < 450 ? 650 : 900);
  const interactive = opts.interactive ?? 'pointer';

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fibonacci sphere points
  const pts = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < pointCount; i++) {
    const y = 1 - (i / (pointCount - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = ga * i;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }

  const latLon = (lat, lon) => {
    const p = (lat * Math.PI) / 180, l = (lon * Math.PI) / 180;
    return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
  };
  const home = latLon(24.86, 67.0); // Karachi
  const cities = [
    latLon(51.5, -0.1),    // London
    latLon(40.7, -74.0),   // New York
    latLon(25.2, 55.3),    // Dubai
    latLon(52.5, 13.4),    // Berlin
    latLon(1.35, 103.8),   // Singapore
    latLon(37.8, -122.4),  // San Francisco
    latLon(43.7, -79.4),   // Toronto
  ];

  // Great-circle arc with a lift in the middle
  const slerp = (a, b, t) => {
    const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const om = Math.acos(d), so = Math.sin(om) || 1;
    const s1 = Math.sin((1 - t) * om) / so, s2 = Math.sin(t * om) / so;
    const lift = 1 + 0.22 * Math.sin(Math.PI * t);
    return [(a[0] * s1 + b[0] * s2) * lift, (a[1] * s1 + b[1] * s2) * lift, (a[2] * s1 + b[2] * s2) * lift];
  };
  const STEPS = 48;
  const arcs = cities.map((c) => Array.from({ length: STEPS + 1 }, (_, k) => slerp(home, c, k / STEPS)));

  const R = size * 0.39, cx = size / 2, cy = size / 2;
  const homeYaw = (-67 * Math.PI) / 180; // face Karachi
  let ry = homeYaw, rx = -0.32;
  const pointer = { x: 0, y: 0 };
  const drag = { on: false, x0: 0, base: 0, off: 0 };

  // Input
  const onPointerMove = (e) => {
    if (interactive === 'pointer') {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    } else if (drag.on) {
      drag.off = drag.base + (e.clientX - drag.x0) * 0.012;
    }
  };
  const onPointerDown = (e) => { if (interactive === 'drag') { drag.on = true; drag.x0 = e.clientX; drag.base = drag.off; } };
  const onPointerUp = () => { drag.on = false; };
  if (interactive === 'pointer') window.addEventListener('pointermove', onPointerMove, { passive: true });
  else {
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    canvas.style.touchAction = 'pan-y';
  }

  let raf = 0, running = true;

  const draw = (t) => {
    const sway = reduced || drag.on ? 0 : Math.sin(t / 4200) * 0.55;
    const targetY = homeYaw + sway + pointer.x * 0.5 + drag.off;
    const targetX = -0.32 + pointer.y * 0.25;
    ry += (targetY - ry) * 0.06;
    rx += (targetX - rx) * 0.06;
    const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx);
    const project = (p) => {
      const x1 = p[0] * cY - p[2] * sY, z1 = p[0] * sY + p[2] * cY;
      const y2 = p[1] * cX - z1 * sX, z2 = p[1] * sX + z1 * cX;
      return [cx + x1 * R, cy - y2 * R, z2];
    };

    ctx.clearRect(0, 0, size, size);

    // Soft halo
    const g = ctx.createRadialGradient(cx - R * 0.24, cy - R * 0.32, 20, cx, cy, R * 1.25);
    g.addColorStop(0, 'rgba(143,179,255,0.10)');
    g.addColorStop(1, 'rgba(143,179,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2); ctx.fill();

    // Dots, brighter toward the viewer
    for (const p of pts) {
      const q = project(p);
      if (q[2] < -0.05) continue;
      ctx.fillStyle = `rgba(${ink},${(0.12 + 0.55 * q[2]).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(q[0], q[1], 1.1 + q[2] * 0.6, 0, Math.PI * 2); ctx.fill();
    }

    // Arcs with a travelling dot
    arcs.forEach((seg, i) => {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(143,179,255,0.35)';
      ctx.beginPath();
      let on = false;
      for (const p of seg) {
        const q = project(p);
        if (q[2] > -0.02) { if (!on) { ctx.moveTo(q[0], q[1]); on = true; } else ctx.lineTo(q[0], q[1]); }
        else on = false;
      }
      ctx.stroke();
      const phase = reduced ? 0.6 : (t / 2600 + i * 0.17) % 1;
      const q = project(seg[Math.floor(phase * STEPS)]);
      if (q[2] > -0.02) { ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(q[0], q[1], 2.4, 0, Math.PI * 2); ctx.fill(); }
    });

    // Karachi pin with a pulse
    const h = project(home);
    if (h[2] > 0) {
      const pulse = reduced ? 0.5 : (t / 1600) % 1;
      ctx.strokeStyle = `rgba(143,179,255,${(0.6 * (1 - pulse)).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(h[0], h[1], 6 + pulse * 18, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(h[0], h[1], 5, 0, Math.PI * 2); ctx.fill();
    }

    if (!reduced && running) raf = requestAnimationFrame(draw);
  };

  // Pause when off screen or when the tab is hidden
  const io = new IntersectionObserver(([entry]) => {
    const visible = entry.isIntersecting && !document.hidden;
    if (visible && !running) { running = true; raf = requestAnimationFrame(draw); }
    if (!visible) { running = false; cancelAnimationFrame(raf); }
  });
  io.observe(canvas);

  raf = requestAnimationFrame(draw);

  return function stop() {
    running = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointerdown', onPointerDown);
  };
}
