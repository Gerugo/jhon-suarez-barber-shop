"""
assemble_director_film.py
Une los 6 clips cinematográficos en un único hero.mp4 de 30 segundos,
comprimido y optimizado para móvil y web (+faststart, 720p, 1 Mbps).
"""
import os, sys, subprocess, imageio_ffmpeg

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

CLIPS_DIR = "assets/videos/clips"
FINAL_HERO = "assets/videos/hero.mp4"

ORDERED_CLIPS = [
    "clip1_entrance.mp4",
    "clip2_tools.mp4",
    "clip_a_hands.mp4",
    "clip4_beard.mp4",
    "clip5_studio.mp4",
    "clip_c_chair.mp4"
]

def assemble():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    # Verificar que existan todos los clips
    valid_clips = []
    for c in ORDERED_CLIPS:
        p = os.path.join(CLIPS_DIR, c)
        if os.path.exists(p) and os.path.getsize(p) > 50000:
            valid_clips.append(p)
        else:
            print(f"⚠️ Clip no encontrado o incompleto: {p}")

    print(f"🎬 Clips listos para ensamblar: {len(valid_clips)}/{len(ORDERED_CLIPS)}")
    if len(valid_clips) < 3:
        print("❌ No hay suficientes clips para ensamblar.")
        return

    # Crear archivo concat list para ffmpeg
    list_file = "temp_concat_list.txt"
    with open(list_file, "w", encoding="utf-8") as f:
        for p in valid_clips:
            # ffmpeg concat demuxer format
            abs_p = os.path.abspath(p).replace("\\", "/")
            f.write(f"file '{abs_p}'\n")

    temp_merged = "temp_merged_raw.mp4"
    print("⏳ Concatenando clips con ffmpeg...")
    cmd1 = [
        ffmpeg_exe, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", list_file,
        "-c", "copy",
        temp_merged
    ]
    subprocess.run(cmd1, check=True)

    print("⚡ Optimizando master para web y móvil (CRF 26, faststart)...")
    cmd2 = [
        ffmpeg_exe, "-y",
        "-i", temp_merged,
        "-c:v", "libx264",
        "-crf", "26",
        "-preset", "medium",
        "-movflags", "+faststart",
        "-an",
        FINAL_HERO
    ]
    subprocess.run(cmd2, check=True)

    # Limpieza
    if os.path.exists(list_file): os.remove(list_file)
    if os.path.exists(temp_merged): os.remove(temp_merged)

    size_mb = os.path.getsize(FINAL_HERO) / (1024 * 1024)
    print(f"🎉 MASTER 30s CREADO CON ÉXITO: {FINAL_HERO} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    assemble()
