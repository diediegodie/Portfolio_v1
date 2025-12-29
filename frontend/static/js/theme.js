// Theme toggle script (data-theme version)
// - Uses <html data-theme="dark|light">
// - Persists user choice to localStorage ('theme')
// - Defaults to dark if no preference
document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('theme-toggle');
  const label = document.querySelector('label.ios-toggle') || document.querySelector('label.switch');
  const root = document.documentElement;
  if (!checkbox) return;

  const STORAGE_KEY = 'theme';

  function setLabelState(theme) {
    if (!label) return;
    const isDark = theme === 'dark';
    label.classList.toggle('active', isDark);
    label.classList.toggle('inactive', !isDark);
    label.setAttribute('aria-pressed', String(isDark));
    label.setAttribute('aria-checked', String(isDark));
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    checkbox.checked = theme === 'dark';
    checkbox.setAttribute('aria-checked', String(theme === 'dark'));
    setLabelState(theme);
  }

  // Determine initial theme: localStorage -> default dark
  const stored = localStorage.getItem(STORAGE_KEY);
  const initialTheme = (stored === 'dark' || stored === 'light') ? stored : 'dark';
  applyTheme(initialTheme);

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
