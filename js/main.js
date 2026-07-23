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
