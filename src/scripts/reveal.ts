// Scroll reveals: elements marked `data-reveal` fade and sharpen as they enter view
// from below while scrolling down, every time. Scrolling up never replays them: an
// element is only reset once it has gone fully below the screen again. The hiding
// CSS (global.css) only applies under `html.reveal`, which is set here, so the page
// stays readable if this script never runs.

export function initReveals(): void {
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!motion.matches || !targets.length || !('IntersectionObserver' in window)) return;

  // Scroll direction, so an element reached while scrolling up (one skipped past by
  // a menu jump) appears without the animation.
  let lastY = window.scrollY;
  let scrollingUp = false;
  window.addEventListener(
    'scroll',
    () => {
      scrollingUp = window.scrollY < lastY;
      lastY = window.scrollY;
    },
    { passive: true },
  );

  // Reveal a little after the element crosses the bottom edge, so the fade is seen.
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.target.classList.contains('is-revealed')) continue;
        const fromTop = scrollingUp || entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
        if (fromTop) entry.target.classList.add('reveal-instant');
        entry.target.classList.add('is-revealed');
        if (fromTop) {
          getComputedStyle(entry.target).opacity; // apply the end state before the transition returns
          entry.target.classList.remove('reveal-instant');
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  // Reset only when fully below the screen (left through the bottom edge while
  // scrolling up), so the next pass down replays it. Leaving through the top keeps it.
  const reset = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const below = entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight);
      if (!entry.isIntersecting && below) entry.target.classList.remove('is-revealed');
    }
  });

  // Anything already above the screen (a reload partway down) starts revealed.
  for (const target of targets) {
    if (target.getBoundingClientRect().bottom <= 0) target.classList.add('is-revealed');
  }

  document.documentElement.classList.add('reveal');
  for (const target of targets) {
    reveal.observe(target);
    reset.observe(target);
  }

  // Switching to reduced motion mid-visit shows everything at once.
  motion.addEventListener('change', () => {
    if (motion.matches) return;
    reveal.disconnect();
    reset.disconnect();
    document.documentElement.classList.remove('reveal');
  });
}
