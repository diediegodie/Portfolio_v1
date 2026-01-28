/**
 * Text Scramble Animation Module
 * Animates text reveal with random character cycling
 */

const TextScramble = (() => {
  // Character pool for random cycling
  const DEFAULT_CHARS = '!@#$%^&*()_+={}[]|;:,.<>?/~`';
  
  // Easing functions
  const easings = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => t * (2 - t),
    easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  };
  
  /**
   * Animate a single text element with scramble effect
   * @param {HTMLElement} element - Element to animate
   * @param {string} finalText - Target text to reveal
   * @param {object} options - { duration, characterSet, easing }
   * @returns {Promise} Resolves when animation completes
   */
  function animateElement(element, finalText, options = {}) {
    const {
      duration = 600,
      characterSet = DEFAULT_CHARS,
      easing = 'easeOut',
      signal = null
    } = options;

    const easingFn = easings[easing] || easings.linear;

    // If already aborted, set final text and resolve immediately
    if (signal && signal.aborted) {
      try { element.textContent = finalText; } catch (e) { /* ignore */ }
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let rafId = null;
      let startTime = performance.now();
      let aborted = false;

      const cleanUp = () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (signal && typeof onAbort === 'function') signal.removeEventListener('abort', onAbort);
      };

      const onAbort = () => {
        aborted = true;
        try { element.textContent = finalText; } catch (e) { /* ignore */ }
        cleanUp();
        resolve();
      };

      if (signal) {
        if (signal.aborted) { onAbort(); return; }
        signal.addEventListener('abort', onAbort, { once: true });
      }

      const animate = (currentTime) => {
        if (aborted) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFn(progress);

        let displayText = '';
        for (let i = 0; i < finalText.length; i++) {
          const charProgress = easedProgress * finalText.length;
          if (i < charProgress) {
            displayText += finalText[i];
          } else {
            displayText += characterSet[Math.floor(Math.random() * characterSet.length)];
          }
        }

        try { element.textContent = displayText; } catch (e) { /* ignore if node removed */ }

        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        } else {
          try { element.textContent = finalText; } catch (e) { /* ignore */ }
          cleanUp();
          resolve();
        }
      };

      // Start the first frame
      rafId = requestAnimationFrame(animate);

    });
  }
  
  /**
   * Animate multiple elements
   * @param {Array|NodeList} elements - Array of {element, text, duration}
   * @param {object} options - { characterSet, easing, staggerDelay }
   * @returns {Promise} Resolves when all animations complete
   */
  function animateMultiple(elements, options = {}) {
    const {
      characterSet = DEFAULT_CHARS,
      easing = 'easeOut',
      staggerDelay = 50,
      signal = null
    } = options;

    const promises = Array.from(elements).map((item, index) => {
      return new Promise((resolve) => {
        const delay = index * staggerDelay;
        const timerId = setTimeout(() => {
          // If the signal was aborted between scheduling and start, resolve immediately
          if (signal && signal.aborted) { resolve(); return; }
          animateElement(item.element, item.text, {
            duration: item.duration,
            characterSet,
            easing,
            signal
          }).then(resolve).catch(() => resolve());
        }, delay);

        // If aborted before the timeout fires, clear timeout and resolve
        if (signal) {
          if (signal.aborted) {
            clearTimeout(timerId);
            resolve();
          } else {
            signal.addEventListener('abort', () => {
              clearTimeout(timerId);
              resolve();
            }, { once: true });
          }
        }
      });
    });

    return Promise.all(promises);
  }
  
  return {
    animateElement,
    animateMultiple
  };
})();
