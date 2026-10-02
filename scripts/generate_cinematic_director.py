"""
generate_cinematic_director.py
Genera los clips cinematográficos complementarios con Wan 3.0 usando Segmind API.
"""
import os, sys, time, urllib.request, subprocess

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from segmind import SegmindClient

API_KEY = os.getenv("SEGMIND_API_KEY", "SG_d174d6bcf9ab58cf")
CLIPS_DIR = "assets/videos/clips"
os.makedirs(CLIPS_DIR, exist_ok=True)

NEW_SHOTS = [
    {
        "id": "clip1_entrance",
        "title": "PLANO 1 — Entrada & Luces Hexagonales (Dolly In)",
        "prompt": (
            "Cinematic establishing wide dolly push forward into a luxury dark barbershop interior at night. "
            "Hexagonal white LED honeycomb lighting glowing bright on the black ceiling. "
            "Electric blue LED strip ambient accents reflecting on polished dark concrete floor. "
            "Subtle atmospheric haze in the air. Smooth steadycam camera motion gliding forward. "
            "Dark noir luxury aesthetics, 8k resolution, photorealistic."
        )
    },
    {
        "id": "clip2_tools",
        "title": "PLANO 2 — Herramientas de Autor (Macro Orbit)",
        "prompt": (
            "Cinematic slow motion macro orbit around professional golden barber scissors and an open stainless steel straight razor "
            "resting on a black textured slate countertop next to a steaming hot white towel. "
            "Warm golden rim lighting, deep dark background with soft electric blue neon bokeh. "
            "Water vapor rising, dramatic reflections on polished metal blades. Photorealistic 4k, cinematic film grain."
        )
    },
    {
        "id": "clip4_beard",
        "title": "PLANO 4 — Ritual de Barba Clásica (Slow Motion)",
        "prompt": (
            "Cinematic close-up of a luxury traditional hot towel shave and beard grooming ritual in a barbershop. "
            "A classic straight razor with wooden handle carefully shaping the beard line on a relaxed client. "
            "Steaming hot towel, rich white shaving lather, soft amber and blue cinematic chiaroscuro side lighting. "
            "Slow motion, peaceful luxury spa feel, photorealistic 4k."
        )
    },
    {
        "id": "clip5_studio",
        "title": "PLANO 5 — Alejandra Studio Belleza & Bienestar",
        "prompt": (
            "Cinematic smooth slow camera pan across a luxury aesthetic beauty studio sanctuary, Alejandra Studio. "
            "Pristine white aesthetic treatment bed with neatly rolled plush charcoal towels, warm golden ambient candlelight, "
            "subtle lavender purple ambient backlight, glass serum bottles and aesthetic skincare tools on a dark marble tray. "
            "Calming zen luxury spa atmosphere, photorealistic 4k."
        )
    }
]

def generate_shot(client, shot):
    out_file = os.path.join(CLIPS_DIR, f"{shot['id']}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"⏩ {shot['id']} ya existe ({os.path.getsize(out_file)/1024/1024:.2f} MB). Saltando...")
        return out_file

    print(f"\n{'='*65}")
    print(f"🎬 Generando: {shot['title']}")
    print(f"{'='*65}")
    print(f"📌 Prompt: {shot['prompt'][:100]}...")

    payload = {
        "prompt": shot["prompt"],
        "duration": 5,
        "resolution": "720P",
        "aspect_ratio": "16:9",
        "prompt_extend": True,
        "watermark": False,
        "audio": False
    }

    print("🚀 Enviando a Segmind (wan3.0-video)...")
    job = client.submit_async("wan3.0-video", **payload)
    print(f"⏳ Trabajo enviado (ID: {job.request_id}). Esperando renderizado de Wan 3.0...")
    
    res = job.wait(timeout=900, interval=4.0)
    print("✅ Renderizado completado!")

    video_url = res.get("output") or res.get("video_url") or res.get("video")
    if not video_url:
        for v in res.values():
            if isinstance(v, str) and v.startswith("http") and ".mp4" in v:
                video_url = v
                break

    if not video_url:
        raise RuntimeError(f"No se encontró URL en respuesta: {res}")

    print(f"📥 Descargando clip desde: {video_url}")
    urllib.request.urlretrieve(video_url, out_file)
    size_mb = os.path.getsize(out_file) / (1024 * 1024)
    print(f"🎉 Guardado con éxito: {out_file} ({size_mb:.2f} MB)")
    return out_file

if __name__ == "__main__":
    client = SegmindClient(api_key=API_KEY)
    account = client.accounts.current()
    print(f"💳 Créditos iniciales en cuenta: {account.get('credits')}")

    generated_paths = []
    for shot in NEW_SHOTS:
        try:
            path = generate_shot(client, shot)
            generated_paths.append(path)
            time.sleep(2)
        except Exception as e:
            print(f"❌ Error al generar {shot['id']}: {e}")

    account_after = client.accounts.current()
    print(f"\n💳 Créditos restantes en cuenta: {account_after.get('credits')}")
    print(f"✨ Proceso de generación finalizado: {len(generated_paths)}/{len(NEW_SHOTS)} clips listos.")
