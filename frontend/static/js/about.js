// about.js: initialize modal using shared modal.js
window.initModal && window.initModal({
  modalId: 'about-modal',
  triggerAttr: 'data-about-trigger',
  overlayAttr: 'data-about-overlay',
  closeAttr: 'data-about-close'
});

// About modal: Stack gallery carousel initialization
(() => {
  const modal = document.getElementById('about-modal');
  if (!modal) return;

  const galleries = Array.from(modal.querySelectorAll('.about-card .stack-gallery'));
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const track = gallery.querySelector('.stack-gallery__track');
    const prevBtn = gallery.querySelector('.stack-nav--prev');
    const nextBtn = gallery.querySelector('.stack-nav--next');
    
    if (!track || !prevBtn || !nextBtn) return;

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

    // Render stack items
    function render() {
      track.innerHTML = items.map((item) => `
        <div class="stack-item">
          <div class="stack-item__icon">
            <svg viewBox="${item.viewBox}" aria-hidden="true" focusable="false">
              <use href="${new URL('/static/icons/stack-sprite.svg', window.location).pathname}#${item.icon}"></use>
            </svg>
          </div>
          <div class="stack-item__label">${item.label}</div>
        </div>
      `).join('');

      update();
    }

    function update() {
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === items.length - 1;
    }

    function prev() {
      if (currentIndex > 0) {
        currentIndex--;
        update();
      }
    }

    function next() {
      if (currentIndex < items.length - 1) {
        currentIndex++;
        update();
      }
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Initial render
    render();
  });
})();
