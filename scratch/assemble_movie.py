import os
import subprocess

ffmpeg = r"C:\Users\Gerugo\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"

# 1. Prepare normalized clips (all 1280x720, 24fps, duration ~3.2s)
clips_spec = [
    # (input_path, start_time, duration, filter_extra)
    ("assets/videos/estetica/toma1_camilla_spa.mp4", 0.5, 3.2, "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2"),
    ("assets/videos/estetica/toma3_lampara_crescent.mp4", 0.5, 3.2, "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2"),
    ("assets/videos/estetica/toma2_productos_serum.mp4", 0.5, 3.2, "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2"),
    ("assets/videos/clips/clip5_studio.mp4", 0.5, 3.0, "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2"),
    ("assets/videos/estetica/toma4_pestanas_mirada.mp4", 1.0, 3.2, "crop=720:405:0:300,scale=1280:720")
]

trimmed_files = []
for i, (fpath, start, dur, flt) in enumerate(clips_spec):
    out_clip = f"assets/videos/estetica/part_{i+1}.mp4"
    cmd = [
        ffmpeg, "-y",
        "-ss", str(start),
        "-t", str(dur),
        "-i", fpath,
        "-vf", f"{flt},fps=24,format=yuv420p",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-an",
        out_clip
    ]
    print(f"Trimming part {i+1}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error on part {i+1}: {res.stderr}")
    trimmed_files.append(out_clip)

# 2. Concat with xfade crossfades (0.4s fade)
# Durations: 3.2, 3.2, 3.2, 3.0, 3.2
# Offsets:
# offset 1 = 3.2 - 0.4 = 2.8
# offset 2 = 2.8 + (3.2 - 0.4) = 5.6
# offset 3 = 5.6 + (3.2 - 0.4) = 8.4
# offset 4 = 8.4 + (3.0 - 0.4) = 11.0
filter_complex = (
    "[0:v][1:v]xfade=transition=fade:duration=0.4:offset=2.8[v01];"
    "[v01][2:v]xfade=transition=fade:duration=0.4:offset=5.6[v02];"
    "[v02][3:v]xfade=transition=fade:duration=0.4:offset=8.4[v03];"
    "[v03][4:v]xfade=transition=fade:duration=0.4:offset=11.0[vfinal]"
)

out_movie = "assets/videos/estetica-studio.mp4"
final_cmd = [
    ffmpeg, "-y",
    "-i", trimmed_files[0],
    "-i", trimmed_files[1],
    "-i", trimmed_files[2],
    "-i", trimmed_files[3],
    "-i", trimmed_files[4],
    "-filter_complex", filter_complex,
    "-map", "[vfinal]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "22",
    "-movflags", "+faststart",
    out_movie
]

print("Assembling final movie trailer...")
final_res = subprocess.run(final_cmd, capture_output=True, text=True)
if final_res.returncode == 0:
    print(f"SUCCESS! Created {out_movie} (size: {os.path.getsize(out_movie)} bytes)")
else:
    print(f"Error in assembly: {final_res.stderr}")
