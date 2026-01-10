// about.js: initialize modal using shared modal.js
window.initModal && window.initModal({
  modalId: 'about-modal',
  triggerAttr: 'data-about-trigger',
  overlayAttr: 'data-about-overlay',
  closeAttr: 'data-about-close'
});

// About modal: stack marquee duration (only runs if marquees exist)
(() => {
  const modal = document.getElementById('about-modal');
  if (!modal) return;

  const marquees = Array.from(modal.querySelectorAll('.about-card .stack-marquee'));
  if (!marquees.length) return;

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const getSpeedPxPerSec = (marquee) => {
    const raw = getComputedStyle(marquee).getPropertyValue('--stack-speed').trim();
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 90;
  };

  const updateMarqueeDuration = (marquee) => {
    const track = marquee.querySelector('.stack-marquee__track');
    if (!track) return;

    const fullWidth = track.scrollWidth;
    const halfWidth = fullWidth / 2;
    if (!Number.isFinite(halfWidth) || halfWidth <= 0) return;

    const speed = getSpeedPxPerSec(marquee);
    const durationSeconds = Math.max(6, halfWidth / speed);
    track.style.setProperty('--stack-marquee-duration', `${durationSeconds}s`);
  };

  let rafId = 0;
  const scheduleUpdate = () => {
    if (modal.hasAttribute('hidden')) return;
    window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(() => {
      marquees.forEach(updateMarqueeDuration);
    });
  };

  // Run when the modal is opened (trigger click) and on viewport changes.
  document.querySelectorAll('[data-about-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      // Defer twice to allow modal open + layout.
      window.requestAnimationFrame(() => window.requestAnimationFrame(scheduleUpdate));
    });
  });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
})();
