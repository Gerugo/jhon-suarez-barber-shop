"""
generate_hero_multiangle.py
Genera 3 clips de 10 segundos desde ángulos distintos con Wan 3.0
y los une con moviepy en un único hero.mp4 de 30 segundos.
"""
import os, sys, time, urllib.request

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from segmind import SegmindClient

API_KEY     = os.getenv("SEGMIND_API_KEY", "SG_d174d6bcf9ab58cf")
DURATION    = 10        # segundos por clip
RESOLUTION  = "720P"
OUTPUT_DIR  = "assets/videos/clips"
FINAL_OUT   = "assets/videos/hero.mp4"

CLIPS = [
    {
        "id": "clip1_wide",
        "label": "ÁNGULO 1 — Plano general interior (dolly in)",
        "prompt": (
            "Wide establishing shot of a premium dark barbershop interior. "
            "Hexagonal LED lights glowing bright white on black ceiling, "
            "electric blue LED strips along walls and reception desk, "
            "quilted black leather barber chair center frame, red metallic tool cart on left, "
            "JS branded illuminated reception desk glowing blue. "
            "Slow cinematic dolly push forward. "
            "Dark luxury noir atmosphere. Moody, dramatic. Photorealistic 4K."
        ),
    },
    {
        "id": "clip2_hands",
        "label": "ÁNGULO 2 — Manos del barbero (macro)",
        "prompt": (
            "Extreme close-up macro shot of skilled barber hands wearing black latex gloves "
            "holding professional chrome hair clippers, carefully sculpting a precise fade haircut "
            "on a young man's head. Shallow depth of field, warm gold and blue bokeh background lights. "
            "Cinematic side angle, film grain, slow motion feel. "
            "Dramatic chiaroscuro lighting. Photorealistic 4K."
        ),
    },
    {
        "id": "clip3_chair",
        "label": "ÁNGULO 3 — Silla barbero (ángulo bajo + pan)",
        "prompt": (
            "Low angle shot looking up at a vintage chrome and black quilted leather barber chair, "
            "neon blue LED strips reflecting on the polished chrome armrests and base. "
            "Background shows JS branded reception desk glowing blue and product shelves with pomades. "
            "Slow smooth camera pan from left to right revealing the full barbershop atmosphere. "
            "Dark premium noir ambiance, cinematic color grading. Photorealistic 4K."
        ),
    },
]

def generate_clip(client, clip, out_path):
    print(f"\n{'='*60}")
    print(f"  {clip['label']}")
    print(f"{'='*60}")
    print(f"  Prompt: {clip['prompt'][:100]}...")
    print(f"  Duración: {DURATION}s | Resolución: {RESOLUTION}")

    job = client.submit_async(
        "wan3.0-video",
        prompt=clip["prompt"],
        duration=DURATION,
        resolution=RESOLUTION,
        aspect_ratio="16:9",
        prompt_extend=True,
        watermark=False,
        audio=False,
    )
    print(f"  Trabajo enviado (ID: {job.request_id}). Esperando...")

    result = job.wait(timeout=900, interval=5.0)
    print(f"  Renderizado completado!")

    # Extraer URL de video
    video_url = None
    for key in ("output", "video_url", "video"):
        val = result.get(key)
        if isinstance(val, str) and val.startswith("http"):
            video_url = val
            break

    if not video_url:
        # buscar cualquier URL en los valores
        for val in result.values():
            if isinstance(val, str) and val.startswith("http") and ".mp4" in val:
                video_url = val
                break

    if not video_url:
        print(f"  AVISO: No se encontró URL de video. Claves disponibles: {list(result.keys())}")
        return False

    print(f"  Descargando desde: {video_url}")
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    urllib.request.urlretrieve(video_url, out_path)
    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"  Guardado: {out_path} ({size_mb:.1f} MB)")
    return True


def concatenate_clips(clip_paths, final_output):
    print(f"\n{'='*60}")
    print("  CONCATENANDO CLIPS CON MOVIEPY...")
    print(f"{'='*60}")

    from moviepy import VideoFileClip, concatenate_videoclips

    clips = []
    for p in clip_paths:
        print(f"  Cargando: {p}")
        clips.append(VideoFileClip(p))

    final = concatenate_videoclips(clips, method="compose")
    print(f"  Duración total: {final.duration:.1f}s")
    print(f"  Exportando a: {final_output}")
    os.makedirs(os.path.dirname(os.path.abspath(final_output)), exist_ok=True)
    final.write_videofile(final_output, codec="libx264", audio=False, logger=None)

    for c in clips:
        c.close()
    final.close()
    print(f"  Video final guardado: {final_output}")


def main():
    print("\n🎬 GENERADOR MULTI-ÁNGULO PARA HERO — Wan 3.0 × Segmind")
    print(f"   Clips: {len(CLIPS)} × {DURATION}s = {len(CLIPS)*DURATION}s totales\n")

    client = SegmindClient(api_key=API_KEY)
    acc = client.accounts.current()
    print(f"   Cuenta: {acc['username']} | Créditos: {acc['credits']:.4f}\n")

    clip_paths = []
    for clip in CLIPS:
        out_path = os.path.join(OUTPUT_DIR, f"{clip['id']}.mp4")
        success = generate_clip(client, clip, out_path)
        if success:
            clip_paths.append(out_path)
        else:
            print(f"  ERROR generando {clip['id']} — saltando...")
        # Pausa entre generaciones
        if clip != CLIPS[-1]:
            print("  Pausa de 3s antes del siguiente clip...")
            time.sleep(3)

    if not clip_paths:
        print("\nError: no se generó ningún clip.")
        return

    print(f"\n  {len(clip_paths)}/{len(CLIPS)} clips generados correctamente.")
    concatenate_clips(clip_paths, FINAL_OUT)

    # Créditos finales
    acc2 = client.accounts.current()
    consumed = acc['credits'] - acc2['credits']
    print(f"\n  Créditos consumidos: {consumed:.4f} | Restantes: {acc2['credits']:.4f}")
    print(f"\n✨ ¡Hero video de {len(clip_paths)*DURATION}s listo en {FINAL_OUT}!")


if __name__ == "__main__":
    main()
