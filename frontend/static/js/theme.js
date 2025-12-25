// Theme toggle logic for home page
// Expects #theme-icon and .light-theme/.dark-theme on <body>

document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('theme-toggle');
  const body = document.body;

  // Default theme
  if (!body.classList.contains('light-theme') && !body.classList.contains('dark-theme')) {
    body.classList.add('light-theme');
  }

  // Initialize checkbox state from current theme
  checkbox.checked = body.classList.contains('dark-theme');

  // Toggle on change
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  });

  // Keyboard support on label (Enter/Space)
  const label = document.querySelector('label.switch');
  label.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
});
