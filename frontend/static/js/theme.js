// Theme toggle script
// - Toggles `light-theme` / `dark-theme` on <body>
// - Persists choice to localStorage
// - Falls back to prefers-color-scheme when no preference stored
document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('theme-toggle');
  // Prefer the new iOS-style toggle, then pill, then generic switch
  const label = document.querySelector('label.ios-toggle') || document.querySelector('label.pill-toggle') || document.querySelector('label.switch');
  const root = document.documentElement;
  if (!checkbox) return;

  const STORAGE_KEY = 'site-theme';

  function setLabelState(theme) {
    if (!label) return;
    const isDark = theme === 'dark';
    label.classList.toggle('active', isDark);
    label.classList.toggle('inactive', !isDark);
    // Keep both aria-pressed and aria-checked for wider AT support
    label.setAttribute('aria-pressed', String(isDark));
    label.setAttribute('aria-checked', String(isDark));
  }

  function applyTheme(theme) {
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(theme + '-theme');
    checkbox.checked = theme === 'dark';
    checkbox.setAttribute('aria-checked', String(theme === 'dark'));
    setLabelState(theme);
  }

  // Determine initial theme: localStorage -> media query -> default light
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  checkbox.addEventListener('change', () => {
    const theme = checkbox.checked ? 'dark' : 'light';
    applyTheme(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
  });

  // Accessibility: allow toggling with Enter/Space on the visible label
  if (label) {
    label.setAttribute('tabindex', '0');
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  }
});
