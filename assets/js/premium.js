/* ============================================================
   JHON SUAREZ BARBER SHOP — PREMIUM CINEMATIC JS
   Lenis + GSAP ScrollTrigger + Canvas particles
   ============================================================ */
'use strict';

const BOOKSY = 'https://booksy.com/es-es/140555_jhon-suarez-barber-shop_barberia_26736_rincones';
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── FILM COUNTDOWN LOADER ────────────────────────────────────
(function filmLoader() {
  const loader  = document.getElementById('loader');
  const countEl = document.querySelector('.loader-count');
  const labelEl = document.querySelector('.loader-label');
  const barFill = document.querySelector('.loader-bar-fill');
  if (!loader) {
    revealHero();
    return;
  }

  let count = 3;

  labelEl.style.opacity = '1';
  countEl.style.opacity = '1';
  countEl.textContent   = count;

  const grain = document.querySelector('.grain');
  if (grain) grain.style.opacity = '1';

  let hasFinished = false;
  function finish() {
    if (hasFinished) return;
    hasFinished = true;
    countEl.textContent = '▶';
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
        revealHero();
      }, 350);
    }, 150);
  }

  // Safety fallback: if anything stalls or takes > 2.5s, force finish
  setTimeout(finish, 2400);

  if (REDUCE_MOTION) {
    setTimeout(finish, 150);
    return;
  }

  const interval = setInterval(() => {
    count--;
    const progress = ((3 - count) / 3) * 100;
    barFill.style.transition = 'width 0.15s ease';
    barFill.style.width = progress + '%';

    if (count <= 0) {
      clearInterval(interval);
      finish();
    } else {
      countEl.style.opacity = '0';
      setTimeout(() => {
        countEl.textContent = count;
        countEl.style.opacity = '1';
      }, 60);
    }
  }, 320);
})();

// ── CANVAS PARTICLE FIELD ────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || REDUCE_MOTION) return;

  let w, h, ctx, particles = [], animId;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      dx: (Math.random() - 0.5) * 0.25,
      dy: -(Math.random() * 0.5 + 0.1),
      alpha: Math.random() * 0.5 + 0.05,
      hue: Math.random() > 0.75 ? 45 : 201, // gold or blue
    };
  }

  const isMobile = window.innerWidth < 768;
  resize();
  particles = Array.from({ length: isMobile ? 40 : 100 }, mkParticle);
  window.addEventListener('resize', resize, { passive: true });

  ctx = canvas.getContext('2d');

  let isCanvasActive = true;
  function loop() {
    if (!isCanvasActive) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.x += p.dx; p.y += p.dy; p.alpha -= 0.0007;
      if (p.y < 0 || p.alpha <= 0) {
        particles[i] = mkParticle();
        particles[i].y = h + 5;
      }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 68%, ${p.alpha})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(loop);
  }

  // Pause when off-screen to free mobile GPU/CPU
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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isCanvasActive = false;
      cancelAnimationFrame(animId);
    } else {
      isCanvasActive = true;
      loop();
    }
  });
})();

// ── HERO REVEAL ──────────────────────────────────────────────
function revealHero() {
  if (typeof gsap === 'undefined') return;

  gsap.from('.hero-eyebrow, .hero-tagline, .hero-actions', {
    opacity: 0,
    y: 20,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out',
  });

  gsap.from('.hero-title-word', {
    opacity: 0,
    y: 35,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power3.out',
  });
}

