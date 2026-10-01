(function () {
  'use strict';

  // Nota de auditoría: Lenis ya está inicializado y vinculado a GSAP en premium.js.
  // ENABLE_LENIS se fija en false para no duplicar instancias ni listeners.
  var CONFIG = { ENABLE_LENIS: false, MAX_DPR: 2, MOBILE_BP: 768, CONCURRENCY: 6 };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: ' + CONFIG.MOBILE_BP + 'px)').matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function pad(n) { return String(n).padStart(3, '0'); }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* ---------- Escena con secuencia de frames ---------- */
  function initScene(section) {
    var canvas = section.querySelector('canvas.scene-canvas');
    if (!canvas || reduceMotion) { section.classList.add('scene--static'); return; }

    var useMobile = isMobile && section.dataset.seqPathMobile;
    var base  = useMobile ? section.dataset.seqPathMobile : section.dataset.seqPath;
    var count = parseInt(useMobile ? section.dataset.seqCountMobile : section.dataset.seqCount, 10);
    var ext   = section.dataset.seqExt || 'webp';
    if (!base || !count || count <= 0) { section.classList.add('scene--static'); return; }

    var ctx = canvas.getContext('2d');
    var frames = new Array(count);
    var loaded = new Array(count);
    var current = 0, lastDrawn = -1, started = false, failed = false;

    function nearestLoaded(i) {
      for (var k = i; k >= 0; k--) if (loaded[k]) return k;
      for (var j = i + 1; j < count; j++) if (loaded[j]) return j;
      return -1;
    }

    function render(i) {
      var idx = nearestLoaded(clamp(i, 0, count - 1));
      if (idx < 0 || idx === lastDrawn) return;
      var img = frames[idx];
      var cw = canvas.width, ch = canvas.height;
      if (!cw || !ch || !img.naturalWidth) return;
      var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      var w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      lastDrawn = idx;
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, CONFIG.MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      lastDrawn = -1;
      render(current);
    }

    function loadFrame(i) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.decoding = 'async';
        img.onload = function () { frames[i] = img; loaded[i] = true; resolve(true); };
        img.onerror = function () { resolve(false); };
        img.src = base + 'f_' + pad(i + 1) + '.' + ext;
      });
    }

    // Orden grueso -> fino: cada 8, cada 4, cada 2, todos
    function buildOrder() {
      var seen = {}, order = [];
      [8, 4, 2, 1].forEach(function (step) {
        for (var i = 0; i < count; i += step) if (!seen[i]) { seen[i] = 1; order.push(i); }
      });
      return order.filter(function (i) { return i !== 0; });
    }

    function startLoading() {
      if (started) return; started = true;
      loadFrame(0).then(function (ok) {
        if (!ok) { failed = true; section.classList.add('scene--static'); return; }
        section.classList.add('scene--ready');
        resize();
        var order = buildOrder(), cursor = 0;
        (function spawn() {
          for (var c = 0; c < CONFIG.CONCURRENCY; c++) next();
        })();
        function next() {
          if (cursor >= order.length) return;
          var i = order[cursor++];
          loadFrame(i).then(function () { render(current); next(); });
        }
      });
    }

    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { startLoading(); io.disconnect(); }
    }, { rootMargin: '100% 0px' });
    io.observe(section);

    var overlays = [].slice.call(section.querySelectorAll('.scene-text'));
    function onProgress(p) {
      if (failed) return;
      current = Math.round(p * (count - 1));
      requestAnimationFrame(function () { render(current); });
      overlays.forEach(function (el) {
        var from = parseFloat(el.dataset.from || 0);
        var to = parseFloat(el.dataset.to || 1);
        var f = 0.06;
        var o = Math.min(clamp((p - from) / f, 0, 1), clamp((to - p) / f, 0, 1));
        el.style.opacity = o;
        el.style.transform = 'translate(-50%, calc(-50% + ' + ((1 - o) * 20) + 'px))';
      });
    }

    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom bottom',
        onUpdate: function (self) { onProgress(self.progress); },
        onRefresh: function (self) { onProgress(self.progress); }
      });
    } else {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          var r = section.getBoundingClientRect();
          var total = r.height - window.innerHeight;
          onProgress(total > 0 ? clamp(-r.top / total, 0, 1) : 0);
          ticking = false;
        });
      }, { passive: true });
    }
    window.addEventListener('resize', debounce(resize, 150));
  }

  /* ---------- Vídeo del hero ---------- */
  function initHeroVideo() {
    var v = document.querySelector('#hero video');
    if (!v) return;
    v.muted = true; v.playsInline = true;
    if (reduceMotion) { v.pause(); v.removeAttribute('autoplay'); return; }
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    }, { threshold: 0.1 }).observe(v);
  }

  function init() {
    initHeroVideo();
    document.querySelectorAll('.scene[data-seq-path]').forEach(initScene);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
