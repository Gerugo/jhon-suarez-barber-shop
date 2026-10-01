/* ============================================================
   JHON SUAREZ BARBER SHOP — Main JS
   ============================================================ */
'use strict';

// ── Loader ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
  }, 1800);
});

// ── Navbar scroll ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── Mobile menu ──────────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks?.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ── Reveal on scroll (IntersectionObserver) ──────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString('es-ES') + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target, 10);
      animateCounter(e.target, target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Services — load from JSON & tabs ─────────────────────────
const BOOKSY_URL = 'https://booksy.com/es-es/140555_jhon-suarez-barber-shop_barberia_26736_rincones';

async function loadServices() {
  const grid = document.getElementById('services-grid');
  const tabsContainer = document.getElementById('category-tabs');
  if (!grid || !tabsContainer) return;

  let data;
  try {
    const res = await fetch('data/services.json');
    data = await res.json();
  } catch {
    grid.innerHTML = '<p style="color:var(--gray);text-align:center">No se pudo cargar los servicios.</p>';
    return;
  }

  // Build tabs
  tabsContainer.innerHTML = `<button class="tab-btn active" data-cat="all">Todos</button>` +
    data.categories.map(c => {
      const iconSvg = window.JSIcons ? window.JSIcons.get(c.icon) : '';
      return `<button class="tab-btn" data-cat="${c.id}" style="--tab-color:${c.color}">${iconSvg} <span>${c.name}</span></button>`;
    }).join('');

  // Build cards
  function renderCards(catId) {
    const cats = catId === 'all' ? data.categories : data.categories.filter(c => c.id === catId);
    const cards = cats.flatMap(c =>
      c.services.map(s => {
        const iconSvg = window.JSIcons ? window.JSIcons.get(s.icon || c.icon || 'scissors') : '';
        const clockSvg = window.JSIcons ? window.JSIcons.get('clock') : '';
        const calSvg = window.JSIcons ? window.JSIcons.get('calendar') : '';
        return `
        <article class="service-card reveal" tabindex="0">
          <div class="service-card-inner">
            <div class="service-front">
              <div>
                <div class="service-icon-wrap">${iconSvg}</div>
                <div class="service-name">${s.name}</div>
              </div>
              <div class="service-meta">
                <span class="service-price">${s.price}</span>
                <span class="service-duration">${clockSvg} ${s.duration}</span>
              </div>
            </div>
            <div class="service-back">
              <p class="service-desc">${s.desc}</p>
              <div>
                <div class="service-price-lg">${s.price}</div>
                <a href="${BOOKSY_URL}" target="_blank" rel="noopener" class="book-chip">
                  ${calSvg} Reservar cita
                </a>
              </div>
            </div>
          </div>
        </article>
      `;
      })
    ).join('');

    grid.innerHTML = cards;

    // Re-observe new cards
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 0.06}s`;
      revealObserver.observe(el);
    });
  }

  renderCards('all');

  // Tab click
  tabsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.cat);
    // Scroll grid into view smoothly
    grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

loadServices();

// ── Gallery Lightbox ─────────────────────────────────────────
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lightbox-img');
const lbClose    = document.getElementById('lightbox-close');
const lbPrev     = document.getElementById('lightbox-prev');
const lbNext     = document.getElementById('lightbox-next');
let galleryItems = [];
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lbImg.src = galleryItems[index].querySelector('img').src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function showLightboxAt(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  lbImg.src = galleryItems[currentIndex].querySelector('img').src;
}

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  galleryItems.push(item);
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(i); });
});

lbClose?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', () => showLightboxAt(currentIndex - 1));
lbNext?.addEventListener('click', () => showLightboxAt(currentIndex + 1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showLightboxAt(currentIndex - 1);
  if (e.key === 'ArrowRight')  showLightboxAt(currentIndex + 1);
});

// ── Parallax hero bg ──────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
  }, { passive: true });
}

// ── Sound Toggle for Hero Video ──────────────────────────────
const heroVideo = document.querySelector('.hero-video');
const soundBtn  = document.getElementById('hero-sound-toggle');
const soundIcon = soundBtn?.querySelector('.sound-icon');

if (heroVideo && soundBtn) {
  const updateSoundIcon = () => {
    if (soundIcon && window.JSIcons) {
      soundIcon.innerHTML = window.JSIcons.get(heroVideo.muted ? 'volumeX' : 'volume2');
    }
    soundBtn.title = heroVideo.muted ? 'Activar sonido' : 'Silenciar sonido';
  };
  updateSoundIcon();
  soundBtn.addEventListener('click', () => {
    heroVideo.muted = !heroVideo.muted;
    updateSoundIcon();
  });
}

// ── 3D Interactive Tilt on Cursor Move ──────────────────────
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    let bounds;
    function updateBounds() {
      bounds = card.getBoundingClientRect();
    }
    card.addEventListener('mouseenter', updateBounds);
    card.addEventListener('mousemove', (e) => {
      if (!bounds) updateBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = mouseX / bounds.width - 0.5;
      const yPct = mouseY / bounds.height - 0.5;
      const rotateX = -yPct * 16;
      const rotateY = xPct * 16;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ── 3D Scroll Depth Effect ──────────────────────────────────
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Parallax on hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
    }
  }, { passive: true });
}

