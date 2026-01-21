// i18n-init.js: Initialize translation cache from server-rendered data
// This file must be loaded BEFORE i18n.js
// Data is injected via data attributes on the html element

(function() {
  'use strict';

  // Initialize namespace
  window.i18n = window.i18n || {};

  // Get translations from data attributes
  const html = document.documentElement;
  const enData = html.getAttribute('data-i18n-en');
  const ptData = html.getAttribute('data-i18n-pt');
  const currentLang = html.getAttribute('lang') || html.getAttribute('data-i18n-current') || 'en';

  // Parse and cache translations
  try {
    window.i18n.cache = {
      en: enData ? JSON.parse(enData) : {},
      pt: ptData ? JSON.parse(ptData) : {}
    };
    window.i18n.current = currentLang;
  } catch (e) {
    console.error('Failed to initialize i18n cache:', e);
    window.i18n.cache = { en: {}, pt: {} };
    window.i18n.current = 'en';
  }
})();
