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
    this.currentIndex = 0;
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

    // Generate icons and dots
    this.generateIcons();
    this.generateDots();

    // Set up event listeners
    this.attachEventListeners();

    // Calculate dimensions
    this.updateDimensions();

    // Initial render
    this.updateCarousel();

    // Start auto-scroll
    this.startAutoScroll();
  }

  generateIcons() {
    // Clear existing content
    this.track.innerHTML = '';

    // Create icon elements
    this.icons.forEach((icon, index) => {
      const iconItem = document.createElement('div');
      iconItem.className = 'tech-icon-item';
      iconItem.setAttribute('data-index', index);
      iconItem.setAttribute('data-icon', icon.id);

      const img = document.createElement('img');
      img.src = icon.src;
      img.alt = icon.alt;
      img.loading = 'lazy';

      iconItem.appendChild(img);
      this.track.appendChild(iconItem);
    });
  }

  generateDots() {
    // Dots container is optional (hidden via CSS)
    if (!this.dotsContainer) {
      return;
    }

    // Clear existing dots
    this.dotsContainer.innerHTML = '';

    // Create dot elements
    this.icons.forEach((icon, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `${icon.alt} (${index + 1} of ${this.icons.length})`);
      dot.setAttribute('data-index', index);
      dot.type = 'button';

      if (index === 0) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.setAttribute('aria-selected', 'false');
      }

      this.dotsContainer.appendChild(dot);
    });
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
        this.updateCarousel();
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

  updateCarousel() {
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
    this.track.style.transform = `translateX(${offset}px)`;

    // Update dots
    this.updateDots();
  }

  updateDots() {
    // Dots container is optional (hidden via CSS)
    if (!this.dotsContainer) {
      return;
    }

    const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.icons.length;
    this.updateCarousel();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.icons.length) % this.icons.length;
    this.updateCarousel();
  }

  goToIndex(index) {
    if (index >= 0 && index < this.icons.length) {
      this.currentIndex = index;
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
  // const frontendCarousel = document.querySelector('.about__frontend [data-carousel="frontend"]');
  // if (frontendCarousel) {
  //   new TechCarousel('.about__frontend', FRONTEND_ICONS, { autoScrollInterval: 3000 });
  // }
});
