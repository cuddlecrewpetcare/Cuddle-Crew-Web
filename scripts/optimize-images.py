from pathlib import Path

from PIL import Image, ImageOps


PUBLIC = Path(__file__).resolve().parents[1] / "public"
TARGETS = tuple(PUBLIC.glob("*.jpeg")) + tuple(PUBLIC.glob("*.jpg"))

for path in TARGETS:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        image.save(path, format="JPEG", quality=82, optimize=True, progressive=True)
        print(f"{path.name}: {image.width}x{image.height}")
