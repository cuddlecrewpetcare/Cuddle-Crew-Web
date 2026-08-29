from pathlib import Path

from PIL import Image, ImageOps


PUBLIC = Path(__file__).resolve().parents[1] / "public"
PHOTO_NAMES = (
    "bambi-closeup.jpeg",
    "bambi-portrait.jpeg",
    "blu-walk.jpeg",
    "cats-window.jpeg",
    "gallery-aussie.jpeg",
    "gallery-black-dog.jpeg",
    "gallery-cat-closeup.jpeg",
    "gallery-gray-cat.jpeg",
    "gallery-sunny-dog.jpeg",
    "gallery-tan-dog.jpeg",
    "hero-dog.jpeg",
    "lauren-cat-closeup.jpg",
    "lauren-kittens.jpg",
    "lauren-portrait.jpeg",
    "loki-portrait.jpeg",
    "skylar-profile.jpeg",
    "skylar-smile.jpeg",
)
TARGETS = tuple(PUBLIC / name for name in PHOTO_NAMES)

for path in TARGETS:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        image.save(path, format="JPEG", quality=82, optimize=True, progressive=True)
        print(f"{path.name}: {image.width}x{image.height}")
