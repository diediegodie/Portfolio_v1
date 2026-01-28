// work.js: initialize modal using shared modal.js
window.initModal &&
  window.initModal({
    modalId: "work-modal",
    triggerAttr: "data-work-trigger",
    overlayAttr: "data-work-overlay",
    closeAttr: "data-work-close",
  });

// work images: enable in-card carousel navigation and a clickable lightbox with side navigation
(function () {
  function initWorkImages() {
    const cards = Array.from(document.querySelectorAll(".work-card"));
    if (!cards.length) return;

    // Create a lightbox element (single instance)
    let lightbox = null;
    function createLightbox() {
      if (lightbox) return lightbox;
      lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `
        <button class="modal-close lightbox-close lightbox__close" type="button" aria-label="Close">
          <svg class="modal-close__icon" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="8" x2="24" y2="24" />
            <line x1="24" y1="8" x2="8" y2="24" />
          </svg>
        </button>
        <button class="image-nav image-prev lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous"><span class="icon">‹</span></button>
        <img class="lightbox-img lightbox__image" src="" alt="" />
        <button class="image-nav image-next lightbox__nav lightbox__nav--next" type="button" aria-label="Next"><span class="icon">›</span></button>
      `;
      document.body.appendChild(lightbox);

      const imgEl = lightbox.querySelector(".lightbox-img");
      const btnClose = lightbox.querySelector(".lightbox-close");
      const btnPrev = lightbox.querySelector(".image-prev");
      const btnNext = lightbox.querySelector(".image-next");

      let currentImages = [];
      let currentIndex = 0;

      function show(idx) {
        if (!currentImages.length) return;
        currentIndex =
          ((idx % currentImages.length) + currentImages.length) %
          currentImages.length;
        imgEl.src = "/static/images/" + currentImages[currentIndex];
        imgEl.alt = currentImages[currentIndex] || "";
        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden";
      }
      function hide() {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
      }

      if (btnClose) btnClose.addEventListener("click", hide);
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) hide();
      });
      if (btnPrev)
        btnPrev.addEventListener("click", (e) => {
          e.stopPropagation();
          show(currentIndex - 1);
        });
      if (btnNext)
        btnNext.addEventListener("click", (e) => {
          e.stopPropagation();
          show(currentIndex + 1);
        });

      document.addEventListener("keydown", (e) => {
        if (!lightbox || lightbox.style.display === "none") return;
        if (e.key === "Escape") hide();
        if (e.key === "ArrowLeft") show(currentIndex - 1);
        if (e.key === "ArrowRight") show(currentIndex + 1);
      });

      return {
        open: (images, idx) => {
          currentImages = images || [];
          show(idx || 0);
        },
        close: hide,
      };
    }

    const lb = createLightbox();

    cards.forEach((card) => {
      const raw = card.getAttribute("data-images") || "[]";
      let images;
      try {
        images = JSON.parse(raw);
      } catch (e) {
        images = [];
      }
      const imgEl = card.querySelector(".work-card__img");
      const prevBtn = card.querySelector(".image-prev");
      const nextBtn = card.querySelector(".image-next");
      if (!imgEl || !images.length) return;
      let idx = 0;
      let pendingFadeTimeout = null;

      function update() {
        const nextSrc = "/static/images/" + images[idx];
        // If no current src rendered by template, just set it without animation
        const currentSrc = imgEl.getAttribute("src") || imgEl.src || "";
        if (!currentSrc) {
          imgEl.src = nextSrc;
          imgEl.setAttribute("data-current-index", idx);
          return;
        }
        if (imgEl.src.endsWith(nextSrc)) {
          imgEl.setAttribute("data-current-index", idx);
          return;
        }

        // Preload the next image in an off-DOM Image element
        const preloader = new Image();
        preloader.onload = () => {
          clearTimeout(pendingFadeTimeout);
          // Start fade-out
          imgEl.classList.add("is-fading");
          // Wait for fade-out to complete, then swap src and fade back in
          pendingFadeTimeout = setTimeout(() => {
            imgEl.src = nextSrc;
            imgEl.setAttribute("data-current-index", idx);
            // Remove fading class to trigger fade-in
            imgEl.classList.remove("is-fading");
          }, 220);
        };
        preloader.onerror = () => {
          clearTimeout(pendingFadeTimeout);
          // Even on error, try to animate the swap
          imgEl.classList.add("is-fading");
          pendingFadeTimeout = setTimeout(() => {
            imgEl.src = nextSrc;
            imgEl.setAttribute("data-current-index", idx);
            imgEl.classList.remove("is-fading");
          }, 220);
        };
        // Start the preload
        preloader.src = nextSrc;
      }
      // initialize image (in case template rendered a different first image)
      update();
      if (images.length > 1) {
        if (prevBtn)
          prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            idx = (idx - 1 + images.length) % images.length;
            update();
          });
        if (nextBtn)
          nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            idx = (idx + 1) % images.length;
            update();
          });
      } else {
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
      }

      imgEl.addEventListener("click", (e) => {
        e.stopPropagation();
        lb.open(images, idx);
      });
      imgEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          lb.open(images, idx);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWorkImages);
  } else {
    initWorkImages();
  }
})();