// ── 2026 DIRECTOR HUD & SPATIAL RETICLES CONTROLLER ─────────
(function initDirectorHUD() {
  const video = document.getElementById('hero-video');
  const timecodeEl = document.getElementById('hud-timecode');
  const sceneTagEl = document.getElementById('hud-scene-tag');
  const timelineBar = document.getElementById('hud-timeline-bar');
  const timelineFill = document.getElementById('hud-timeline-fill');
  const pillBtns = document.querySelectorAll('.hud-pill-btn');
  const hotspots = document.querySelectorAll('.hud-hotspot');

  if (!video) return;

  const SCENE_NAMES = [
    'ENTRADA NOIR',
    'HERRAMIENTAS DE AUTOR',
    'SKIN FADES',
    'RITUAL BARBA',
    'ALEJANDRA STUDIO',
    'SILLÓN JS'
  ];

  let currentActiveScene = -1;
  let rafId = null;
  let isHeroVisible = true;

  function formatTime(sec) {
    const s = Math.max(0, sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    const wholeSec = Math.floor(rem);
    const tenths = Math.floor((rem - wholeSec) * 10);
    return `${String(m).padStart(2, '0')}:${String(wholeSec).padStart(2, '0')}.${tenths}`;
  }

  function setActiveScene(idx, seekVideo = false) {
    const safeIdx = Math.max(0, Math.min(5, idx));
    if (safeIdx === currentActiveScene && !seekVideo) return;
    currentActiveScene = safeIdx;

    if (seekVideo) {
      video.currentTime = safeIdx * 5.0;
    }

    // Update scene tag
    if (sceneTagEl) {
      const numSpan = sceneTagEl.querySelector('.hud-scene-num');
      const nameSpan = sceneTagEl.querySelector('.hud-scene-name');
      if (numSpan) numSpan.textContent = `SCENE 0${safeIdx + 1} / 06`;
      if (nameSpan) nameSpan.textContent = SCENE_NAMES[safeIdx];
    }

    // Update pills
    pillBtns.forEach((btn, i) => {
      const isActive = i === safeIdx;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive && btn.scrollIntoView && window.innerWidth <= 900) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Update spatial hotspots
    hotspots.forEach((h, i) => {
      const isActive = i === safeIdx;
      h.classList.toggle('active', isActive);
      const reticle = h.querySelector('.hud-reticle');
      if (reticle) reticle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  }

  function updateHUD() {
    const t = video.currentTime || 0;
    const dur = 30.0;

    // Timecode
    if (timecodeEl) {
      timecodeEl.textContent = formatTime(t);
    }

    // Progress bar
    if (timelineFill) {
      const pct = Math.min(100, Math.max(0, (t / dur) * 100));
      timelineFill.style.width = `${pct}%`;
    }
    if (timelineBar) {
      timelineBar.setAttribute('aria-valuenow', t.toFixed(1));
    }

    // Determine current scene: 0 to 5 (each 5 seconds)
    const sceneIdx = Math.min(5, Math.floor(t / 5.0));
    if (sceneIdx !== currentActiveScene) {
      setActiveScene(sceneIdx, false);
    }

    if (isHeroVisible && !video.paused) {
      rafId = requestAnimationFrame(updateHUD);
    }
  }

  // Handle pill button clicks
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const time = parseFloat(btn.dataset.time || '0');
      const scene = parseInt(btn.dataset.scene || '0', 10);
      video.currentTime = time;
      setActiveScene(scene, false);
      if (video.paused) {
        video.play().catch(() => {});
      }
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHUD);
    });
  });

  // Handle timeline scrubbing / click
  if (timelineBar) {
    timelineBar.addEventListener('click', e => {
      const rect = timelineBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const frac = Math.max(0, Math.min(1, clickX / rect.width));
      video.currentTime = frac * 30.0;
      updateHUD();
      if (video.paused) {
        video.play().catch(() => {});
      }
    });
  }

  // Handle hotspot reticle clicks / keyboard toggles
  hotspots.forEach(h => {
    const reticle = h.querySelector('.hud-reticle');
    if (reticle) {
      reticle.addEventListener('click', e => {
        e.stopPropagation();
        const scene = parseInt(h.dataset.scene || '0', 10);
        setActiveScene(scene, true);
      });
    }
  });

  // Video event listeners
  video.addEventListener('play', () => {
    cancelAnimationFrame(rafId);
    if (isHeroVisible) {
      rafId = requestAnimationFrame(updateHUD);
    }
  });

  video.addEventListener('pause', () => {
    cancelAnimationFrame(rafId);
    updateHUD();
  });

  video.addEventListener('timeupdate', () => {
    if (!rafId) updateHUD();
  });

  // Galaxy Note 10+ / Mobile Performance: Pause video & loop when hero is off-screen
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible) {
          if (video.paused && !document.hidden) {
            video.play().catch(() => {});
          }
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(updateHUD);
        } else {
          if (!video.paused) {
            video.pause();
          }
          cancelAnimationFrame(rafId);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(heroSection);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!video.paused) video.pause();
      cancelAnimationFrame(rafId);
    } else if (isHeroVisible) {
      video.play().catch(() => {});
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHUD);
    }
  });

  // Initial state
  setActiveScene(0, false);
  updateHUD();
})();

// ── LENIS SMOOTH SCROLL ──────────────────────────────────────
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.1,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.0,
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(500, 33);
  } else {
    (function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    })(performance.now());
  }
}

