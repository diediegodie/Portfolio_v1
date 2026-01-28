/**
 * Tech Stack Carousel
 * Displays technology icons in a center-focused horizontal carousel
 * Features: auto-scroll, manual navigation, pause on hover
 */

class TechCarousel {
  constructor(carouselSelector, icons, options = {}) {
    // Configuration
    this.carouselSelector = carouselSelector;
    this.icons = icons;
    this.originalCount = icons.length; // number of original icons
    this.currentIndex = 0; // will be set to originalCount in init
    this.autoScrollInterval = options.autoScrollInterval || 3000;
    this.isAutoScrolling = false;
    this.intervalId = null;

    // DOM elements (will be set in init)
    this.carousel = null;
    this.track = null;
    this.dotsContainer = null;
    this.navLeft = null;
    this.navRight = null;
    this.viewport = null;

    // Dimensions (calculated dynamically)
    this.iconWidth = 100; // Base size, matches CSS
    this.gap = 44; // Matches CSS gap
    // Transition / state
    this.isTransitioning = false;
    this.trackTransition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

    // Initialize
    this.init();
  }

  init() {
    // Get DOM references
    this.carousel = document.querySelector(this.carouselSelector);
    if (!this.carousel) {
      console.error(`Carousel not found: ${this.carouselSelector}`);
      return;
    }

    this.track = this.carousel.querySelector('[data-carousel-track]');
    this.dotsContainer = this.carousel.querySelector('[data-carousel-dots]');
    this.viewport = this.carousel.querySelector('.tech-carousel-viewport');
    this.navLeft = this.carousel.querySelector('.carousel-nav-left');
    this.navRight = this.carousel.querySelector('.carousel-nav-right');

    // Dots container is optional (hidden via CSS)
    if (!this.track || !this.viewport) {
      console.error('Required carousel elements not found');
      return;
    }

    // Generate icons into a 3x track: [tail clones] + [originals] + [head clones]
    this.generateIcons();

    // Listen for transform transition ends to detect when we crossed into clones
    this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this));

    // Set up event listeners
    this.attachEventListeners();

    // Calculate dimensions
    this.updateDimensions();

    // Warm image cache for clones (non-blocking)
    if (typeof this.preloadImages === 'function') {
      this.preloadImages().catch(() => {});
    }

    // Start in the middle block (originals)
    this.currentIndex = this.originalCount;
    // Position without animation first
    this.track.style.transition = 'none';
    this.updateCarousel(false);
    // Restore transition next frame
    requestAnimationFrame(() => { this.track.style.transition = this.trackTransition; });

    // Start auto-scroll
    this.startAutoScroll();
  }

  generateIcons() {
    // Build: [tail clones (full set)] + [originals] + [head clones (full set)]
    this.track.innerHTML = '';
    const tailFrag = document.createDocumentFragment();
    const originalsFrag = document.createDocumentFragment();
    const headFrag = document.createDocumentFragment();

    // tail clones (full copy)
    this.icons.forEach((icon, idx) => {
      const el = this.createIconElement(icon, idx, true);
      tailFrag.appendChild(el);
    });

    // originals
    this.icons.forEach((icon, idx) => {
      const el = this.createIconElement(icon, idx, false);
      originalsFrag.appendChild(el);
    });

    // head clones (full copy)
    this.icons.forEach((icon, idx) => {
      const el = this.createIconElement(icon, idx, true);
      headFrag.appendChild(el);
    });

    // append: tail + originals + head
    this.track.appendChild(tailFrag);
    this.track.appendChild(originalsFrag);
    this.track.appendChild(headFrag);

    this.totalCount = this.track.children.length; // 3 * originalCount
  }

  createIconElement(icon, originalIndex, isClone = false) {
    const iconItem = document.createElement('div');
    iconItem.className = 'tech-icon-item';
    iconItem.setAttribute('data-original-index', originalIndex);
    if (isClone) iconItem.setAttribute('data-clone', 'true');

    const img = document.createElement('img');
    img.src = icon.src;
    img.alt = icon.alt;
    // For clones, prefer eager loading and higher priority to avoid late paint during snaps
    if (isClone) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
      img.decoding = 'async';
    } else {
      img.loading = 'lazy';
    }

    iconItem.appendChild(img);
    return iconItem;
  }

  disableItemTransitions() {
    const items = this.track.querySelectorAll('.tech-icon-item');
    items.forEach(i => i.classList.add('no-transition'));
  }

  restoreItemTransitions() {
    const items = this.track.querySelectorAll('.tech-icon-item.no-transition');
    items.forEach(i => i.classList.remove('no-transition'));
  }

  preloadImages() {
    return Promise.all(this.icons.map(icon => new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = icon.src;
    })));
  }

  generateDots() {
    // Dot generation intentionally disabled — no-op to keep API stable
    return;
  }

  attachEventListeners() {
    // Navigation arrows
    if (this.navLeft) {
      this.navLeft.addEventListener('click', () => {
        this.prev();
        this.resetAutoScroll();
      });
    }

    if (this.navRight) {
      this.navRight.addEventListener('click', () => {
        this.next();
        this.resetAutoScroll();
      });
    }

    // Progress dots (optional - may not exist if hidden)
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.getAttribute('data-index'), 10);
          this.goToIndex(index);
          this.resetAutoScroll();
        });
      });
    }

    // Pause on hover
    if (this.carousel) {
      this.carousel.addEventListener('mouseenter', () => this.pauseAutoScroll());
      this.carousel.addEventListener('mouseleave', () => this.resumeAutoScroll());
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateDimensions();
        // reposition without animation during resize
        this.track.style.transition = 'none';
        this.updateCarousel(false);
        void this.track.offsetWidth;
        requestAnimationFrame(() => { this.track.style.transition = this.trackTransition; });
      }, 300);
    });
  }

  updateDimensions() {
    // Get actual rendered dimensions from CSS
    const iconItems = this.track.querySelectorAll('.tech-icon-item');
    if (iconItems.length > 0) {
      const firstIcon = iconItems[0];
      const computedStyle = window.getComputedStyle(firstIcon);
      this.iconWidth = parseFloat(computedStyle.flexBasis) || 100;

      const trackStyle = window.getComputedStyle(this.track);
      this.gap = parseFloat(trackStyle.gap) || 44;
    }
  }

  updateCarousel(animate = true) {
    // Update icon highlighting
    const iconItems = this.track.querySelectorAll('.tech-icon-item');
    iconItems.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.add('center');
      } else {
        item.classList.remove('center');
      }
    });

    // Calculate transform for center-focused layout
    const viewportWidth = this.viewport.offsetWidth;

    // Position of current icon's center in the track
    const iconCenterInTrack = this.currentIndex * (this.iconWidth + this.gap) + (this.iconWidth / 2);

    // Offset needed to center that icon in viewport
    const offset = (viewportWidth / 2) - iconCenterInTrack;

    // Apply transform
    const transformStr = `translate3d(${offset}px, 0, 0)`;
    if (!animate) {
      this.track.style.transition = 'none';
      this.track.style.transform = transformStr;
      return;
    }
    this.track.style.transform = transformStr;

      // Dot UI removed — no-op to keep API stable
      this.updateDots = () => {
        return;
      };
  }

  updateDots() {
    // Dots container is optional (hidden via CSS)
    if (!this.dotsContainer) {
      return;
    }

    // Dot UI removed — no-op to keep API stable
    return;
  }

  handleTransitionEnd(e) {
    // only handle the track's transform transitions
    if (e.target !== this.track || e.propertyName !== 'transform') return;

    // Forward wrap: entered appended head clones
    if (this.currentIndex >= this.originalCount * 2) {
      // disable track transition + item transitions, reposition to originals, then restore
      this.track.style.transition = 'none';
      this.disableItemTransitions();
      this.currentIndex -= this.originalCount;
      this.updateCarousel(false); // position without animation or item transitions
      // force reflow
      void this.track.offsetWidth;
      requestAnimationFrame(() => {
        this.track.style.transition = this.trackTransition;
        this.restoreItemTransitions();
      });
    } else if (this.currentIndex < this.originalCount) {
      // Backward wrap: entered prepended tail clones
      this.track.style.transition = 'none';
      this.disableItemTransitions();
      this.currentIndex += this.originalCount;
      this.updateCarousel(false);
      void this.track.offsetWidth;
      requestAnimationFrame(() => {
        this.track.style.transition = this.trackTransition;
        this.restoreItemTransitions();
      });
    }
    this.isTransitioning = false;
  }

  next() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex++;
    this.updateCarousel();
  }

  prev() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex--;
    this.updateCarousel();
  }

  goToIndex(index) {
    if (index >= 0 && index < this.originalCount) {
      this.currentIndex = this.originalCount + index;
      this.updateCarousel();
    }
  }

  startAutoScroll() {
    if (this.isAutoScrolling) return;

    this.isAutoScrolling = true;
    this.intervalId = setInterval(() => {
      this.next();
    }, this.autoScrollInterval);
  }

  stopAutoScroll() {
    if (!this.isAutoScrolling) return;

    this.isAutoScrolling = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pauseAutoScroll() {
    this.stopAutoScroll();
  }

  resumeAutoScroll() {
    this.startAutoScroll();
  }

  resetAutoScroll() {
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  destroy() {
    this.stopAutoScroll();
    // Clean up event listeners if needed
  }
}

// Icon data configuration
const BACKEND_ICONS = [
  { id: 'python', src: '/static/icons/about-icons/python.svg', alt: 'Python' },
  { id: 'flask', src: '/static/icons/about-icons/flask.svg', alt: 'Flask' },
  { id: 'rest-api', src: '/static/icons/about-icons/rest-api.svg', alt: 'REST API' },
  { id: 'postgres', src: '/static/icons/about-icons/postgres.svg', alt: 'PostgreSQL' },
  { id: 'docker', src: '/static/icons/about-icons/docker.svg', alt: 'Docker' },
  { id: 'linux', src: '/static/icons/about-icons/linux.svg', alt: 'Linux' },
  { id: 'git', src: '/static/icons/about-icons/git.svg', alt: 'Git' },
  { id: 'github', src: '/static/icons/about-icons/github.svg', alt: 'GitHub' },
  { id: 'ci-cd', src: '/static/icons/about-icons/ci-cd.svg', alt: 'CI/CD' }
];

const FRONTEND_ICONS = [
  { id: 'html', src: '/static/icons/about-icons/html.svg', alt: 'HTML5' },
  { id: 'css', src: '/static/icons/about-icons/css.svg', alt: 'CSS3' },
  { id: 'javascript', src: '/static/icons/about-icons/javascript.svg', alt: 'JavaScript' }
];

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize backend carousel only (frontend still uses old list structure)
  const backendCarousel = document.querySelector('.about__backend [data-carousel="backend"]');

  if (backendCarousel) {
    new TechCarousel('.about__backend', BACKEND_ICONS, {
      autoScrollInterval: 3000
    });
  }

  // Frontend carousel will be initialized in Phase 4
  const frontendCarousel = document.querySelector('.about__frontend [data-carousel="frontend"]');
  if (frontendCarousel) {
    new TechCarousel('.about__frontend', FRONTEND_ICONS, { autoScrollInterval: 3000 });
  }
});
