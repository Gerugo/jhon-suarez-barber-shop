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
  if (!loader) return;

  let count = 5;

  labelEl.style.opacity = '1';
  countEl.style.opacity = '1';
  countEl.textContent   = count;

  const grain = document.querySelector('.grain');
  if (grain) grain.style.opacity = '1';

  function finish() {
    countEl.textContent = '▶';
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
        revealHero();
      }, 900);
    }, 300);
  }

  if (REDUCE_MOTION) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => { loader.style.display = 'none'; revealHero(); }, 400);
    }, 300);
    return;
  }

  const interval = setInterval(() => {
    count--;
    const progress = ((5 - count) / 5) * 100;
    barFill.style.transition = 'width 0.18s ease';
    barFill.style.width = progress + '%';

    if (count <= 0) {
      clearInterval(interval);
      finish();
    } else {
      countEl.style.opacity = '0';
      setTimeout(() => {
        countEl.textContent = count;
        countEl.style.opacity = '1';
      }, 100);
    }
  }, 600);
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

  resize();
  particles = Array.from({ length: 100 }, mkParticle);
  window.addEventListener('resize', resize, { passive: true });

  ctx = canvas.getContext('2d');

  function loop() {
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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
  loop();
})();

// ── HERO REVEAL ──────────────────────────────────────────────
function revealHero() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.hero-eyebrow, .hero-title-word, .hero-tagline, .hero-actions, .hero-scroll-hint')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  gsap.timeline()
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .to('.hero-title-word', {
      y: 0, z: 0, opacity: 1,
      duration: 1.3,
      ease: 'power4.out',
      stagger: 0.14,
    }, '-=0.5')
    .to('.hero-tagline',      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
    .to('.hero-actions',      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to('.hero-scroll-hint',  { opacity: 1, duration: 0.7 }, '-=0.3');
}

// ── LENIS SMOOTH SCROLL ──────────────────────────────────────
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.4,
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
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
