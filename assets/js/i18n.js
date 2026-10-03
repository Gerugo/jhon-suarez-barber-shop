/* ============================================================
   JHON SUAREZ BARBER SHOP — BILINGUAL I18N SYSTEM (ES / EN)
   Optimized for local residents & US Naval Station Rota community
   ============================================================ */
'use strict';

const I18N_TRANSLATIONS = {
  es: {
    // Navigation
    nav_about: 'Nosotros',
    nav_services: 'Servicios',
    nav_gallery: 'Galería',
    nav_reviews: 'Reseñas',
    nav_estetica: 'Estética',
    nav_location: 'Ubicación',
    nav_cta: 'Reservar Cita',

    // Hero
    hero_eyebrow: 'Barbería Premium en Rota, Cádiz · Est. 2016',
    hero_subtitle: 'El arte del corte perfecto & bienestar total',
    hero_btn_book: 'Reservar Cita',
    hero_btn_services: 'Ver Servicios',
    hero_btn_discover: 'Descubrir',

    // Stats
    stat_years: 'Años de experiencia',
    stat_clients: 'Clientes satisfechos',
    stat_services: 'Servicios disponibles',
    stat_rating: 'Valoración Booksy',

    // About
    about_label: 'Sobre nosotros',
    about_title_1: 'Más que un',
    about_title_2: 'corte,',
    about_title_3: 'una experiencia.',
    about_p1: 'En <strong>Jhon Suarez Barber Shop</strong> combinamos la tradición barbera con técnicas modernas para ofrecerte el corte perfecto que encaja con tu estilo y personalidad. Cada detalle importa: desde el primer apretón de manos hasta el acabado final.',
    about_p2: 'Junto a <strong>Alejandra Studio</strong>, tu espacio de bienestar completo: extensiones de pestañas, depilación, masajes relajantes y tratamientos faciales de última generación — todo bajo el mismo techo.',
    about_btn: 'Explorar servicios →',
    about_badge_years: 'AÑOS',

    // Elite / Champions
    elite_badge: 'La Confianza de los Campeones',
    elite_title_1: 'CLIENTES DE',
    elite_title_2: 'ÉLITE MUNDIAL',
    elite_subtitle: 'Barbero oficial de alto rendimiento · Campeón en Fade & Freestyle. La máxima exigencia del fútbol mundial y la comunidad de la Base Naval de Rota.',
    elite_verified_tag: 'Corte Oficial Jhon Suárez',
    elite_stat_1_val: 'CAMPEÓN',
    elite_stat_1_lbl: 'Fade & Freestyle Hair Art',
    elite_stat_2_val: 'ALTO RENDIMIENTO',
    elite_stat_2_lbl: 'Futbolistas Élite & Base Naval',
    elite_stat_3_val: '4.96 ★★★★★',
    elite_stat_3_lbl: '+95 Reseñas Reales Booksy',
    elite_stat_4_val: 'EST. 2016',
    elite_stat_4_lbl: '+10 Años en Rota, Cádiz',
    bellingham_name: 'JUDE BELLINGHAM',
    bellingham_team: 'Real Madrid · Selección de Inglaterra',
    bellingham_tag: 'Estrella Mundial',
    bellingham_style: 'Mid Fade & Textured Crop',
    bellingham_desc: 'Precisión milimétrica y control en cada línea. La calma y seguridad requeridas para competir en el Bernabéu y la Champions League.',
    alaba_name: 'DAVID ALABA',
    alaba_team: 'Real Madrid · Selección de Austria',
    alaba_tag: 'Campeón de Europa',
    alaba_style: 'Signature Taper Fade & Razor Edge',
    alaba_desc: 'Elegancia refinada, perfilado artesanal y pulcritud absoluta para una figura legendaria del fútbol continental.',
    rudiger_name: 'ANTONIO RÜDIGER',
    rudiger_team: 'Real Madrid · Selección de Alemania',
    rudiger_tag: 'Titán Defensivo',
    rudiger_style: 'High Skin Fade & Beard Sculpting',
    rudiger_desc: 'Degradado radical al cero, definición quirúrgica y esculpido de barba milimétrico. Máximo impacto y carácter imponente.',
    ceballos_name: 'DANI CEBALLOS',
    ceballos_team: 'Real Madrid · Selección Española',
    ceballos_tag: 'Talento Andaluz',
    ceballos_style: 'Classic Low Fade & Modern Texture',
    ceballos_desc: 'El compás y el arte del sur fusionados con las tendencias más vanguardistas. Orgullo andaluz en la cúspide del fútbol mundial.',
    elite_quote: '«Tu imagen, en manos de un campeón»',
    elite_quote_sub: 'El mismo nivel de detalle, concentración y maestría que exigen las estrellas mundiales, dedicado a cada cliente en nuestro sillón de Rota.',
    elite_ig_btn: 'Ver trabajos en @johnsuarezelitecuts',

    // Services
    services_label: 'Lo que ofrecemos',
    services_title_1: 'Nuestros',
    services_title_2: 'Servicios',
    services_hint: 'Pasa el cursor sobre cada tarjeta para ver la descripción y reservar.',
    tab_all: 'Todos',
    book_chip: 'Reservar cita',
    book_now: 'Reservar',

    // Reviews
    reviews_label: 'Opiniones reales',
    reviews_title_html: 'Lo que dicen <span class="text-gold">nuestros clientes</span>',

    // Location
    location_label: 'Encuéntranos',
    location_title_html: 'Visítanos en <span class="text-blue">Rota</span>',
    loc_address_title: 'Dirección',
    loc_hours_title: 'Horario',
    loc_hours_val: 'Lunes – Viernes: 10:00 – 14:00 | 16:00 – 20:00<br>Sábados: 10:00 – 16:00<br>Domingos: 12:00 – 16:00',
    loc_contact_title: 'Teléfono & Citas',
    loc_subtext: 'Reserva online 24/7 vía Booksy',
    loc_call_btn: 'Llamar al local',
    loc_directions_btn: 'Cómo llegar',

    // Estetica Studio
    estetica_title_html: 'Tu espacio de<br><span style="color:var(--purple)">relajación</span><br>y belleza',
    estetica_desc_html: '<strong>Alejandra Studio</strong> es tu santuario de belleza y bienestar dentro de JS Barber Shop. Extensiones de pestañas premium, tratamientos faciales con Dermapen, masajes relajantes y depilación profesional — todo en un ambiente cálido y exclusivo.',
    estetica_badge_video: 'SALA ORIGINAL · EN VIVO',
    estetica_tag_lashes: 'Pestañas',
    estetica_tag_massage: 'Masajes',
    estetica_tag_wax: 'Depilación',
    estetica_photo_room: 'Sala Principal',
    estetica_photo_spa: 'Rincón Spa',
    estetica_photo_lamp: 'Lámpara Moon',
    estetica_photo_camilla: 'Camilla & Confort',
    estetica_photo_menu: 'Carta de Servicios',
    estetica_photo_lash1: 'Pestañas Volumen',
    estetica_photo_lash2: 'Lifting de Pestañas',
    estetica_photo_lash3: 'Diseño de Mirada',

    // Booking CTA
    booking_title: '¿Listo para tu mejor corte?',
    booking_sub: 'Reserva tu cita en menos de 2 minutos vía Booksy.',
    booking_btn: 'Reservar en Booksy',
    booking_call: 'Llamar',
    cta_final_label: '¿Listo para el cambio?',
    cta_final_title_html: 'RESERVA<br><span class="text-blue">TU</span><br>CITA',
    cta_final_sub: 'El mejor momento para tu nuevo look es ahora.',
    cta_final_all_services: 'Ver todos los servicios',

    // Footer
    footer_desc: 'Barbería premium y centro de estética en Rota (Cádiz). Arte, precisión y bienestar en un mismo espacio.',
    footer_col_services: 'Servicios',
    footer_col_info: 'Información',
    footer_copy: '© 2026 Jhon Suarez Barber Shop · Todos los derechos reservados',
    footer_booksy: 'Reservas en Booksy →',

    // Premium Cinema Specific
    manifesto_label: 'Nuestra filosofía',
    manifesto_w1: 'PRECISIÓN',
    manifesto_w2: 'ARTE',
    manifesto_w3: 'PODER',
    manifesto_year: 'Desde 2016 · Calle San Juan Bosco, Rota',
    cinema_about_label: 'Quiénes somos',
    cinema_about_h2_html: 'Donde la<br><span style="color:var(--blue)">precisión</span><br>es un arte',
    cinema_about_p1: 'En <strong>Jhon Suarez Barber Shop</strong> creemos que un buen corte es mucho más que pelo. Es confianza, es identidad, es la primera impresión que el mundo tiene de ti. Por eso nos tomamos cada servicio con dedicación absoluta.',
    cinema_about_p2: 'Ubicados en <strong>Calle San Juan Bosco, 5, Rota (Cádiz)</strong>, ofrecemos una experiencia premium en un espacio diseñado con luces hexagonales únicas, sillas de barbero clásicas y la atmósfera exclusiva del azul eléctrico que nos define.',
    cinema_feat_1: 'Fades de precisión milimétrica',
    cinema_feat_2: 'Diseños personalizados únicos',
    cinema_feat_3: 'Barbería + Estética bajo un techo',
    cinema_feat_4: 'Reserva online 24/7 vía Booksy',
    cinema_feat_5: 'Productos premium exclusivos',
    cinema_feat_6: 'Más de 5 000 clientes satisfechos',
    cinema_services_title_html: 'Nuestros<br><span style="color:var(--blue)">Servicios</span>',
    cinema_services_hint: 'Desliza para explorar',
    cinema_card_1_cat: 'Barbería clásica',
    cinema_card_1_desc: 'El fade medio perfecto — degradado suave de la nuca a los laterales con acabado impecable. La firma de Jhon Suarez.',
    cinema_card_2_cat: 'Barbería artística',
    cinema_card_2_desc: 'Transición gradual ultraprecisa desde los laterales, con textura y forma que resalta tu estilo personal.',
    cinema_card_3_cat: 'Alto contraste',
    cinema_card_3_desc: 'El degradado más radical — hasta piel limpia. Para los que buscan máximo impacto y un look urbano sin concesiones.',
    cinema_card_4_cat: 'Para los más pequeños',
    cinema_card_4_name: 'CORTE INFANTIL',
    cinema_card_4_desc: 'De 2 a 12 años. Un ambiente tranquilo y divertido para que el primer corte sea una experiencia especial. Incluye detalle sorpresa.',
    cinema_card_5_cat: 'Experiencia familiar',
    cinema_card_5_name: 'PACK PADRE & HIJO',
    cinema_card_5_desc: 'El mejor plan del fin de semana — corte para papá + corte para el pequeño, con regalo sorpresa incluido para los niños.',
    cinema_card_6_cat: 'Alejandra Studio',
    cinema_card_6_name: 'LIFTING PESTAÑAS',
    cinema_card_6_desc: 'Curvado y tinte natural que estiliza la mirada sin necesidad de máscara. Duración de 6-8 semanas. Resultado natural y luminoso.',
    cinema_card_7_cat: 'Servicio premium',
    cinema_card_7_name: 'RELAX BARBER',
    cinema_card_7_desc: 'La experiencia completa — corte + arreglo de barba + masaje de espalda 20 min. Sales completamente renovado.',
    cinema_gallery_label: 'Nuestro trabajo',
    cinema_gallery_title_html: 'La <span style="color:var(--gold)">Galería</span>',
    cinema_estetica_label: 'Belleza & bienestar',
    cinema_estetica_p1: 'Dentro del mismo espacio, <strong>Alejandra Studio</strong> es tu santuario de belleza y bienestar. Tratamientos faciales, pestañas perfectas, masajes relajantes y depilación profesional — todo en un ambiente cálido y exclusivo.',
    cinema_estetica_p2: 'Porque la belleza no tiene género ni límites — aquí todos encontráis lo que buscáis para sentiros extraordinarios.',
    cinema_estetica_btn: 'Reservar en Alejandra Studio',
    cinema_booking_title_html: '<span class="tl">TU</span><br><span class="tl line-blue">MOMENTO</span><br><span class="tl line-gold">HOY</span>',
    cinema_booking_sub: 'Reserva en segundos. Cancela cuando quieras.',
    cinema_footer_desc: 'Barbería premium & estética en Rota, Cádiz.<br>Jhon Suarez Barber Shop + Alejandra Studio.<br>Calle San Juan Bosco, 5, Local 2 · 11520 Rota, Cádiz',
    cinema_footer_copy: '© 2026 Jhon Suarez Barber Shop · Rota, Cádiz',
    cinema_footer_standard: 'Versión Estándar →',
    cinema_footer_origin: 'Diseñado con pasión en Andalucía'
  },
  en: {
    // Navigation
    nav_about: 'About Us',
    nav_services: 'Services',
    nav_gallery: 'Gallery',
    nav_reviews: 'Reviews',
    nav_estetica: 'Aesthetics',
    nav_location: 'Location',
    nav_cta: 'Book Appointment',

    // Hero
    hero_eyebrow: 'Premium Barber Shop in Rota, Spain · Est. 2016',
    hero_subtitle: 'The art of precision cuts & complete wellness',
    hero_btn_book: 'Book Appointment',
    hero_btn_services: 'View Services',
    hero_btn_discover: 'Explore',

    // Stats
    stat_years: 'Years of Experience',
    stat_clients: 'Satisfied Clients',
    stat_services: 'Available Services',
    stat_rating: 'Booksy Rating',

    // About
    about_label: 'About Us',
    about_title_1: 'More than a',
    about_title_2: 'haircut,',
    about_title_3: 'an experience.',
    about_p1: 'At <strong>Jhon Suarez Barber Shop</strong> we combine classic barbering tradition with modern precision techniques to deliver the sharpest cut tailored to your style. Every detail matters: from the hot towel ritual to the razor-sharp finish.',
    about_p2: 'Together with <strong>Alejandra Studio</strong>, your complete wellness sanctuary: lash extensions, waxing, relaxing massage therapy, and advanced facial treatments — all under one roof near Naval Station Rota.',
    about_btn: 'Explore services →',
    about_badge_years: 'YEARS',

    // Elite / Champions
    elite_badge: 'The Choice of Champions',
    elite_title_1: 'WORLD-CLASS',
    elite_title_2: 'ELITE CLIENTELE',
    elite_subtitle: 'Official high-performance master barber · Fade & Freestyle Champion. Trusted by international football icons and the US Naval Base community.',
    elite_verified_tag: 'Official Jhon Suárez Cut',
    elite_stat_1_val: 'CHAMPION',
    elite_stat_1_lbl: 'Fade & Freestyle Hair Art',
    elite_stat_2_val: 'HIGH PERFORMANCE',
    elite_stat_2_lbl: 'Pro Footballers & Naval Base',
    elite_stat_3_val: '4.96 ★★★★★',
    elite_stat_3_lbl: '+95 Verified Booksy Reviews',
    elite_stat_4_val: 'EST. 2016',
    elite_stat_4_lbl: '+10 Years in Rota, Spain',
    bellingham_name: 'JUDE BELLINGHAM',
    bellingham_team: 'Real Madrid · England National Team',
    bellingham_tag: 'World Football Icon',
    bellingham_style: 'Mid Fade & Textured Crop',
    bellingham_desc: 'Razor-sharp precision and flawless hairline control. The supreme confidence required for Champions League and Santiago Bernabéu matchdays.',
    alaba_name: 'DAVID ALABA',
    alaba_team: 'Real Madrid · Austria National Team',
    alaba_tag: 'European Champion',
    alaba_style: 'Signature Taper Fade & Razor Edge',
    alaba_desc: 'Refined elegance, bespoke razor edging, and pristine craftsmanship for a continental football icon.',
    rudiger_name: 'ANTONIO RÜDIGER',
    rudiger_team: 'Real Madrid · Germany National Team',
    rudiger_tag: 'Defensive Titan',
    rudiger_style: 'High Skin Fade & Beard Sculpting',
    rudiger_desc: 'Zero-skin high fade, surgical precision lines, and sculpted beard contouring. Maximum visual impact and commanding warrior presence.',
    ceballos_name: 'DANI CEBALLOS',
    ceballos_team: 'Real Madrid · Spain National Team',
    ceballos_tag: 'Andalusian Maestro',
    ceballos_style: 'Classic Low Fade & Modern Texture',
    ceballos_desc: 'Southern rhythm and Andalusian artistry blended with modern barber trends. Proud local roots at the pinnacle of European football.',
    elite_quote: '«Your image, in the hands of a champion»',
    elite_quote_sub: 'The exact same standard of precision, focus, and artistry demanded by world champions, dedicated to every client in our chair in Rota.',
    elite_ig_btn: 'Explore cuts on @johnsuarezelitecuts',

    // Services
    services_label: 'What We Offer',
    services_title_1: 'Our',
    services_title_2: 'Services',
    services_hint: 'Hover or tap each card to view details and book online.',
    tab_all: 'All',
    book_chip: 'Book appointment',
    book_now: 'Book Now',

    // Reviews
    reviews_label: 'Client Reviews',
    reviews_title_html: 'What our clients <span class="text-gold">say about us</span>',

    // Location
    location_label: 'Find Us',
    location_title_html: 'Visit Us in <span class="text-blue">Rota</span>',
    loc_address_title: 'Address',
    loc_hours_title: 'Opening Hours',
    loc_hours_val: 'Monday – Friday: 10:00 – 14:00 | 16:00 – 20:00<br>Saturday: 10:00 – 16:00<br>Sunday: 12:00 – 16:00',
    loc_contact_title: 'Phone & Appointments',
    loc_subtext: 'Book online 24/7 via Booksy',
    loc_call_btn: 'Call the shop',
    loc_directions_btn: 'Get directions',

    // Estetica Studio
    estetica_title_html: 'Your sanctuary for<br><span style="color:var(--purple)">relaxation</span><br>&amp; beauty',
    estetica_desc_html: '<strong>Alejandra Studio</strong> is your beauty and wellness haven inside JS Barber Shop. Premium lash extensions, Dermapen facials, relaxing massage therapy, and professional waxing — in a warm, private atmosphere.',
    estetica_badge_video: 'ORIGINAL STUDIO · IN MOTION',
    estetica_tag_lashes: 'Lashes',
    estetica_tag_massage: 'Massage',
    estetica_tag_wax: 'Waxing',
    estetica_photo_room: 'Main Studio',
    estetica_photo_spa: 'Spa Rituals',
    estetica_photo_lamp: 'Moon Lamp',
    estetica_photo_camilla: 'Treatment Bed',
    estetica_photo_menu: 'Services Menu',
    estetica_photo_lash1: 'Volume Lashes',
    estetica_photo_lash2: 'Lash Lift',
    estetica_photo_lash3: 'Brow Shaping',

    // Booking CTA
    booking_title: 'Ready for your sharpest look?',
    booking_sub: 'Book your appointment online in under 2 minutes via Booksy.',
    booking_btn: 'Book on Booksy',
    booking_call: 'Call Now',
    cta_final_label: 'Ready for a change?',
    cta_final_title_html: 'BOOK<br><span class="text-blue">YOUR</span><br>VISIT',
    cta_final_sub: 'The best moment for your fresh look is right now.',
    cta_final_all_services: 'View all services',

    // Footer
    footer_desc: 'Premium barber shop and aesthetics studio in Rota (Cadiz). Art, precision and grooming under one roof.',
    footer_col_services: 'Services',
    footer_col_info: 'Information',
    footer_copy: '© 2026 Jhon Suarez Barber Shop · All rights reserved',
    footer_booksy: 'Book on Booksy →',

    // Premium Cinema Specific
    manifesto_label: 'Our Philosophy',
    manifesto_w1: 'PRECISION',
    manifesto_w2: 'ART',
    manifesto_w3: 'POWER',
    manifesto_year: 'Since 2016 · Calle San Juan Bosco, Rota',
    cinema_about_label: 'Who We Are',
    cinema_about_h2_html: 'Where<br><span style="color:var(--blue)">precision</span><br>is an art',
    cinema_about_p1: 'At <strong>Jhon Suarez Barber Shop</strong> we believe a great haircut is much more than hair. It is confidence, identity, and the first impression you make on the world. That is why we treat every client with supreme craftsmanship.',
    cinema_about_p2: 'Located on <strong>Calle San Juan Bosco, 5, Rota (Cadiz)</strong>, we offer a bespoke lounge designed with signature hexagonal lighting, classic barber chairs, and the exclusive electric blue atmosphere.',
    cinema_feat_1: 'Razor-sharp precision fades',
    cinema_feat_2: 'Custom signature hair designs',
    cinema_feat_3: 'Barbershop + Aesthetics under one roof',
    cinema_feat_4: 'Online booking 24/7 via Booksy',
    cinema_feat_5: 'Exclusive grooming products',
    cinema_feat_6: 'Over 5,000 satisfied clients',
    cinema_services_title_html: 'Our<br><span style="color:var(--blue)">Services</span>',
    cinema_services_hint: 'Swipe to explore',
    cinema_card_1_cat: 'Classic Barbershop',
    cinema_card_1_desc: 'The signature medium fade — smooth, seamless gradient from nape to sides with a razor-sharp finish.',
    cinema_card_2_cat: 'Artistic Grooming',
    cinema_card_2_desc: 'Ultra-precise gradual taper from temple and neck, accentuating texture and natural head shape.',
    cinema_card_3_cat: 'High Contrast',
    cinema_card_3_desc: 'The cleanest zero-skin blend down to the foil shaver. For a sharp, bold statement with clean lines.',
    cinema_card_4_cat: 'Young Gentlemen',
    cinema_card_4_name: 'KIDS CUT',
    cinema_card_4_desc: 'Ages 2 to 12. A fun, patient, and welcoming atmosphere to make every haircut comfortable and enjoyable.',
    cinema_card_5_cat: 'Family Experience',
    cinema_card_5_name: 'FATHER & SON COMBO',
    cinema_card_5_desc: 'The ultimate weekend bonding experience — haircut for dad + cut for the young champ.',
    cinema_card_6_cat: 'Alejandra Studio',
    cinema_card_6_name: 'LASH LIFT',
    cinema_card_6_desc: 'Natural curl and tint to enhance your look without mascara. Lasts 6-8 weeks with an effortless radiant finish.',
    cinema_card_7_cat: 'Signature Experience',
    cinema_card_7_name: 'RELAX BARBER',
    cinema_card_7_desc: 'The complete gentleman ritual — haircut + beard sculpting + 20-min back massage. Pure restoration.',
    cinema_gallery_label: 'Our Portfolio',
    cinema_gallery_title_html: 'The <span style="color:var(--gold)">Gallery</span>',
    cinema_estetica_label: 'Beauty & Wellness',
    cinema_estetica_p1: 'Within the same studio, <strong>Alejandra Studio</strong> is your sanctuary for beauty and self-care. Advanced facial treatments, bespoke lash extensions, relaxation massage, and professional waxing — in a warm, private atmosphere.',
    cinema_estetica_p2: 'Because beauty knows no limits — everyone finds their sanctuary to look and feel extraordinary.',
    cinema_estetica_btn: 'Book at Alejandra Studio',
    cinema_booking_title_html: '<span class="tl">YOUR</span><br><span class="tl line-blue">TIME IS</span><br><span class="tl line-gold">NOW</span>',
    cinema_booking_sub: 'Book in seconds. Cancel anytime.',
    cinema_footer_desc: 'Premium barber shop & aesthetics in Rota (Cadiz).<br>Jhon Suarez Barber Shop + Alejandra Studio.<br>Calle San Juan Bosco, 5, Local 2 · 11520 Rota, Spain',
    cinema_footer_copy: '© 2026 Jhon Suarez Barber Shop · Rota, Spain',
    cinema_footer_standard: 'Standard Version →',
    cinema_footer_origin: 'Crafted with passion in Andalusia'
  }
};

