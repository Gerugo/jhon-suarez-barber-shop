# Auditoría Técnica — Efecto Cine al Scroll en premium.html (Fase 0)

Fecha: 01 de Octubre de 2026
Entorno: Windows 10 (PowerShell), Python 3.12.4, Node v24.19.0

---

## 1. Dónde vive el CSS y el JS y qué rutas usan

- **HTML principal:** `premium.html`
- **CSS:**
  - `assets/css/premium.css` (estilos globales, tema oscuro, layouts cinema)
  - Fuentes de Google Fonts: Bebas Neue, Playfair Display, Inter
- **JS Externo (CDN en `<head>`):**
  - Lenis: `https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/bundled/lenis.min.js`
  - GSAP: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`
  - ScrollTrigger: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js`
- **JS Local:**
  - `assets/js/icons.js` (cargado en `<head>`)
  - `assets/js/premium.js` (cargado antes de `</body>`)

---

## 2. Librerías ya presentes y sus versiones

- **Lenis:** `@studio-freight/lenis@1.0.42`
- **GSAP:** `3.12.5`
- **ScrollTrigger:** `3.12.5`
- **Diagnóstico:** Ya están cargadas e integradas. No se deben volver a inyectar en `<head>` ni en el footer para evitar duplicados y fugas de memoria.

---

## 3. Cómo funciona el scroll horizontal de `#services-cinema`

- Se gestiona en `assets/js/premium.js` (líneas 230-256) mediante GSAP ScrollTrigger con `pin: true`.
- Anima la propiedad `x` de `.services-track` calculando `getWidth = () => track.scrollWidth - window.innerWidth + 160`.
- El scrub está sincronizado con la rueda vía Lenis y `gsap.ticker`.
- **Recomendación:** No alterar `#services-cinema` y añadir `data-lenis-prevent` si fuera necesario en dispositivos táctiles.

---

## 4. Cómo se actualizan el contador `01 / 08` y la barra de progreso

- **Barra de progreso:** Se vincula a un ScrollTrigger global (`start: 'top top', end: 'bottom bottom'`) que actualiza el ancho porcentual de `#progress-bar`.
- **Contador de escenas (`01 / 08`):** Se itera sobre una lista de IDs de sección:
  `['hero', 'manifesto', 'about-cinema', 'services-cinema', 'gallery-cinema', 'artistry', 'estetica-cinema', 'booking']`
  activando el número correspondiente cuando cada sección alcanza `top 60%`.
- Ambos mecanismos seguirán funcionando transparentemente al ampliar la altura de las escenas.

---

## 5. Manejador de smooth scroll propio o clics en `#ancla`

- `assets/js/premium.js` ya conecta Lenis a los eventos de scroll.
- **Acción:** `scroll-scenes.js` debe omitir `initSmoothScroll()` para no competir con el ticker de Lenis ya existente.

---

## 6. Detección de `overflow` en ancestros (`position: sticky`)

- En `assets/css/premium.css` (líneas 55 y 59):
  `html { overflow-x: hidden; }`
  `body { overflow-x: hidden; }`
- **Diagnóstico:** `overflow-x: hidden` puede anular `position: sticky` en algunos motores WebKit/Blink.
- **Solución:** Cambiar a `overflow-x: clip;` para permitir el funcionamiento óptimo de `position: sticky` sin provocar desbordamiento horizontal.

---

## 7. Pesos actuales de assets

- `assets/videos/hero.mp4`: **13.7 MB** (30 s, 1280x720)
- `assets/videos/clips/clip_a_hands.mp4`: **7.2 MB** (5 s, 1280x720) — *Escena B lista*
- `assets/videos/clips/clip_c_chair.mp4`: **5.3 MB** (5 s, 1280x720) — *Escena A candidata o sustituible por dolly Wan 3.0*
- `assets/videos/clips/clip_b_interior_20s.mp4`: **22.4 MB**
- Imágenes en `assets/images/`: **3.67 MB** en total (19 archivos).

---

## 8. Identificador real del bloque `clip_a_hands.mp4`

- El identificador es: `<section id="artistry">` (clase `.artistry-video-wrap`).

---

## 9. Recuento de enlaces Booksy

- Recuento exacto en `premium.html`: **12 enlaces** a `booksy.com`.

---

## 10. Herramientas instaladas en el sistema

- **Node.js:** v24.19.0 (Disponible)
- **Python:** 3.12.4 (Disponible)
- **FFmpeg:** No está en PATH global, pero **disponible en Python (`imageio_ffmpeg`)** con binario v7.1 en:
  `C:\Users\Gerugo\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe`
  con soporte completo nativo para el codificador **`libwebp`**.
- **Pillow & MoviePy:** Instalados con soporte WebP nativo verificado.