// ── GSAP CINEMATIC ANIMATIONS ────────────────────────────────
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initFallbacks();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  initLenis();

  /* PROGRESS BAR */
  const bar = document.getElementById('progress-bar');
  if (bar) {
    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: s => { bar.style.width = (s.progress * 100) + '%'; },
    });
  }

  /* NAVBAR */
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top+=80 top',
    onEnter:     () => navbar?.classList.add('scrolled'),
    onLeaveBack: () => navbar?.classList.remove('scrolled'),
  });

  /* SCENE COUNTER */
  const scenes = ['hero','manifesto','about-cinema','services-cinema','gallery-cinema','artistry','estetica-cinema','booking'];
  const counterEl = document.querySelector('#scene-counter .scene-current');
  if (counterEl) {
    scenes.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el, start: 'top 60%',
        onEnter:     () => { counterEl.textContent = String(i + 1).padStart(2, '0'); },
        onEnterBack: () => { counterEl.textContent = String(i + 1).padStart(2, '0'); },
      });
    });
  }

  /* MANIFESTO — PIN + SCRUB WORD REVEAL */
  const manifesto = document.getElementById('manifesto');
  if (manifesto && !REDUCE_MOTION) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: manifesto,
        pin: true,
        scrub: 1.8,
        start: 'top top',
        end: '+=280%',
        anticipatePin: 1,
      }
    });

    tl.to('.manifesto-label',   { opacity: 1, duration: 0.4 }, 0)
      .to('.manifesto-bg',      { scale: 1, filter: 'brightness(0.2) saturate(0.5)', duration: 2 }, 0)
      .to('.manifesto-word-1',  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
      .to('.manifesto-word-2',  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.75)
      .to('.manifesto-word-3',  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.2)
      .to('.manifesto-year',    { opacity: 1, duration: 0.5 }, 1.7);
  }

  /* HORIZONTAL SERVICES SCROLL */
  const servicesSection = document.getElementById('services-cinema');
  const track = document.querySelector('.services-track');
  if (servicesSection && track && !REDUCE_MOTION) {
    const getWidth = () => track.scrollWidth - window.innerWidth + 160;

    gsap.to(track, {
      x: () => -getWidth(),
      ease: 'none',
      scrollTrigger: {
        trigger: servicesSection,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${getWidth()}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: self => {
          const cards = track.querySelectorAll('.service-cinema-card');
          const dots  = document.querySelectorAll('.services-dot');
          if (!cards.length || !dots.length) return;
          const active = Math.round(self.progress * (cards.length - 1));
          dots.forEach((d, i) => d.classList.toggle('active', i === active));
        },
      },
    });
  }

  /* GALLERY STAGGER — fallback for browsers without CSS scroll animations */
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const items = document.querySelectorAll('.g-item');
    if (items.length) {
      ScrollTrigger.batch(items, {
        onEnter: batch => gsap.to(batch, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.9, ease: 'power3.out',
          stagger: { amount: 0.5, from: 'start' },
          clearProps: 'transform',
        }),
        start: 'top 88%',
      });
    }
  }

  /* ABOUT SECTION — slide in */
  const about = document.getElementById('about-cinema');
  if (about) {
    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      gsap.from(about.querySelectorAll('.section-label, .cinema-h2, .about-cinema-text p, .about-feature-cinema'), {
        opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: about, start: 'top 72%' },
      });
    }
    gsap.from(about.querySelector('.about-cinema-visual'), {
      opacity: 0, x: -80, duration: 1.4, ease: 'power4.out',
      scrollTrigger: { trigger: about, start: 'top 75%' },
    });
  }

  /* ARTISTRY SECTION */
  const artistry = document.getElementById('artistry');
  if (artistry) {
    gsap.from(artistry.querySelector('.artistry-visual'), {
      opacity: 0, x: -80, duration: 1.3, ease: 'power4.out',
      scrollTrigger: { trigger: artistry, start: 'top 72%' },
    });
    gsap.from(artistry.querySelectorAll('.artistry-text h2, .artistry-text p, .artistry-stat-num, .artistry-stat-label'), {
      opacity: 0, x: 60, duration: 1, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: artistry, start: 'top 68%' },
    });
  }

  /* ESTETICA SECTION */
  const estetica = document.getElementById('estetica-cinema');
  if (estetica) {
    gsap.from(estetica.querySelectorAll('.estetica-text > *'), {
      opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: estetica, start: 'top 72%' },
    });
    gsap.from(estetica.querySelectorAll('.estetica-photo'), {
      opacity: 0, scale: 0.92, duration: 0.9, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: estetica, start: 'top 68%' },
    });
  }

  /* BOOKING — dramatic zoom bg */
  const booking = document.getElementById('booking');
  if (booking) {
    gsap.fromTo(booking.querySelector('.booking-bg'),
      { scale: 1.1 },
      { scale: 1, filter: 'brightness(0.2) saturate(0.6)', duration: 1.5, ease: 'power2.out',
        scrollTrigger: { trigger: booking, start: 'top 80%' } }
    );
    gsap.from(booking.querySelectorAll('.booking-content h2, .booking-sub, .booking-actions'), {
      opacity: 0, y: 80, duration: 1.2, ease: 'power4.out', stagger: 0.2,
      scrollTrigger: { trigger: booking, start: 'top 68%' },
    });
  }
}

