# Theme Management: Default Dark Theme & FOUC Prevention

## Why Default to Dark Theme?
- **User Experience**: Many users prefer dark mode for reduced eye strain, especially at night.
- **Modern Aesthetic**: Dark themes are now a common default for developer and portfolio sites.
- **Consistency**: Ensures a consistent look for first-time visitors and before user preference is set.
- **Default only if no preference**: Dark theme is applied only if the user has not previously selected a theme.

## How Early Injection Prevents FOUC
- **FOUC (Flash of Unstyled Content)**: Occurs when the browser loads the page with default (light) styles before the dark theme is applied, causing a white flash.
- **Solution**: An inline script in the `<head>` sets the `data-theme` attribute on `<html>` **before** any CSS loads. This ensures the correct theme is applied from the very first paint.

### Example Implementation
```html
<script>
  (function() {
    try {
      var savedTheme = localStorage.getItem('theme');
      var theme = savedTheme ? savedTheme : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

- This script runs before CSS, so the correct theme variables are used immediately.

## User Preference & Toggle Persistence
- If a user has previously selected a theme, it is stored in `localStorage` as `theme`.
- On subsequent visits, the script reads this value and applies the user's preference.
- If no preference is found, dark theme is used by default.
- The theme toggle button updates both the DOM and localStorage, so user choice persists across reloads.

### Example Toggle Logic
```js
const checkbox = document.getElementById('theme-toggle');
const root = document.documentElement;
const STORAGE_KEY = 'theme';

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  checkbox.checked = theme === 'dark';
}

// Initial load
const stored = localStorage.getItem(STORAGE_KEY);
const initialTheme = (stored === 'dark' || stored === 'light') ? stored : 'dark';
applyTheme(initialTheme);

checkbox.addEventListener('change', () => {
  const theme = checkbox.checked ? 'dark' : 'light';
  applyTheme(theme);
  localStorage.setItem(STORAGE_KEY, theme);
});
```

## CSS Strategy
- Theme variables are set using attribute selectors:

```css
html[data-theme='dark'] { /* ...dark variables... */ }
html[data-theme='light'] { /* ...light variables... */ }
```

- All theme-dependent styles reference these variables, ensuring instant theme switching and no FOUC.

---

**References:**
- [MDN: Avoiding a Flash of Unstyled Content (FOUC)](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work#avoiding_fouc)
- [W3C: User Preferences for Color Schemes](https://www.w3.org/TR/css-color-adjust-1/#color-scheme-prop)
