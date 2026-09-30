"""
generate_hero_30s.py

Estrategia eficiente con los créditos disponibles:
  - Clip A (5s): primer plano de manos del barbero con clippers
  - Clip B (20s): plano general del local ya existente (reutilizado)
  - Clip C (5s): ángulo bajo silla barbero + neón azul

Concatenados con moviepy → hero.mp4 de 30s
"""
import os, sys, time, urllib.request

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from segmind import SegmindClient

API_KEY      = os.getenv("SEGMIND_API_KEY", "SG_d174d6bcf9ab58cf")
CLIPS_DIR    = "assets/videos/clips"
EXISTING_20S = "assets/videos/hero.mp4"   # ya generado
FINAL_OUT    = "assets/videos/hero.mp4"

NEW_CLIPS = [
    {
        "id": "clip_a_hands",
        "label": "CLIP A — Manos barbero primer plano (5s)",
        "duration": 5,
        "prompt": (
            "Extreme close-up macro shot of a skilled barber wearing black latex gloves "
            "precisely sculpting a skin fade haircut with chrome professional hair clippers. "
            "Shallow depth of field, electric blue and warm gold bokeh background. "
            "Cinematic slow motion, dramatic side lighting, film grain texture. Photorealistic 4K."
        ),
    },
    {
        "id": "clip_c_chair",
        "label": "CLIP C — Silla vintage + neón azul (5s)",
        "duration": 5,
        "prompt": (
            "Low angle dramatic shot looking up at a vintage quilted black leather barber chair "
            "with polished chrome frame, electric blue LED neon strips reflecting on chrome surfaces. "
            "Blurred background shows JS branded reception desk glowing blue. "
            "Slow cinematic pan upward revealing the full chair. Dark luxury barbershop atmosphere. "
            "Cinematic color grade, photorealistic 4K."
        ),
    },
]


def generate_clip(client, clip):
    out_path = os.path.join(CLIPS_DIR, f"{clip['id']}.mp4")
    print(f"\n{'='*60}")
    print(f"  {clip['label']}")
    print(f"{'='*60}")
    print(f"  Duracion: {clip['duration']}s | 720P")
    print(f"  Prompt: {clip['prompt'][:90]}...")

    job = client.submit_async(
        "wan3.0-video",
        prompt=clip["prompt"],
        duration=clip["duration"],
        resolution="720P",
        aspect_ratio="16:9",
        prompt_extend=True,
        watermark=False,
        audio=False,
    )
    print(f"  Job enviado (ID: {job.request_id}). Esperando renderizado...")
    result = job.wait(timeout=900, interval=5.0)
    print(f"  Renderizado completado!")

    video_url = None
    for key in ("output", "video_url", "video"):
        val = result.get(key)
        if isinstance(val, str) and val.startswith("http"):
            video_url = val
            break
    if not video_url:
        for val in result.values():
            if isinstance(val, str) and val.startswith("http") and ".mp4" in val:
                video_url = val
                break

    if not video_url:
        raise RuntimeError(f"No se encontro URL de video. Claves: {list(result.keys())}")

    print(f"  Descargando: {video_url}")
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    urllib.request.urlretrieve(video_url, out_path)
    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"  Guardado: {out_path} ({size_mb:.1f} MB)")
    return out_path


def concatenate(paths, final_output):
    print(f"\n{'='*60}")
    print("  CONCATENANDO CLIPS CON MOVIEPY...")
    print(f"  Orden: {[os.path.basename(p) for p in paths]}")
    print(f"{'='*60}")

    from moviepy import VideoFileClip, concatenate_videoclips

    clips = []
    total = 0
    for p in paths:
        c = VideoFileClip(p)
        print(f"  Cargado {os.path.basename(p)}: {c.duration:.1f}s | {c.size}")
        total += c.duration
        clips.append(c)

    final = concatenate_videoclips(clips, method="compose")
    print(f"  Duracion total: {final.duration:.1f}s")
    print(f"  Exportando a: {final_output}")
    os.makedirs(os.path.dirname(os.path.abspath(final_output)), exist_ok=True)
    final.write_videofile(
        final_output,
        codec="libx264",
        audio=False,
        logger=None,
        temp_audiofile=None,
    )
    for c in clips:
        c.close()
    final.close()
    size_mb = os.path.getsize(final_output) / (1024 * 1024)
    print(f"  Hero final: {final_output} ({size_mb:.1f} MB, {total:.0f}s)")


def main():
    print("\n HERO VIDEO 30s MULTI-ANGULO — Wan 3.0 + moviepy")
    print("   Estructura: [5s primero plano] + [20s interior] + [5s silla]")
    print(f"   Creditos disponibles: checking...\n")

    client = SegmindClient(api_key=API_KEY)
    acc = client.accounts.current()
    print(f"   Cuenta: {acc['username']} | Creditos: {acc['credits']:.4f}\n")

    # Guardar copia del 20s actual con nombre diferente
    backup_20s = os.path.join(CLIPS_DIR, "clip_b_interior_20s.mp4")
    os.makedirs(CLIPS_DIR, exist_ok=True)
    if os.path.exists(EXISTING_20S) and not os.path.exists(backup_20s):
        import shutil
        shutil.copy2(EXISTING_20S, backup_20s)
        print(f"   Clip B (20s existente) copiado a {backup_20s}")

    generated_paths = []

    # Generar clip A
    try:
        path_a = generate_clip(client, NEW_CLIPS[0])
        generated_paths.append(("clip_a", path_a))
    except Exception as e:
        print(f"  ERROR en Clip A: {e}")

    if generated_paths:
        time.sleep(3)

    # Generar clip C
    try:
        path_c = generate_clip(client, NEW_CLIPS[1])
        generated_paths.append(("clip_c", path_c))
    except Exception as e:
        print(f"  ERROR en Clip C: {e}")

    # Armar orden: A + B (20s) + C
    final_clips = []
    # Clip A
    clip_a_path = os.path.join(CLIPS_DIR, "clip_a_hands.mp4")
    if os.path.exists(clip_a_path):
        final_clips.append(clip_a_path)
    # Clip B (20s interior)
    if os.path.exists(backup_20s):
        final_clips.append(backup_20s)
    # Clip C
    clip_c_path = os.path.join(CLIPS_DIR, "clip_c_chair.mp4")
    if os.path.exists(clip_c_path):
        final_clips.append(clip_c_path)

    if len(final_clips) >= 2:
        # Usar un temp para no sobrescribir el B durante lectura
        temp_out = os.path.join(CLIPS_DIR, "hero_final_temp.mp4")
        concatenate(final_clips, temp_out)
        import shutil
        shutil.move(temp_out, FINAL_OUT)
        print(f"\n Hero copiado a {FINAL_OUT}")
    else:
        print("\n Solo se tiene 1 clip, no se puede concatenar. Revisa el saldo.")

    acc2 = client.accounts.current()
    consumed = acc['credits'] - acc2['credits']
    print(f"\n   Creditos consumidos: {consumed:.4f} | Restantes: {acc2['credits']:.4f}")
    print(f"\n Hero video 30s multi-angulo listo!")


if __name__ == "__main__":
    main()
