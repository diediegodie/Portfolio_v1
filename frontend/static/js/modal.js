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
    // Support multiple modal panel class names (work-modal__panel, about-modal__panel, modal__card, card)
    const panel =
      modal.querySelector('.work-modal__panel, .about-modal__panel, .contact-modal__panel, .modal__card, .card') ||
      modal.querySelector('[role="dialog"]');
    const closeButton = modal.querySelector(`[${closeAttr}]`);
    const overlay = modal.querySelector(`[${overlayAttr}]`);
    const triggers = Array.from(document.querySelectorAll(`[${triggerAttr}]`));
    const mainContent = document.getElementById('home-main');
    const themeSwitch = document.querySelector('.theme-switch');
    const headerEl = document.querySelector('.header-layout');
    const heroEl = document.querySelector('section.hero');
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
      modal.removeAttribute('inert');
      void panel.offsetWidth;
      panel.classList.add('open');
      modal.dataset.open = 'true';
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      if (mainContent) { mainContent.setAttribute('inert', ''); mainContent.setAttribute('aria-hidden', 'true');
        // stop in-progress home text scrambles to free CPU
        if (window.i18n && typeof window.i18n.cancelRunningAnimations === 'function') {
          try { window.i18n.cancelRunningAnimations(); } catch (e) { /* ignore */ }
        }
      }
      if (themeSwitch) { themeSwitch.setAttribute('inert', ''); themeSwitch.setAttribute('aria-hidden', 'true'); }
      if (headerEl) { headerEl.setAttribute('inert', ''); headerEl.setAttribute('aria-hidden', 'true'); }
      if (heroEl) { heroEl.setAttribute('inert', ''); heroEl.setAttribute('aria-hidden', 'true'); }
      triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'true'));
      if (panel) panel.focus();

      // Re-create carousels when the About modal opens (idempotent)
      if (modalId === 'about-modal' && window.ensureAboutCarousels) {
        try { window.ensureAboutCarousels(); } catch (e) { /* non-fatal */ }
      }
    }

    function closeModal() {
      if (modal.dataset.open !== 'true') return;
      // Remove focus from any focused element inside the modal before hiding
      if (document.activeElement && modal.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      panel.classList.remove('open');
      panel.classList.add('close');
      setTimeout(() => {
        modal.setAttribute('hidden', '');
        modal.setAttribute('inert', '');
        delete modal.dataset.open;
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (mainContent) { mainContent.removeAttribute('inert'); mainContent.setAttribute('aria-hidden', 'false'); }
        if (themeSwitch) { themeSwitch.removeAttribute('inert'); themeSwitch.setAttribute('aria-hidden', 'false'); }
        if (headerEl) { headerEl.removeAttribute('inert'); headerEl.setAttribute('aria-hidden', 'false'); }
        if (heroEl) { heroEl.removeAttribute('inert'); heroEl.setAttribute('aria-hidden', 'false'); }
        triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
        if (lastFocusedElement instanceof HTMLElement) {
          lastFocusedElement.focus();
        }

        // Destroy carousels after the About modal fully closes to cleanup timers/listeners
        if (modalId === 'about-modal' && window.destroyAboutCarousels) {
          try { window.destroyAboutCarousels(); } catch (e) { /* non-fatal */ }
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
