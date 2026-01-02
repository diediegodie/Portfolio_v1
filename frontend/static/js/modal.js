// modal.js: Shared modal logic for all modals (Work, About, etc.)
// Usage: initModal({
//   modalId: 'work-modal',
//   triggerAttr: 'data-work-trigger',
//   overlayAttr: 'data-work-overlay',
//   closeAttr: 'data-work-close'
// });
(function (global) {
  function initModal({ modalId, triggerAttr, overlayAttr, closeAttr }) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    // Support multiple modal panel class names (work-modal__panel, about-modal__panel, modal__card)
    const panel =
      modal.querySelector('.work-modal__panel, .about-modal__panel, .modal__card') ||
      modal.querySelector('[role="dialog"]');
    const closeButton = modal.querySelector(`[${closeAttr}]`);
    const overlay = modal.querySelector(`[${overlayAttr}]`);
    const triggers = Array.from(document.querySelectorAll(`[${triggerAttr}]`));
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
      panel.classList.remove('close');
      modal.removeAttribute('hidden');
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
        if (lastFocusedElement instanceof HTMLElement) {
          if (document.activeElement === lastFocusedElement) {
            lastFocusedElement.blur();
          }
        }
        if (typeof document.body.focus === 'function') {
          document.body.focus();
        }
        panel.classList.remove('close');
      }, 300);
    }

    function handleKeyDown(event) {
      if (modal.dataset.open !== 'true') return;
      if (event.key === 'Escape') {
        event.preventDefault();
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'BUTTON' || activeEl.tagName === 'A')) {
          activeEl.blur();
        }
        closeModal();
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
      trigger.addEventListener('click', openModal);
    });
    if (closeButton) closeButton.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleKeyDown);
  }

  // Expose globally
  global.initModal = initModal;
})(window);
