/* ============================================================
   Global Ambient Particle Canvas — Jhon Suarez Barber Shop
   Full-viewport golden & electric blue floating embers
   ============================================================ */
(function initGlobalParticles() {
  const canvas = document.getElementById('hero-canvas') || document.querySelector('.global-particles');
  if (!canvas) return;

  // Reduce motion preference check
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0, h = 0, particles = [], animId = null;
  let isTabActive = true;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticle(randomY = true) {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + Math.random() * 20,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: -(Math.random() * 0.45 + 0.15),
      alpha: Math.random() * 0.55 + 0.15,
      hue: Math.random() > 0.65 ? 201 : 45 // 201 = electric blue, 45 = gold
    };
  }

  function init() {
    resize();
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 45 : 95;
    particles = Array.from({ length: count }, () => createParticle(true));

    window.addEventListener('resize', () => {
      resize();
    }, { passive: true });

    loop();
  }

  function loop() {
    if (!isTabActive) return;

    ctx.clearRect(0, 0, w, h);

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.0006;

      if (p.y < -10 || p.alpha <= 0) {
        particles[i] = createParticle(false);
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 68%, ${p.alpha})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(loop);
  }

  // Battery saving: pause when tab is in background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isTabActive = false;
      cancelAnimationFrame(animId);
    } else {
      isTabActive = true;
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(loop);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
