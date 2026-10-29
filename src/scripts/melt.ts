// Melt on the hero name: letters swell and lean toward the cursor, then an SVG goo
// filter (blur plus alpha threshold) fuses neighbours. Rewritten from
// docs/reference/melt-test.html. Tuning (Melt, Pull) lives in src/data/features.ts.
// Mouse only and never under reduced motion; the filter is only on while moving.
import { meltSettings } from '../data/features';

const MELT = meltSettings.melt;
const PULL = meltSettings.pull;

interface Letter {
  el: HTMLSpanElement;
  center: number;
  shift: number;
  scale: number;
}

/**
 * `name` holds the visible text node to split; `area` receives the pointer events;
 * `blur` is the filter's feGaussianBlur; `filterId` the filter to apply.
 */
export function initMelt(
  name: HTMLElement,
  area: HTMLElement,
  blur: SVGFEGaussianBlurElement,
  filterId: string,
): void {
  const source = name.querySelector<HTMLElement>('[data-melt-text]');
  if (!source?.textContent) return;

  // Letters are a visual copy only; the original text stays for screen readers.
  const row = document.createElement('span');
  row.className = 'melt-letters';
  row.setAttribute('aria-hidden', 'true');
  const letters: Letter[] = [...source.textContent].map((char) => {
    const el = document.createElement('span');
    el.textContent = char;
    row.append(el);
    return { el, center: 0, shift: 0, scale: 1 };
  });
  const measure = () => {
    for (const l of letters) l.center = l.el.offsetLeft + l.el.offsetWidth / 2;
  };

  const allowed = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );

  // The letters replace the kerned text only while the effect is allowed; under
  // reduced motion the plain text shows (DECISIONS #28).
  const mount = () => {
    if (allowed.matches) {
      source.classList.add('visually-hidden');
      source.before(row);
      measure();
    } else {
      row.remove();
      source.classList.remove('visually-hidden');
    }
  };
  // Swapped in only once the name's font has loaded: letters added before that would
  // each move when the web font replaces the fallback (a layout shift).
  const fontLoaded = document.fonts?.load(getComputedStyle(name).font) ?? Promise.resolve();
  fontLoaded.catch(() => {}).then(mount);
  window.addEventListener('resize', measure);

  let pointerX = 0;
  let active = false;
  let intensity = 0;
  let frame = 0;

  // Active while the mouse is over the name or a little above or below it.
  area.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || !allowed.matches) return;
    const box = row.getBoundingClientRect();
    const margin = box.height * 0.35;
    pointerX = event.clientX - box.left;
    active = event.clientY > box.top - margin && event.clientY < box.bottom + margin;
    if (active && !frame) frame = requestAnimationFrame(tick);
  });
  area.addEventListener('pointerleave', () => {
    active = false;
  });

  const reset = () => {
    for (const l of letters) {
      l.shift = 0;
      l.scale = 1;
      l.el.style.transform = '';
    }
    intensity = 0;
    name.style.filter = '';
  };
  allowed.addEventListener('change', () => {
    if (!allowed.matches) {
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      reset();
    }
    mount();
  });

  function tick() {
    const fontSize = parseFloat(getComputedStyle(name).fontSize);
    const reach = fontSize * 0.95;
    intensity += ((active ? 1 : 0) - intensity) * 0.08;

    let strongest = 0;
    let moving = false;
    for (const l of letters) {
      const distance = pointerX - l.center;
      const force = Math.exp(-((distance / reach) ** 2)) * intensity;
      strongest = Math.max(strongest, force);
      const targetShift = distance * 0.42 * PULL * force;
      const targetScale = 1 + 0.16 * force * (0.4 + PULL);
      l.shift += (targetShift - l.shift) * 0.14;
      l.scale += (targetScale - l.scale) * 0.14;
      if (Math.abs(l.shift) > 0.05 || Math.abs(l.scale - 1) > 0.001) moving = true;
      l.el.style.transform = `translate3d(${l.shift.toFixed(2)}px,0,0) scale(${l.scale.toFixed(3)})`;
    }

    // Filter only while something is happening: crisp text at rest, cheaper too.
    if (intensity > 0.015) {
      name.style.filter = `url(#${filterId})`;
      const meltPx = MELT * (fontSize / 200); // blur scales with type size
      blur.setAttribute('stdDeviation', (meltPx * Math.min(1, intensity * (0.5 + strongest))).toFixed(2));
    } else {
      name.style.filter = '';
    }

    if (active || intensity > 0.015 || moving) {
      frame = requestAnimationFrame(tick);
    } else {
      frame = 0;
      reset();
    }
  }
}
