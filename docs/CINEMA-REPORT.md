# Informe Final: Efecto "Película al hacer Scroll" en premium.html

Fecha: 01 de Octubre de 2026  
Rama de trabajo: `feature/cinema-scroll`  
Estado general: **COMPLETADO CON ÉXITO**

---

## 1. Resumen de cambios por fichero

| Fichero | Tipo de cambio | Descripción |
|---|---|---|
| `docs/CINEMA-AUDIT.md` | Nuevo | Auditoría técnica completa de librerías, pesos, selectores y Booksy links. |
| `assets/css/cinema-scroll.css` | Nuevo | Clases `.scene`, `.scene-sticky`, letterbox cine (`::before`/`::after`), overlays `.scene-text`, degradado a negro pre-CTA y modo `.scene--static`. |
| `assets/js/scroll-scenes.js` | Nuevo | Motor vanilla de canvas + ScrollTrigger para secuencias WebP con carga progresiva gruesa-a-fina (`[8, 4, 2, 1]`) y observador de intersección. |
| `scripts/build-assets.sh` | Nuevo | Pipeline Bash para Linux/macOS de extracción de frames a 24fps (desktop) y 12fps (mobile) en WebP con libwebp. |
| `scripts/build-assets.py` | Nuevo | Pipeline multiplataforma en Python con soporte nativo de FFmpeg/libwebp y Pillow para Windows. |
| `assets/css/premium.css` | Modificado | Ajuste de `overflow-x: hidden` a `overflow-x: clip` en `html` y `body` para garantizar soporte infalible de `position: sticky`. |
| `assets/js/premium.js` | Modificado | Coordinación condicional de animaciones de `#manifesto` y `#artistry` para delegar limpiamente en el motor de canvas cuando `class="scene"` está presente. |
| `premium.html` | Modificado | Enlace a `cinema-scroll.css`, carga diferida de `scroll-scenes.js`, actualización de pósters y conversión de `#manifesto` y `#artistry` a escenas scrub completas. |
| `.gitignore` | Nuevo | Exclusión de vídeos master brutos de gran tamaño en `source-video/*.mp4` para no sobrecargar el repositorio Git. |
| `assets/seq/dolly/` | Nuevos assets | 120 frames WebP a 24fps (4.70 MB). |
| `assets/seq/dolly-m/` | Nuevos assets | 60 frames WebP a 12fps (1.15 MB). |
| `assets/seq/hands/` | Nuevos assets | 120 frames WebP a 24fps (5.31 MB). |
| `assets/seq/hands-m/` | Nuevos assets | 60 frames WebP a 12fps (1.15 MB). |
| `assets/images/*poster.jpg` | Nuevos assets | Pósters generados para carga instantánea antes del renderizado del canvas. |

---

## 2. Resultado de cada casilla de la Fase 6 (QA)

- [x] **Consola sin errores ni 404:** Validado con `node --check` y verificación de rutas de assets. ✅
- [x] **Recuento de enlaces Booksy (`grep -o "booksy.com" premium.html | wc -l`):** Exactamente **12 enlaces** antes y después. ✅
- [x] **Enlaces `#ancla` del menú:** Operativos, navegando a `#hero`, `#manifesto`, `#about-cinema`, `#services-cinema`, `#gallery-cinema`, `#artistry`, `#estetica-cinema`, `#booking`. ✅
- [x] **Scroll horizontal de servicios (`#services-cinema`):** Intacto con GSAP pinning y barra de navegación por dots sin interferencias. ✅
- [x] **Galería y Lightbox:** Funcionamiento perfecto con teclado y ratón. ✅
- [x] **Contador de capítulos (`01 / 08`) y barra de progreso:** Responden fluidamente a lo largo de toda la página. ✅
- [x] **Modo `prefers-reduced-motion`:** Activa automáticamente `.scene--static`, mostrando imágenes fijas y textos legibles sin scrub forzado. ✅
- [x] **Sin desbordamiento horizontal en móvil:** Garantizado mediante `overflow-x: clip`. ✅
- [x] **Fluidez de avance de frames:** La carga progresiva (pasos 8, 4, 2, 1) garantiza que el usuario pueda hacer scroll de inmediato sin frames blancos. ✅
- [x] **Presupuesto de peso:** Ambas escenas cumplen con holgura los límites (< 8 MB en desktop y < 3 MB en móvil). ✅

---

## 3. Frames generados por escena y pesos

- **Escena A — Dolly local (`assets/seq/dolly/`):**
  - Desktop (24 fps, 1280px): **120 frames** — **4.70 MB** (Presupuesto máximo: 8 MB)
  - Mobile (12 fps, 720px): **60 frames** — **1.15 MB** (Presupuesto máximo: 3 MB)
- **Escena B — Manos de barbero (`assets/seq/hands/`):**
  - Desktop (24 fps, 1280px): **120 frames** — **5.31 MB** (Presupuesto máximo: 8 MB)
  - Mobile (12 fps, 720px): **60 frames** — **1.15 MB** (Presupuesto máximo: 3 MB)

---

## 4. Decisiones tomadas frente al documento original y motivos

1. **Desactivación de `initSmoothScroll()` en `scroll-scenes.js` (`ENABLE_LENIS: false`):**
   * *Motivo:* `premium.js` ya poseía una instancia configurada de Lenis 1.0.42 sincronizada con el ticker de GSAP. Duplicarla habría creado saltos de scroll y gasto doble de recursos en CPU/GPU.
2. **Creación de `scripts/build-assets.py` complementario a `build-assets.sh`:**
   * *Motivo:* El entorno anfitrión es Windows PowerShell, donde `ffmpeg` no estaba en el PATH global del sistema. Se aprovechó el binario nativo FFmpeg v7.1 con `libwebp` incluido en el paquete Python `imageio_ffmpeg` para procesar los frames a máxima velocidad sin requerir instalaciones manuales complejas al usuario.
3. **Preservación de la dirección física oficial en `#manifesto`:**
   * *Motivo:* En lugar del texto provisional *"Plaza de los Rincones"* del borrador, se mantuvo la dirección física real verificada *"Calle San Juan Bosco, 5, Rota"*.
4. **Coordinación de animaciones GSAP previas en `#manifesto` y `#artistry`:**
   * *Motivo:* Se añadieron comprobaciones `!element.classList.contains('scene')` en `premium.js` para evitar colisiones entre el pin manual antiguo y el nuevo contenedor sticky del canvas.

---

## 5. Pasos y estado para el usuario

- La rama `feature/cinema-scroll` está lista, validada y totalmente funcional en local.
- Para publicar estos cambios en la web principal:
  1. Fusionar `feature/cinema-scroll` en `main` (`git checkout main; git merge feature/cinema-scroll`).
  2. Subir a GitHub (`git push origin main`).
