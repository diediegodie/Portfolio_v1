// about.js: initialize modal using shared modal.js
// Store carousel initialization function to be called when modal opens
window.initAboutCarousel = function() {
  const modal = document.getElementById('about-modal');
  if (!modal || modal.dataset.carouselInitialized === 'true') return;
  
  // Mark as initialized to prevent duplicate initialization
  modal.dataset.carouselInitialized = 'true';

  const galleries = Array.from(modal.querySelectorAll('.about-card .stack-gallery'));
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const viewport = gallery.querySelector('.stack-gallery__viewport');
    const track = gallery.querySelector('.stack-gallery__track');
    const prevBtn = gallery.querySelector('.stack-nav--prev');
    const nextBtn = gallery.querySelector('.stack-nav--next');
    
    if (!viewport || !track || !prevBtn || !nextBtn) return;
    
    // Skip if already initialized
    if (gallery.dataset.initialized === 'true') return;
    gallery.dataset.initialized = 'true';

    // Parse stack items from data attribute
    let items = [];
    try {
      items = JSON.parse(track.getAttribute('data-stack-items') || '[]');
    } catch (e) {
      console.error('Failed to parse stack items:', e);
      return;
    }

    if (!items.length) return;

    let currentIndex = 0;
    const ITEM_WIDTH = 180;
    const GAP = 16;
    const ITEM_STEP = ITEM_WIDTH + GAP; // 196px

    // Render all stack items
    function render() {
      track.innerHTML = items.map((item) => `
        <div class="stack-item">
          <div class="stack-item__icon">
            <svg viewBox="${item.viewBox}" aria-hidden="true" focusable="false">
              <use href="/static/icons/stack-sprite.svg#${item.icon}"></use>
            </svg>
          </div>
          <div class="stack-item__label">${item.label}</div>
        </div>
      `).join('');

      // Force reflow to apply render
      viewport.offsetWidth;
      update();
    }

    function update() {
      const itemElements = Array.from(track.querySelectorAll('.stack-item'));
      
      // Get viewport width for centering calculation
      const viewportWidth = viewport.offsetWidth;
      
      // Calculate offset to center the item at currentIndex in the viewport
      // Formula: position of item[currentIndex] center minus viewport center
      const itemPositionInTrack = currentIndex * ITEM_STEP;
      const itemCenterInTrack = itemPositionInTrack + (ITEM_WIDTH / 2);
      const viewportCenter = viewportWidth / 2;
      const offset = viewportCenter - itemCenterInTrack;
      
      track.style.transform = `translateX(${offset}px)`;

      // Update active states: center, left, right
      itemElements.forEach((el, idx) => {
        el.classList.remove('stack-item--center', 'stack-item--left', 'stack-item--right');
        
        if (idx === currentIndex) {
          el.classList.add('stack-item--center');
        } else if (idx === (currentIndex - 1 + items.length) % items.length) {
          el.classList.add('stack-item--left');
        } else if (idx === (currentIndex + 1) % items.length) {
          el.classList.add('stack-item--right');
        }
      });
    }

    function prev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      update();
    }

    function next() {
      currentIndex = (currentIndex + 1) % items.length;
      update();
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal || !modal.dataset.open || modal.dataset.open !== 'true') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    });

    // Initial render
    render();
  });
};

// Hook into modal initialization
window.initModal && window.initModal({
  modalId: 'about-modal',
  triggerAttr: 'data-about-trigger',
  overlayAttr: 'data-about-overlay',
  closeAttr: 'data-about-close'
});

// Initialize carousel after modal opens (use MutationObserver to detect when modal becomes visible)
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('about-modal');
  if (!modal) return;
  
  // Listen for when the modal opens (data-open attribute)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-open') {
        if (modal.dataset.open === 'true') {
          // Modal just opened, initialize carousel
          window.setTimeout(() => {
            window.initAboutCarousel && window.initAboutCarousel();
          }, 50);
        }
      }
    });
  });
  
  observer.observe(modal, { attributes: true });
});
