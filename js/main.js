// Sticky download bar: visible between the hero and the final CTA.
(function () {
  var stickyCta = document.getElementById('sticky-cta');
  var hero = document.getElementById('hero');
  var finalCta = document.getElementById('final-cta');

  if (!stickyCta || !hero || !finalCta || !('IntersectionObserver' in window)) {
    return;
  }

  var heroVisible = true;
  var finalCtaVisible = false;

  function update() {
    stickyCta.classList.toggle('is-visible', !heroVisible && !finalCtaVisible);
  }

  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting;
    update();
  }).observe(hero);

  new IntersectionObserver(function (entries) {
    finalCtaVisible = entries[0].isIntersecting;
    update();
  }).observe(finalCta);
})();

// Showcase: whichever caption is nearest the viewport's vertical center drives
// the matching phone screen. Pure scroll-driven, no autoplay.
(function () {
  var showcase = document.getElementById('showcase');
  if (!showcase) {
    return;
  }

  var shots = showcase.querySelectorAll('.phone__shot');
  var steps = showcase.querySelectorAll('.showcase__step');
  if (!shots.length || !steps.length) {
    return;
  }

  var current = -1;
  var ticking = false;

  function activate(idx) {
    if (idx === current) {
      return;
    }
    current = idx;
    for (var i = 0; i < shots.length; i++) {
      shots[i].classList.toggle('is-active', i === idx);
    }
    for (var j = 0; j < steps.length; j++) {
      steps[j].classList.toggle('is-current', j === idx);
    }
  }

  function pick() {
    ticking = false;
    var center = window.innerHeight / 2;
    var best = 0;
    var bestDist = Infinity;
    for (var i = 0; i < steps.length; i++) {
      var rect = steps[i].getBoundingClientRect();
      var dist = Math.abs(rect.top + rect.height / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    activate(best);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(pick);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  pick();
})();

// Mobile showcase intro: the phone starts small and fully visible, then
// scroll grows it into the pinned, bottom-cropped frame used for the rest of
// the showcase. Driven entirely by scroll position, so scrolling back up
// shrinks it back to the fully-visible state.
(function () {
  var stage = document.querySelector('.showcase__stage');
  var phone = stage && stage.querySelector('.phone');
  if (!stage || !phone) {
    return;
  }

  var mobileQuery = window.matchMedia('(max-width: 767px)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  var BEZEL = 7;              // must match --bezel on .phone in the mobile breakpoint (components.css)
  var ASPECT = 2532 / 1170;   // .phone__screen aspect-ratio, height/width
  var SHADOW_BUFFER = 48;     // matches --space-5; keeps .phone's box-shadow from being hard-clipped
  var CROP_FRACTION = 0.22;   // final pinned crop height, as a fraction of viewport height
  var WIDTH_START = 0.60;     // initial fully-visible phone width, as a fraction of viewport width
  var WIDTH_END = 0.90;       // final cropped phone width, as a fraction of viewport width
  var GROW_VH = 0.35;         // scroll distance (in viewport heights) over which the grow completes

  var introTop = 0;
  var ticking = false;

  function phoneHeightFor(width) {
    return (width - BEZEL * 2) * ASPECT + BEZEL * 2;
  }

  function measure() {
    introTop = stage.getBoundingClientRect().top + window.scrollY;
  }

  function apply() {
    ticking = false;

    if (!mobileQuery.matches) {
      stage.style.height = '';
      phone.style.width = '';
      return;
    }

    var vh = window.innerHeight;
    var vw = window.innerWidth;
    var widthStartPx = vw * WIDTH_START;
    var widthEndPx = vw * WIDTH_END;
    var stageStartPx = phoneHeightFor(widthStartPx) + SHADOW_BUFFER;
    var stageEndPx = vh * CROP_FRACTION + SHADOW_BUFFER;

    var progress;
    if (reducedMotionQuery.matches) {
      progress = 1;
    } else {
      var growDistance = vh * GROW_VH;
      progress = growDistance > 0 ? (window.scrollY - introTop) / growDistance : 1;
      progress = Math.max(0, Math.min(1, progress));
    }

    phone.style.width = (widthStartPx + (widthEndPx - widthStartPx) * progress) + 'px';
    stage.style.height = (stageStartPx + (stageEndPx - stageStartPx) * progress) + 'px';
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  }

  function onResize() {
    measure();
    apply();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('load', onResize);
  // A deferred script can run a tick before the viewport/layout has fully
  // settled, which can make the very first matchMedia/layout read stale;
  // requestAnimationFrame pushes the initial measurement past that.
  requestAnimationFrame(onResize);
})();