const JSI18n = (function() {
  let currentLang = 'es';

  function init() {
    const saved = localStorage.getItem('js_lang');
    if (saved && (saved === 'es' || saved === 'en')) {
      currentLang = saved;
    } else {
      // Auto-detect American Navy community or English speakers
      const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (browserLang.startsWith('en')) {
        currentLang = 'en';
      } else {
        currentLang = 'es';
      }
    }

    applyLanguage(currentLang);
    bindButtons();
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('js_lang', lang);
    document.documentElement.setAttribute('lang', lang);

    const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.es;

    // Translate standard text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // If element contains SVG icons as children, preserve them
        const svg = el.querySelector('.js-icon');
        if (svg) {
          el.innerHTML = '';
          el.appendChild(svg);
          el.appendChild(document.createTextNode(' ' + dict[key]));
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Translate HTML nodes
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Update active state on all language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      const isActive = btnLang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Notify custom listeners (e.g. main.js services re-render)
    window.dispatchEvent(new CustomEvent('js_lang_changed', { detail: { lang: lang } }));
  }

  function bindButtons() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang && targetLang !== currentLang) {
        applyLanguage(targetLang);
      }
    });
  }

  function getLang() {
    return currentLang;
  }

  return {
    init: init,
    setLanguage: applyLanguage,
    getLang: getLang,
    t: function(key) {
      const dict = I18N_TRANSLATIONS[currentLang] || I18N_TRANSLATIONS.es;
      return dict[key] || key;
    }
  };
})();

// Auto-run when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', JSI18n.init);
} else {
  JSI18n.init();
}

window.JSI18n = JSI18n;
