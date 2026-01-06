// work.js: initialize modal using shared modal.js
window.initModal && window.initModal({
  modalId: 'work-modal',
  triggerAttr: 'data-work-trigger',
  overlayAttr: 'data-work-overlay',
  closeAttr: 'data-work-close'
});

// work images: enable in-card carousel navigation and a clickable lightbox with side navigation
(function () {
  function initWorkImages() {
    const cards = Array.from(document.querySelectorAll('.work-card'));
    if (!cards.length) return;

    // Create a lightbox element (single instance)
    let lightbox = null;
    function createLightbox() {
      if (lightbox) return lightbox;
      lightbox = document.createElement('div');
      lightbox.className = 'image-lightbox';
      lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:10000;';
      lightbox.innerHTML = `
        <button class="modal-close lightbox-close" type="button" aria-label="Close" style="position:absolute;top:16px;right:16px;background:transparent;border:none;">
          <svg class="modal-close__icon" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="8" x2="24" y2="24" />
            <line x1="24" y1="8" x2="8" y2="24" />
          </svg>
        </button>
        <button class="lightbox-prev" aria-label="Previous" style="position:absolute;left:8px;background:transparent;border:none;color:currentColor;font-size:48px;">‹</button>
        <img class="lightbox-img" src="" alt="" style="max-width:95%;max-height:90%;box-shadow:0 10px 30px rgba(0,0,0,0.5);" />
        <button class="lightbox-next" aria-label="Next" style="position:absolute;right:8px;background:transparent;border:none;color:currentColor;font-size:48px;">›</button>
      `;
      document.body.appendChild(lightbox);

      const imgEl = lightbox.querySelector('.lightbox-img');
      const btnClose = lightbox.querySelector('.lightbox-close');
      const btnPrev = lightbox.querySelector('.lightbox-prev');
      const btnNext = lightbox.querySelector('.lightbox-next');

      let currentImages = [];
      let currentIndex = 0;

      function show(idx) {
        if (!currentImages.length) return;
        currentIndex = ((idx % currentImages.length) + currentImages.length) % currentImages.length;
        imgEl.src = '/static/images/' + currentImages[currentIndex];
        imgEl.alt = currentImages[currentIndex] || '';
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
      function hide() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }

      btnClose.addEventListener('click', hide);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hide(); });
      btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(currentIndex - 1); });
      btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(currentIndex + 1); });

      document.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.style.display === 'none') return;
        if (e.key === 'Escape') hide();
        if (e.key === 'ArrowLeft') show(currentIndex - 1);
        if (e.key === 'ArrowRight') show(currentIndex + 1);
      });

      return {
        open: (images, idx) => { currentImages = images || []; show(idx || 0); },
        close: hide
      };
    }

    const lb = createLightbox();

    cards.forEach((card) => {
      const raw = card.getAttribute('data-images') || '[]';
      let images;
      try { images = JSON.parse(raw); } catch (e) { images = []; }
      const imgEl = card.querySelector('.work-card__img');
      const prevBtn = card.querySelector('.image-prev');
      const nextBtn = card.querySelector('.image-next');
      if (!imgEl || !images.length) return;
      let idx = 0;
      let pendingFadeTimeout = null;

      function update() {
        const nextSrc = '/static/images/' + images[idx];
        // If no current src rendered by template, just set it without animation
        const currentSrc = imgEl.getAttribute('src') || imgEl.src || '';
        if (!currentSrc) {
          imgEl.src = nextSrc;
          imgEl.setAttribute('data-current-index', idx);
          return;
        }
        if (imgEl.src.endsWith(nextSrc)) { imgEl.setAttribute('data-current-index', idx); return; }

        // Preload the next image in an off-DOM Image element
        const preloader = new Image();
        preloader.onload = () => {
          clearTimeout(pendingFadeTimeout);
          // Start fade-out
          imgEl.classList.add('is-fading');
          // Wait for fade-out to complete, then swap src and fade back in
          pendingFadeTimeout = setTimeout(() => {
            imgEl.src = nextSrc;
            imgEl.setAttribute('data-current-index', idx);
            // Remove fading class to trigger fade-in
            imgEl.classList.remove('is-fading');
          }, 220);
        };
        preloader.onerror = () => {
          clearTimeout(pendingFadeTimeout);
          // Even on error, try to animate the swap
          imgEl.classList.add('is-fading');
          pendingFadeTimeout = setTimeout(() => {
            imgEl.src = nextSrc;
            imgEl.setAttribute('data-current-index', idx);
            imgEl.classList.remove('is-fading');
          }, 220);
        };
        // Start the preload
        preloader.src = nextSrc;
      }
      // initialize image (in case template rendered a different first image)
      update();
      if (images.length > 1) {
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); idx = (idx - 1 + images.length) % images.length; update(); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); idx = (idx + 1) % images.length; update(); });
      } else {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
      }

      imgEl.addEventListener('click', (e) => { e.stopPropagation(); lb.open(images, idx); });
      imgEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lb.open(images, idx); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkImages);
  } else {
    initWorkImages();
  }
})();
