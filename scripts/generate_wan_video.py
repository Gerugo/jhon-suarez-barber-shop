"""
Generador de video cinemático con Wan 3.0 usando Segmind API.
Uso:
    python scripts/generate_wan_video.py [--prompt "tu prompt"] [--output assets/videos/hero.mp4] [--duration 4] [--resolution 720P]
"""
import os
import sys
import argparse
import urllib.request
from segmind import SegmindClient

DEFAULT_API_KEY = os.getenv("SEGMIND_API_KEY", "SG_d174d6bcf9ab58cf")
DEFAULT_PROMPT = (
    "Cinematic barbershop interior, dramatic moody atmosphere, neon blue and warm gold rim lighting, "
    "close up of sharp scissors and vintage clipper, leather barber chair, smooth cinematic slow camera movement, "
    "dark luxury aesthetics, 4k ultra detailed, photorealistic"
)

def generate_video(
    prompt: str = DEFAULT_PROMPT,
    output_path: str = "assets/videos/hero.mp4",
    duration: int = 4,
    resolution: str = "720P",
    aspect_ratio: str = "16:9",
    api_key: str = DEFAULT_API_KEY,
):
    print(f"🎬 Iniciando generación de video con Wan 3.0...")
    print(f"📌 Prompt: {prompt}")
    print(f"⏱ Duración: {duration}s | Resolución: {resolution} | Ratio: {aspect_ratio}")
    print(f"🎯 Destino: {output_path}")

    client = SegmindClient(api_key=api_key)

    payload = {
        "prompt": prompt,
        "duration": duration,
        "resolution": resolution,
        "aspect_ratio": aspect_ratio,
        "prompt_extend": True,
        "watermark": False,
        "audio": False,
    }

    print("🚀 Enviando trabajo asíncrono a Segmind (wan3.0-video)...")
    job = client.submit_async("wan3.0-video", **payload)
    print(f"⏳ Trabajo enviado con éxito (ID: {job.request_id}). Esperando renderizado de Wan 3.0...")

    res = job.wait(timeout=900, interval=4.0)
    print("✅ Renderizado completado!")

    # Check output
    output_data = res.get("output") or res.get("video_url") or res.get("video")
    if isinstance(output_data, str) and (output_data.startswith("http://") or output_data.startswith("https://")):
        print(f"📥 Descargando video desde {output_data}...")
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        urllib.request.urlretrieve(output_data, output_path)
    elif isinstance(output_data, (bytes, bytearray)):
        print(f"💾 Guardando bytes de video...")
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(output_data)
    else:
        # Check all keys in res
        print(f"Respuesta recibida: {list(res.keys())}")
        saved = False
        for k, v in res.items():
            if isinstance(v, str) and (v.endswith(".mp4") or "video" in k):
                print(f"📥 Descargando {v}...")
                os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
                urllib.request.urlretrieve(v, output_path)
                saved = True
                break
        if not saved:
            print("⚠️ Estructura de respuesta no esperada. Datos:", res)
            return False

    print(f"✨ ¡Video generado y guardado exitosamente en {output_path}!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generar videos con Wan 3.0 en Segmind")
    parser.add_argument("--prompt", type=str, default=DEFAULT_PROMPT, help="Prompt descriptivo")
    parser.add_argument("--output", type=str, default="assets/videos/hero.mp4", help="Ruta del archivo de salida")
    parser.add_argument("--duration", type=int, default=4, help="Duración en segundos")
    parser.add_argument("--resolution", type=str, default="720P", choices=["480P", "720P", "1080P"], help="Resolución")
    parser.add_argument("--ratio", type=str, default="16:9", help="Relación de aspecto (16:9, 9:16, 1:1)")
    parser.add_argument("--api-key", type=str, default=DEFAULT_API_KEY, help="Segmind API Key")

    args = parser.parse_args()
    generate_video(
        prompt=args.prompt,
        output_path=args.output,
        duration=args.duration,
        resolution=args.resolution,
        aspect_ratio=args.ratio,
        api_key=args.api_key,
    )
