# Modal Animation: Shared Utility & Consistent Styling

## Animation Description
- All modal open/close animations are handled by the shared `modal.js` utility.
- The modal panel animates from scale(0) to scale(1) and opacity 0 to 1 when opening, and reverses when closing.
- Animation duration: 1 second, using CSS keyframes (`modalOpen`, `modalClose`).
- Both Work and About modals use identical structure, classes, and animation logic for perfect consistency.

## CSS Implementation
All modal panels use the `.work-modal__panel` class for animation. See `theme.css` for keyframes and panel styles.

## JavaScript Implementation
All modal open/close, overlay, ESC, and focus trap logic is handled by `modal.js` via the `initModal` function. No duplicated modal code exists in `work.js` or `about.js`.

## Usage
- Both Work and About modals are initialized by calling `initModal` with their respective selectors.
- Opening/closing triggers the same animation and accessibility logic for all modals.

---

**Accessibility & Consistency:**
- Focus is managed by the shared utility.
- Animation and keyboard navigation are consistent across all modals.
- All modal/card action buttons use `.work-modal__btn` for unified styling.
- Button hover/focus color is always `#bd93f9` for accessibility.

---

**References:**
- [MDN: Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
