// resume-switcher.js: Handle language-specific CV downloads using Fetch API
(function () {
  "use strict";

  console.log("resume-switcher.js loaded");

  // Map languages to CV file paths
  const CV_URLS = {
    en: "/static/PDF/cv_en-us.pdf",
    pt: "/static/PDF/cv_pt-br.pdf",
  };

  // Store current CV URL
  let currentCvUrl = CV_URLS["en"];

  // Function to update CV URL based on current language
  function updateResumeUrl(lang) {
    const validLang = lang && lang in CV_URLS ? lang : "en";
    currentCvUrl = CV_URLS[validLang];
    console.log("✓ CV URL updated to:", currentCvUrl, "(language:", validLang + ")");
  }

  // Function to open CV in new tab (using Fetch API)
  function openCvInNewTab(event) {
    console.log("✓ openCvInNewTab called");

    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    if (!currentCvUrl) {
      console.error("✗ No CV URL set");
      return false;
    }

    console.log("✓ Opening CV in new tab:", currentCvUrl);

    // Use fetch API to get the file
    fetch(currentCvUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
        console.log("✓ Fetch response received");
        return response.blob();
      })
      .then(blob => {
        console.log("✓ Blob created, size:", blob.size, "bytes");

        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        console.log("✓ Blob URL created");

        // Create a temporary anchor element to open in new tab
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.target = '_blank';
        tempLink.rel = 'noopener noreferrer';
        // NOTE: Removed download attribute - we want to OPEN in new tab, not download

        console.log("✓ Clicking link to open in new tab");

        // Append to body, click, and remove
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        // Clean up the blob URL after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
          console.log("✓ Blob URL cleaned up");
        }, 100);

        console.log("✓ CV opened in new tab successfully");
      })
      .catch(error => {
        console.error("✗ Error opening CV:", error);
        // Fallback: try window.open() if fetch fails
        console.log("⚠ Attempting fallback with window.open()");
        const win = window.open(currentCvUrl, '_blank');
        if (!win) {
          console.error("✗ window.open() also failed - popup blocker may be active");
        }
      });

    return false;
  }

  // Detect and set initial language
  function detectCurrentLanguage() {
    // Priority: window.i18n.current > html lang attribute > default
    const lang =
      (window.i18n && window.i18n.current) ||
      document.documentElement.lang ||
      "en";
    console.log("✓ Detected language:", lang);
    return lang;
  }

  const initialLang = detectCurrentLanguage();
  updateResumeUrl(initialLang);
  console.log("✓ Initial CV URL set to:", currentCvUrl);

  // IMMEDIATE: Try to attach click listener to button if it exists
  function attachClickListener() {
    const resumeBtn = document.getElementById("resume-btn");
    if (resumeBtn) {
      console.log("✓ Resume button found, attaching click listener");
      resumeBtn.addEventListener("click", openCvInNewTab);
      return true;
    }
    return false;
  }

  // Try immediately when script loads
  if (!attachClickListener()) {
    console.log("⚠ Resume button not found immediately, waiting for DOM");
    document.addEventListener("DOMContentLoaded", attachClickListener);
  }

  // FALLBACK: Use event delegation on document
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "resume-btn") {
      console.log("✓ Resume button clicked via event delegation");
      openCvInNewTab(e);
    }
  }, true);

  // Listen for language changes via window.i18n.updateAll hook
  if (window.i18n) {
    const originalUpdateAll = window.i18n.updateAll;
    if (originalUpdateAll && typeof originalUpdateAll === "function") {
      window.i18n.updateAll = function (lang, animate = false) {
        console.log("✓ Language change detected:", lang);
        console.log("  OLD CV URL was:", currentCvUrl);

        // Call original updateAll function first
        const result = originalUpdateAll.call(window.i18n, lang, animate);

        // Then update CV URL
        updateResumeUrl(lang);
        console.log("  NEW CV URL is now:", currentCvUrl);

        return result;
      };
      console.log("✓ Language change listener (window.i18n.updateAll) installed");
    } else {
      console.warn("⚠ window.i18n.updateAll not found - language switching may not work");
    }
  } else {
    console.warn("⚠ window.i18n not found - waiting for it to initialize");
  }

  // BONUS: Also listen for changes on the language toggle directly
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("change", function () {
      const newLang = langToggle.checked ? "pt" : "en";
      console.log("✓ Language toggle detected, new language:", newLang);
      updateResumeUrl(newLang);
      console.log("  CV URL is now:", currentCvUrl);
    });
    console.log("✓ Direct language toggle listener installed");
  } else {
    console.warn("⚠ Language toggle not found");
  }
})();


