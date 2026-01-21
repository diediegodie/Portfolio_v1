// Theme toggle script (data-theme version)
// - Uses <html data-theme="dark|light">
// - Persists user choice to localStorage ('theme')
// - Defaults to dark if no preference
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  if (!toggleBtn) return;

  function updateButtonLabel(theme) {
    // Invert logic: dark = active, light = inactive
    toggleBtn.textContent = theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)';
    toggleBtn.classList.toggle('active', theme === 'dark');
    toggleBtn.classList.toggle('inactive', theme === 'light');
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
    updateButtonLabel(theme);
  }

  // Initialize on page load
  const savedTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateButtonLabel(savedTheme);

  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.checked = (savedTheme === 'dark');

  toggle.addEventListener('change', () => {
    const next = toggle.checked ? 'dark' : 'light';
    applyTheme(next);
  });
});
