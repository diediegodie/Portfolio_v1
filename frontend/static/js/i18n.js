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

  // Helper: Check if currently on home page
  function isHomePageVisible() {
    return document.getElementById('home-main') !== null;
  }

  // Helper: Cancel any in-progress animations
  let currentAnimationPromise = null;
  function cancelRunningAnimations() {
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

    // Determine if we should animate
    const shouldAnimate = animate && isHomePageVisible();

    if (shouldAnimate) {
      // Cancel any running animation
      cancelRunningAnimations();

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

      // Start animation
      currentAnimationPromise = TextScramble.animateMultiple(
        elementsToAnimate,
        {
          characterSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          easing: 'easeOut',
          staggerDelay: 80  // Slight cascade effect
        }
      ).then(() => {
        // After animation, update non-animated elements on home page
        updateNonAnimatedElements(lang);
        // Update all attribute elements (modals, etc.)
        updateAttributeElements(lang);
        // Update metadata
        updateMetadata(lang);
      });
    } else {
      // Standard update (used for modals, theme toggle, etc.)
      updateAllElements(lang);
      updateAttributeElements(lang);
      updateMetadata(lang);
    }
  };

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
