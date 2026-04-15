/* ==========================================================================
   NAINAI x OFYSINA — Brand Timeline / Philosophy Section
   Replace contents of: assets/brand-timeline.js

   Responsibilities:
     1. Measure the SVG path length so we can animate stroke-dashoffset
        from full length → 0 (line "draws" in).
     2. Reveal the section (adds .is-visible) when it scrolls into view
        via IntersectionObserver, which kicks off the CSS transitions
        for the line, dots, and labels.
     3. Respects prefers-reduced-motion and re-initializes inside the
        Shopify theme editor on section load/reload.
   ========================================================================== */

(function () {
  'use strict';

  var SELECTOR = '[data-nainai-timeline]';
  var INIT_FLAG = 'nainaiTimelineInit';

  function measurePath(section) {
    var path = section.querySelector('.nainai-timeline__path');
    if (!path || typeof path.getTotalLength !== 'function') return;

    try {
      var length = path.getTotalLength();
      if (!isFinite(length) || length <= 0) return;

      // Expose to CSS via a custom property so the .is-visible class
      // can transition stroke-dashoffset from length → 0.
      path.style.setProperty('--nt-path-length', length.toFixed(2));
      path.style.strokeDasharray = length.toFixed(2);
      path.style.strokeDashoffset = length.toFixed(2);
    } catch (err) {
      /* Silently ignore — the section still renders, just without animation. */
    }
  }

  function reveal(section) {
    if (section.classList.contains('is-visible')) return;
    section.classList.add('is-visible');
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function init(section) {
    if (!section || section.dataset[INIT_FLAG] === 'true') return;
    section.dataset[INIT_FLAG] = 'true';

    measurePath(section);

    // Re-measure on resize in case the container width (and therefore
    // the rendered path length) changes meaningfully. Debounced.
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        // Only re-measure before the animation has run — once the
        // line has been drawn we don't want to reset it.
        if (!section.classList.contains('is-visible')) {
          measurePath(section);
        }
      }, 150);
    });

    if (prefersReducedMotion()) {
      reveal(section);
      return;
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
              reveal(section);
              obs.unobserve(section);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -10% 0px',
          threshold: [0, 0.2, 0.4]
        }
      );
      observer.observe(section);
    } else {
      // Fallback: reveal immediately if IntersectionObserver isn't available.
      reveal(section);
    }
  }

  function initAll(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var sections = scope.querySelectorAll(SELECTOR);
    for (var i = 0; i < sections.length; i++) {
      init(sections[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAll(document);
    });
  } else {
    initAll(document);
  }

  // Shopify theme editor — re-run when the section is added or re-rendered.
  document.addEventListener('shopify:section:load', function (event) {
    var target = event.target;
    if (!target) return;
    if (target.matches && target.matches(SELECTOR)) {
      init(target);
    } else {
      initAll(target);
    }
  });

  // Clean up when the section is removed so a later re-add re-initializes cleanly.
  document.addEventListener('shopify:section:unload', function (event) {
    var target = event.target;
    if (!target) return;
    var sec = target.matches && target.matches(SELECTOR)
      ? target
      : target.querySelector(SELECTOR);
    if (sec) {
      delete sec.dataset[INIT_FLAG];
      sec.classList.remove('is-visible');
    }
  });
})();