// Readme toggle: expand/collapse readme content inside each work card
(function () {
  function initReadmeToggles() {
    const buttons = Array.from(document.querySelectorAll(".readme-toggle"));
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        const card = btn.closest(".work-card");
        if (!card) return;
        const target = card.querySelector(".card-readme");
        if (!target) return;
        if (expanded) {
          target.hidden = true;
        } else {
          target.hidden = false;
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReadmeToggles);
  } else {
    initReadmeToggles();
  }
})();

// About button: fetch rendered README.md from GitHub and show in floating panel
(function () {
  const cache = new Map();

  function parseOwnerRepo(url) {
    try {
      const u = new URL(url);
      // expect github.com/{owner}/{repo}
      const parts = u.pathname.replace(/^\//, "").split("/");
      if (parts.length >= 2)
        return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
    } catch (e) {}
    return null;
  }

  function createPanel() {
    let panel = document.querySelector(".project-readme-float");
    if (panel) return panel;
    panel = document.createElement("div");
    // make the README float use the same overlay layout as the image lightbox
    panel.className = "project-readme-float image-lightbox";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    // match lightbox inline layout so the close button sits on the dark backdrop
    panel.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:10000;";
    panel.innerHTML = `
        <button class="modal-close lightbox-close readme-panel__close" type="button" aria-label="Close">
          <svg class="modal-close__icon" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="8" x2="24" y2="24" />
            <line x1="24" y1="8" x2="8" y2="24" />
          </svg>
        </button>
        <div class="project-readme__panel" style="max-width:min(1000px,94vw);max-height:calc(100vh - 80px);overflow:auto;border-radius:var(--radius-md);padding:var(--spacing-md);box-shadow:var(--shadow-sm);background:var(--bg-color);color:var(--text-color);">
          <div class="project-readme__content">Loading...</div>
        </div>
      `;
    document.body.appendChild(panel);

    const close = panel.querySelector(".modal-close");
    function hide() {
      panel.style.display = "none";
      document.body.style.overflow = "";
      panel.querySelector(".project-readme__content").innerHTML = "";
    }
    // clicking outside the panel (on the overlay) should close
    panel.addEventListener("click", (e) => {
      if (e.target === panel) hide();
    });
    if (close) close.addEventListener("click", hide);
    document.addEventListener("keydown", (e) => {
      if (panel.style.display === "none") return;
      if (e.key === "Escape") hide();
    });
    return panel;
  }

  async function fetchReadmeHtml(owner, repo) {
    const key = `${owner}/${repo}`;
    if (cache.has(key)) return cache.get(key);
    const api = `https://api.github.com/repos/${owner}/${repo}/readme`;
    try {
      const resp = await fetch(api, {
        headers: { Accept: "application/vnd.github.v3.html" },
      });
      if (!resp.ok) throw new Error("Failed to fetch README");
      const html = await resp.text();
      cache.set(key, html);
      return html;
    } catch (e) {
      cache.set(key, `<p>Unable to load README: ${e.message}</p>`);
      return cache.get(key);
    }
  }

  function initAboutButtons() {
    const buttons = Array.from(document.querySelectorAll(".about-btn"));
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const card = btn.closest(".work-card");
        if (!card) return;
        const githubUrl = card.getAttribute("data-github-url") || "";
        const parsed = parseOwnerRepo(githubUrl);
        const panel = createPanel();
        const content = panel.querySelector(".project-readme__content");
        panel.style.display = "flex";
        document.body.style.overflow = "hidden";
        content.innerHTML = "<p>Loading README…</p>";
        if (!parsed) {
          content.innerHTML = "<p>Invalid GitHub URL</p>";
          return;
        }
        const html = await fetchReadmeHtml(parsed.owner, parsed.repo);
        content.innerHTML = html || "<p>No README found.</p>";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAboutButtons);
  } else {
    initAboutButtons();
  }
})();
