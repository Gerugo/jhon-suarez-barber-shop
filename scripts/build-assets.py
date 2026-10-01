#!/usr/bin/env python3
"""
Pipeline de extracción de secuencias WebP y optimización de vídeos.
Compatible con Windows, macOS y Linux.
Usa imageio_ffmpeg con libwebp nativo o ffmpeg del sistema.
"""
import os
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-video"

def get_ffmpeg():
    # 1. Intentar ffmpeg del sistema
    try:
        res = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        if res.returncode == 0:
            return "ffmpeg"
    except Exception:
        pass
    # 2. Intentar imageio_ffmpeg
    try:
        import imageio_ffmpeg
        exe = imageio_ffmpeg.get_ffmpeg_exe()
        if os.path.exists(exe):
            return exe
    except Exception:
        pass
    return None

def check_libwebp(ffmpeg_exe):
    try:
        res = subprocess.run([ffmpeg_exe, "-encoders"], capture_output=True, text=True)
        return "libwebp" in res.stdout
    except Exception:
        return False

def make_seq(ffmpeg_exe, name, src_file):
    filepath = SRC / src_file
    if not filepath.exists():
        print(f"[SKIP] {filepath} no existe")
        return 0, 0
    
    desktop_out = ROOT / "assets" / "seq" / name
    mobile_out = ROOT / "assets" / "seq" / f"{name}-m"
    desktop_out.mkdir(parents=True, exist_ok=True)
    mobile_out.mkdir(parents=True, exist_ok=True)

    # Limpiar frames previos
    for f in desktop_out.glob("*.webp"):
        f.unlink()
    for f in mobile_out.glob("*.webp"):
        f.unlink()

    # Desktop: 24 fps, 1280w, q=70
    cmd_d = [
        ffmpeg_exe, "-loglevel", "error", "-y", "-i", str(filepath),
        "-vf", "fps=24,scale=1280:-2", "-c:v", "libwebp", "-quality", "70",
        str(desktop_out / "f_%03d.webp")
    ]
    subprocess.run(cmd_d, check=True)
    d_count = len(list(desktop_out.glob("*.webp")))
    d_size_mb = sum(f.stat().st_size for f in desktop_out.glob("*.webp")) / (1024 * 1024)
    print(f"[OK] {desktop_out} -> {d_count} frames ({d_size_mb:.2f} MB)")

    # Mobile: 12 fps, 720w, q=65
    cmd_m = [
        ffmpeg_exe, "-loglevel", "error", "-y", "-i", str(filepath),
        "-vf", "fps=12,scale=720:-2", "-c:v", "libwebp", "-quality", "65",
        str(mobile_out / "f_%03d.webp")
    ]
    subprocess.run(cmd_m, check=True)
    m_count = len(list(mobile_out.glob("*.webp")))
    m_size_mb = sum(f.stat().st_size for f in mobile_out.glob("*.webp")) / (1024 * 1024)
    print(f"[OK] {mobile_out} -> {m_count} frames ({m_size_mb:.2f} MB)")

    return d_count, m_count

def generate_posters(ffmpeg_exe):
    hero_vid = ROOT / "assets" / "videos" / "hero.mp4"
    hands_vid = ROOT / "assets" / "videos" / "clips" / "clip_a_hands.mp4"
    hero_poster = ROOT / "assets" / "images" / "hero-poster.jpg"
    hands_poster = ROOT / "assets" / "images" / "clip-hands-poster.jpg"

    if hero_vid.exists() and not hero_poster.exists():
        subprocess.run([
            ffmpeg_exe, "-loglevel", "error", "-y", "-ss", "0", "-i", str(hero_vid),
            "-frames:v", "1", "-q:v", "3", str(hero_poster)
        ])
        print(f"[OK] Generado {hero_poster}")

    if hands_vid.exists() and not hands_poster.exists():
        subprocess.run([
            ffmpeg_exe, "-loglevel", "error", "-y", "-ss", "0", "-i", str(hands_vid),
            "-frames:v", "1", "-q:v", "3", str(hands_poster)
        ])
        print(f"[OK] Generado {hands_poster}")

def main():
    ffmpeg = get_ffmpeg()
    if not ffmpeg:
        print("[ERROR] No se encontró ffmpeg en el sistema ni en Python.")
        sys.exit(1)
    if not check_libwebp(ffmpeg):
        print("[ERROR] FFmpeg no tiene soporte para libwebp.")
        sys.exit(1)

    print(f"[INFO] Usando FFmpeg: {ffmpeg}")
    d_dolly, m_dolly = make_seq(ffmpeg, "dolly", "dolly.mp4")
    d_hands, m_hands = make_seq(ffmpeg, "hands", "hands.mp4")
    generate_posters(ffmpeg)

    print("\n[RESUMEN] Recuentos de frames:")
    print(f"  dolly:   desktop={d_dolly}, mobile={m_dolly}")
    print(f"  hands:   desktop={d_hands}, mobile={m_hands}")
    print("Listo.")

if __name__ == "__main__":
    main()
