/**
 * Markmap Math Rendering
 * DISABLED: Markmap handles math natively via its HTML rendering
 * Do NOT call renderMathInElement on Markmap content as it causes positioning issues
 */

(function() {
  'use strict';
  
  // Just log that we're aware of Markmap content
  document.addEventListener('DOMContentLoaded', () => {
    const markmaps = document.querySelectorAll('.diagram-rendered.diagram-markmap');
    if (markmaps.length > 0) {
      console.log('Markmap instances found:', markmaps.length);
      console.log('Note: Markmap handles its own math rendering - no external KaTeX processing');
    }
  });
})();
