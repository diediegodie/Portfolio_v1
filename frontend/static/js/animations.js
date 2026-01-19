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
    return new Promise((resolve) => {
      const {
        duration = 600,
        characterSet = DEFAULT_CHARS,
        easing = 'easeOut'
      } = options;
      
      const easingFn = easings[easing] || easings.linear;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFn(progress);
        
        let displayText = '';
        
        for (let i = 0; i < finalText.length; i++) {
          const charProgress = easedProgress * finalText.length;
          
          if (i < charProgress) {
            // Character is revealed
            displayText += finalText[i];
          } else {
            // Character is scrambled
            const randomChar = characterSet[
              Math.floor(Math.random() * characterSet.length)
            ];
            displayText += randomChar;
          }
        }
        
        element.textContent = displayText;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure final text is correct
          element.textContent = finalText;
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
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
      staggerDelay = 50
    } = options;
    
    return Promise.all(
      Array.from(elements).map((item, index) => {
        const delay = index * staggerDelay;
        return new Promise((resolve) => {
          setTimeout(() => {
            animateElement(
              item.element,
              item.text,
              {
                duration: item.duration,
                characterSet,
                easing
              }
            ).then(resolve);
          }, delay);
        });
      })
    );
  }
  
  return {
    animateElement,
    animateMultiple
  };
})();
