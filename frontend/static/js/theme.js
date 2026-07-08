// Theme toggle script (data-theme version)
// - Uses <html data-theme="dark|light">
// - Persists user choice to localStorage ('theme')
// - Defaults to dark if no preference
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;
  if (!toggleBtn) return;

  function resolveKey(dct, dottedKey) {
    if (!dct || !dottedKey) return undefined;
    if (Object.prototype.hasOwnProperty.call(dct, dottedKey))
      return dct[dottedKey];
    const parts = dottedKey.split(".");
    let cur = dct;
    for (let i = 0; i < parts.length; i++) {
      if (!cur || typeof cur !== "object" || !(parts[i] in cur))
        return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function t(key, fallback = "") {
    const cache = (window.i18n && window.i18n.cache) || {};
    const lang =
      (window.i18n && window.i18n.current) ||
      document.documentElement.lang ||
      "en";
    const primary = resolveKey(cache[lang], key);
    if (typeof primary === "string" && primary) return primary;
    const enValue = resolveKey(cache.en, key);
    if (typeof enValue === "string" && enValue) return enValue;
    const altLang = lang === "en" ? "pt" : "en";
    const altValue = resolveKey(cache[altLang], key);
    if (typeof altValue === "string" && altValue) return altValue;
    return fallback;
  }

  function updateButtonLabel(theme) {
    // Invert logic: dark = active, light = inactive
    toggleBtn.textContent =
      theme === "dark" ? t("theme.dark_active") : t("theme.light_active");
    toggleBtn.classList.toggle("active", theme === "dark");
    toggleBtn.classList.toggle("inactive", theme === "light");
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* ignore */
    }
    updateButtonLabel(theme);
  }

  // Initialize on page load
  const savedTheme = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", savedTheme);
  updateButtonLabel(savedTheme);

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  toggle.checked = savedTheme === "dark";

  toggle.addEventListener("change", () => {
    const next = toggle.checked ? "dark" : "light";
    applyTheme(next);
  });
});