// ── FALLBACK ANIMATIONS (IntersectionObserver) ───────────────
function initFallbacks() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = pct + '%';
  }, { passive: true });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.manifesto-word, .g-item').forEach(el => obs.observe(el));
  revealHero();
}

// ── HERO PARALLAX ON SCROLL ──────────────────────────────────
if (!REDUCE_MOTION) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (y >= vh) return;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${y * 0.28}px)`;
      heroContent.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)));
    }
    const heroVid = document.querySelector('.hero-video');
    if (heroVid) heroVid.style.transform = `scale(1.05) translateY(${y * 0.08}px)`;
  }, { passive: true });
}

// ── SOUND TOGGLE ─────────────────────────────────────────────
const heroVid   = document.querySelector('.hero-video');
const soundBtn  = document.getElementById('hero-sound-btn');
const soundIcon = soundBtn?.querySelector('.sound-icon');
if (heroVid && soundBtn) {
  const updateSound = () => {
    if (soundIcon && window.JSIcons) {
      soundIcon.innerHTML = window.JSIcons.get(heroVid.muted ? 'volumeX' : 'volume2');
    }
  };
  updateSound();
  soundBtn.addEventListener('click', () => {
    heroVid.muted = !heroVid.muted;
    updateSound();
  });
}

// ── PAUSE OFF-SCREEN VIDEOS ──────────────────────────────────
if ('IntersectionObserver' in window) {
  const vidObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('video').forEach(v => vidObserver.observe(v));
}

// ── MOBILE NAV ───────────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active').toString());
  navLinks?.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ── GALLERY LIGHTBOX ─────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lightbox-img');
const lbClose  = document.getElementById('lightbox-close');
const lbPrev   = document.getElementById('lightbox-prev');
const lbNext   = document.getElementById('lightbox-next');
let galleryItems = [], currentIndex = 0;

function openLightbox(i) {
  currentIndex = i;
  lbImg.src = galleryItems[i].querySelector('img').src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lenis?.stop();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lenis?.start();
}
function showAt(i) {
  currentIndex = (i + galleryItems.length) % galleryItems.length;
  lbImg.src = galleryItems[currentIndex].querySelector('img').src;
}

document.querySelectorAll('.g-item').forEach((el, i) => {
  galleryItems.push(el);
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.addEventListener('click', () => openLightbox(i));
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
});
lbClose?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', () => showAt(currentIndex - 1));
lbNext?.addEventListener('click', () => showAt(currentIndex + 1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showAt(currentIndex - 1);
  if (e.key === 'ArrowRight') showAt(currentIndex + 1);
});

// ── STAT COUNTERS ─────────────────────────────────────────────
function animateCounter(el, target, suffix = '', dur = 1800) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target).toLocaleString('es-ES') + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.target, 10), e.target.dataset.suffix || '');
      cObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => cObs.observe(el));

// ── SERVICES DATA RENDER ──────────────────────────────────────
async function loadServiceCards() {
  const track = document.querySelector('.services-track');
  const dotsContainer = document.querySelector('.services-dots');
  if (!track) return;

  // Static cards defined in HTML — just build dots
  const cards = track.querySelectorAll('.service-cinema-card');
  if (dotsContainer && cards.length) {
    dotsContainer.innerHTML = Array.from(cards).map((_, i) =>
      `<div class="services-dot${i === 0 ? ' active' : ''}"></div>`
    ).join('');
  }
}

// ── INIT ─────────────────────────────────────────────────────
window.addEventListener('load', () => {
  initGSAP();
  loadServiceCards();
});
