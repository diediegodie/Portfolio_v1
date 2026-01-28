// i18n.js: Language toggle + client-side updateAll
document.addEventListener('DOMContentLoaded', function() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;

  const currentLang = (window.i18n && window.i18n.current) ? window.i18n.current : (document.documentElement.lang || 'en');
  langToggle.checked = (currentLang === 'pt');
  langToggle.setAttribute('aria-checked', langToggle.checked ? 'true' : 'false');

  // Configuration for animated elements (home page only)
  const ANIMATED_HOME_ELEMENTS = [
    { key: 'home.name', duration: 1000 },
    { key: 'home.role', duration: 1000 },
    { key: 'home.location', duration: 1000 },
    { key: 'buttons.work', duration: 1000 },
    { key: 'buttons.about', duration: 1000 },
    { key: 'buttons.contact', duration: 1000 }
  ];

  // Helper: Check if currently on home page (visible)
  function isHomePageVisible() {
    const el = document.getElementById('home-main');
    if (!el) return false;
    // If main content is marked inert (modal open) or hidden, treat as not visible
    if (el.hasAttribute && el.hasAttribute('inert')) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
  }

  // Helper: Cancel any in-progress animations (supports AbortController)
  let currentAnimationPromise = null;
  let currentAnimationController = null;
  function cancelRunningAnimations() {
    // Abort any in-progress scramble animation using AbortController to stop rAF loops
    if (currentAnimationController) {
      try { currentAnimationController.abort(); } catch (e) { /* ignore */ }
      currentAnimationController = null;
    }
    currentAnimationPromise = null;
  }

  // Update all elements with data-i18n and data-i18n-attr
  window.i18n = window.i18n || {};

  // Helper function: resolve nested key in dict
  function resolveKey(dct, dottedKey) {
    if (!dct || !dottedKey) return undefined;
    // direct property (flat mapping) short-circuit
    if (Object.prototype.hasOwnProperty.call(dct, dottedKey)) return dct[dottedKey];
    const parts = dottedKey.split('.');
    let cur = dct;
    for (let i = 0; i < parts.length; i++) {
      if (typeof cur !== 'object' || cur === null || !(parts[i] in cur)) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  // Update non-animated elements on home page
  function updateNonAnimatedElements(lang) {
    const dict = (window.i18n.cache && window.i18n.cache[lang]) ? window.i18n.cache[lang] : {};
    const animatedKeys = ANIMATED_HOME_ELEMENTS.map(c => c.key);

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      // Skip already animated elements
      if (animatedKeys.includes(key)) return;
      
      const val = resolveKey(dict, key);
      if (val === undefined) return;
      const fallback = el.getAttribute('data-i18n-fallback') || '';
      const final = (typeof val === 'string') ? val.replace('{0}', fallback) : val;
      el.textContent = final;
    });
  }

  // Update all elements with data-i18n attributes
  function updateAllElements(lang) {
    const dict = (window.i18n.cache && window.i18n.cache[lang]) ? window.i18n.cache[lang] : {};

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const val = resolveKey(dict, key);
      if (val === undefined) return;
      const fallback = el.getAttribute('data-i18n-fallback') || '';
      const final = (typeof val === 'string') ? val.replace('{0}', fallback) : val;
      el.textContent = final;
    });
  }

  // Update all elements with data-i18n-attr attributes
  function updateAttributeElements(lang) {
    const dict = (window.i18n.cache && window.i18n.cache[lang]) ? window.i18n.cache[lang] : {};

    document.querySelectorAll('[data-i18n-attr]').forEach(function(el) {
      const map = el.getAttribute('data-i18n-attr');
      if (!map) return;
      // support multiple mappings separated by ';' like "aria-label:modal.close;title:foo"
      map.split(';').forEach(function(pair) {
        const parts = pair.split(':');
        if (parts.length < 2) return;
        const attr = parts[0].trim();
        const key = parts.slice(1).join(':').trim();
        const val = resolveKey(dict, key);
        if (val === undefined) return;
        const fallback = el.getAttribute('data-i18n-fallback') || '';
        // replace placeholder {0} with fallback if present
        const final = (typeof val === 'string') ? val.replace('{0}', fallback) : val;
        el.setAttribute(attr, final);
      });
    });
  }

  // Update metadata and language labels
  function updateMetadata(lang) {
    document.documentElement.lang = lang;
    window.i18n.current = lang;
    const lt = document.getElementById('lang-toggle');
    if (lt) lt.setAttribute('aria-checked', lt.checked ? 'true' : 'false');

    // Ensure language label visibility is set from JS (robust against varied html@lang values)
    try {
      document.querySelectorAll('.lang-label').forEach(el => { el.style.display = 'none'; });
      const activeLabel = document.querySelector('.lang-label.' + lang);
      if (activeLabel) activeLabel.style.display = 'inline-block';
    } catch (e) {
      // non-critical: do not break i18n if DOM shape differs
      console.debug('i18n: failed to toggle language labels (non-critical)', e);
    }
  }

  // Main updateAll function with optional animation support
  window.i18n.updateAll = function(lang, animate = false) {
    const dict = (window.i18n.cache && window.i18n.cache[lang]) ? window.i18n.cache[lang] : {};

    // Determine if we should animate: only if caller requested animation, home is visible/in-focus, and page is visible
    const shouldAnimate = animate && isHomePageVisible() && (typeof document !== 'undefined' ? document.visibilityState === 'visible' : true);

    // Cancel any previous animation runs (this will abort running rAF loops)
    cancelRunningAnimations();

    if (shouldAnimate) {
      // Prepare animated elements
      const elementsToAnimate = [];

      ANIMATED_HOME_ELEMENTS.forEach(config => {
        const element = document.querySelector(`[data-i18n="${config.key}"]`);
        if (element) {
          const finalText = resolveKey(dict, config.key) || '';
          elementsToAnimate.push({
            element: element,
            text: finalText,
            duration: config.duration
          });
        }
      });

      // Create a controller so we can abort these animations if needed
      try {
        currentAnimationController = new AbortController();
        const signal = currentAnimationController.signal;

        // Start cancellable animation; pass signal to TextScramble
        currentAnimationPromise = TextScramble.animateMultiple(
          elementsToAnimate,
          {
            characterSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            easing: 'easeOut',
            staggerDelay: 80,
            signal
          }
        ).then(() => {
          // Clear controller once finished
          currentAnimationController = null;
          // After animation completes, update non-animated and attribute elements and metadata
          updateNonAnimatedElements(lang);
          updateAttributeElements(lang);
          updateMetadata(lang);
        }).catch(() => {
          // On unexpected error, ensure controller cleared and fallback to non-animated update path
          currentAnimationController = null;
          updateNonAnimatedElements(lang);
          updateAttributeElements(lang);
          updateMetadata(lang);
        });
      } catch (e) {
        // Fallback: if AbortController unsupported or any runtime error, fall back to non-cancellable animation
        currentAnimationController = null;
        cancelRunningAnimations();
        updateAllElements(lang);
        updateAttributeElements(lang);
        updateMetadata(lang);
      }
    } else {
      // Standard update (used for modals, theme toggle, etc.)
      updateAllElements(lang);
      updateAttributeElements(lang);
      updateMetadata(lang);
    }
  };

  /* Expose cancellation on window.i18n so other modules (like modal) can explicitly stop scrambles */
  window.i18n.cancelRunningAnimations = cancelRunningAnimations;

  // initial run
  window.i18n.updateAll(currentLang);

  langToggle.addEventListener('change', function() {
    const nextLang = langToggle.checked ? 'pt' : 'en';
    // update UI with animation on home page
    window.i18n.updateAll(nextLang, true);
    // persist choice server-side but don't reload
    fetch(`/set_language/${nextLang}`, {method: 'POST', credentials: 'same-origin'}).catch(function(){});
    langToggle.setAttribute('aria-checked', langToggle.checked ? 'true' : 'false');
  });
});
