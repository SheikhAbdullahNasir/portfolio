// Scroll reveals: elements marked `data-reveal` fade and sharpen once as they enter
// view. The hiding CSS (global.css) only applies under `html.reveal`, which is set
// here, so the page stays readable if this script never runs.

export function initReveals(): void {
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!motion.matches || !targets.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  document.documentElement.classList.add('reveal');
  for (const target of targets) observer.observe(target);

  // Switching to reduced motion mid-visit shows everything at once.
  motion.addEventListener('change', () => {
    if (motion.matches) return;
    observer.disconnect();
    document.documentElement.classList.remove('reveal');
  });
}
