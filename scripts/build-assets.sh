#!/usr/bin/env bash
# Uso: bash scripts/build-assets.sh
# Entradas esperadas en source-video/: hero_master.mp4, dolly.mp4, hands.mp4
cd "$(dirname "$0")/.." || exit 1
SRC="source-video"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "[ERROR] ffmpeg no está instalado en PATH global."
  echo "  En Windows también puedes ejecutar: python scripts/build-assets.py"
  exit 1
fi
if ! ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libwebp; then
  echo "[ERROR] Este ffmpeg no incluye libwebp. Instala una build completa."
  exit 1
fi

make_seq () {  # $1 = nombre de escena, $2 = fichero origen dentro de source-video/
  local name="$1" file="$SRC/$2"
  if [ ! -f "$file" ]; then echo "[SKIP] $file no existe"; return; fi
  for variant in desktop mobile; do
    local out vf q
    if [ "$variant" = desktop ]; then
      out="assets/seq/$name";   vf="fps=24,scale=1280:-2"; q=70
    else
      out="assets/seq/$name-m"; vf="fps=12,scale=720:-2";  q=65
    fi
    rm -rf "$out"; mkdir -p "$out"
    ffmpeg -loglevel error -y -i "$file" -vf "$vf" -c:v libwebp -quality "$q" "$out/f_%03d.webp"
    echo "[OK] $out -> $(ls "$out" | wc -l | tr -d ' ') frames, $(du -sh "$out" | cut -f1)"
  done
}

make_seq dolly  dolly.mp4
make_seq hands  hands.mp4

# Hero: solo se recodifica si hay master; el original se conserva
if [ -f "$SRC/hero_master.mp4" ]; then
  [ -f assets/videos/hero.original.mp4 ] || cp assets/videos/hero.mp4 assets/videos/hero.original.mp4 2>/dev/null
  ffmpeg -loglevel error -y -i "$SRC/hero_master.mp4" -an -vf "scale=1280:-2,fps=24" \
    -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart assets/videos/hero.mp4
  ffmpeg -loglevel error -y -i "$SRC/hero_master.mp4" -an -vf "scale=1280:-2,fps=24" \
    -c:v libvpx-vp9 -crf 34 -b:v 0 assets/videos/hero.webm
  echo "[OK] hero.mp4 / hero.webm regenerados"
else
  echo "[SKIP] source-video/hero_master.mp4 no existe; se mantiene hero.mp4 actual"
fi

# Pósters (JPG) a partir de los vídeos actuales, si faltan
[ -f assets/images/hero-poster.jpg ] || ffmpeg -loglevel error -y -ss 0 -i assets/videos/hero.mp4 -frames:v 1 -q:v 3 assets/images/hero-poster.jpg 2>/dev/null
[ -f assets/images/clip-hands-poster.jpg ] || ffmpeg -loglevel error -y -ss 0 -i assets/videos/clips/clip_a_hands.mp4 -frames:v 1 -q:v 3 assets/images/clip-hands-poster.jpg 2>/dev/null
echo "Hecho. Copia los recuentos de frames a los data-seq-count de premium.html."
