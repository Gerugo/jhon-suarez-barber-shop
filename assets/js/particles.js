/* ============================================================
   Three.js Particle Canvas — Hero Section
   ============================================================ */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  let w, h, ctx, particles = [], animId;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.6 + 0.1,
      hue: Math.random() > 0.7 ? 201 : 45  // blue or gold
    };
  }

  let isCanvasActive = true;
  function init() {
    ctx = canvas.getContext('2d');
    resize();
    const isMobile = window.innerWidth < 768;
    particles = Array.from({ length: isMobile ? 40 : 120 }, createParticle);
    window.addEventListener('resize', resize, { passive: true });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isCanvasActive = entry.isIntersecting;
          cancelAnimationFrame(animId);
          if (isCanvasActive) loop();
        });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    } else {
      loop();
    }
  }

  function loop() {
    if (!isCanvasActive) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.0008;

      if (p.y < 0 || p.alpha <= 0) {
        particles[i] = createParticle();
        particles[i].y = h + 5;
      }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.alpha})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(loop);
  }

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isCanvasActive = false;
      cancelAnimationFrame(animId);
    } else {
      isCanvasActive = true;
      loop();
    }
  });

  // Reduce on prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  init();
})();
