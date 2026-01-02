// i18n.js: Language toggle + client-side updateAll
document.addEventListener('DOMContentLoaded', function() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;

  const currentLang = (window.i18n && window.i18n.current) ? window.i18n.current : (document.documentElement.lang || 'en');
  langToggle.checked = (currentLang === 'pt');
  langToggle.setAttribute('aria-checked', langToggle.checked ? 'true' : 'false');

  // Update all elements with data-i18n and data-i18n-attr
  window.i18n = window.i18n || {};
  window.i18n.updateAll = function(lang) {
    const dict = (window.i18n.cache && window.i18n.cache[lang]) ? window.i18n.cache[lang] : {};

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const val = dict[key];
      if (val === undefined) return;
      const fallback = el.getAttribute('data-i18n-fallback') || '';
      const final = (typeof val === 'string') ? val.replace('{0}', fallback) : val;
      el.textContent = final;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function(el) {
      const map = el.getAttribute('data-i18n-attr');
      if (!map) return;
      // support multiple mappings separated by ';' like "aria-label:modal.close;title:foo"
      map.split(';').forEach(function(pair) {
        const parts = pair.split(':');
        if (parts.length < 2) return;
        const attr = parts[0].trim();
        const key = parts.slice(1).join(':').trim();
        const val = dict[key];
        if (val === undefined) return;
        const fallback = el.getAttribute('data-i18n-fallback') || '';
        // replace placeholder {0} with fallback if present
        const final = (typeof val === 'string') ? val.replace('{0}', fallback) : val;
        el.setAttribute(attr, final);
      });
    });

    // update document language marker
    document.documentElement.lang = lang;
    window.i18n.current = lang;
    const lt = document.getElementById('lang-toggle');
    if (lt) lt.setAttribute('aria-checked', lt.checked ? 'true' : 'false');
  };

  // initial run
  window.i18n.updateAll(currentLang);

  langToggle.addEventListener('change', function() {
    const nextLang = langToggle.checked ? 'pt' : 'en';
    // update UI instantly
    window.i18n.updateAll(nextLang);
    // persist choice server-side but don't reload
    fetch(`/set_language/${nextLang}`, {method: 'POST', credentials: 'same-origin'}).catch(function(){});
    langToggle.setAttribute('aria-checked', langToggle.checked ? 'true' : 'false');
  });
});
