(function () {
  const modal = document.getElementById('work-modal');
  if (!modal) return;

  const panel = modal.querySelector('.work-modal__panel');
  const closeButton = modal.querySelector('[data-work-close]');
  const overlay = modal.querySelector('[data-work-overlay]');
  const triggers = Array.from(document.querySelectorAll('[data-work-trigger]'));
  const mainContent = document.getElementById('home-main');
  const themeSwitch = document.querySelector('.theme-switch');
  const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let lastFocusedElement = null;

  function getFocusableElements() {
    if (!panel) return [];
    return Array.from(panel.querySelectorAll(focusableSelectors));
  }

  function openModal() {
    if (modal.dataset.open === 'true') return;
    lastFocusedElement = document.activeElement;
    // Remove close class if present
    panel.classList.remove('close');
    // Show modal, then animate in
    modal.removeAttribute('hidden');
    // Force reflow to restart animation
    void panel.offsetWidth;
    panel.classList.add('open');
    modal.dataset.open = 'true';
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
    if (themeSwitch) themeSwitch.setAttribute('aria-hidden', 'true');
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'true'));
    if (panel) panel.focus();
  }

  function closeModal() {
    if (modal.dataset.open !== 'true') return;
    // Animate out
    panel.classList.remove('open');
    panel.classList.add('close');
     setTimeout(() => {
       modal.setAttribute('hidden', '');
       delete modal.dataset.open;
       modal.setAttribute('aria-hidden', 'true');
       document.body.classList.remove('modal-open');
       if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
       if (themeSwitch) themeSwitch.setAttribute('aria-hidden', 'false');
       triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
       // Accessibility: blur the triggering button if focused, then focus body
       if (lastFocusedElement instanceof HTMLElement) {
         if (document.activeElement === lastFocusedElement) {
           lastFocusedElement.blur();
         }
       }
       if (typeof document.body.focus === 'function') {
         document.body.focus();
       }
       // Remove close class after animation
       panel.classList.remove('close');
     }, 300);
  }

  function handleKeyDown(event) {
    if (modal.dataset.open !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      // Before closing, blur the active button if it's a trigger or close button
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'BUTTON' || activeEl.tagName === 'A')) {
        activeEl.blur();
      }
      closeModal();
      // Focus is set to body in closeModal
      return;
    }
    if (event.key === 'Tab') {
      const focusable = getFocusableElements();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', handleKeyDown);
})();
