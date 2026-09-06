from pathlib import Path

from PIL import Image, ImageOps


PUBLIC = Path(__file__).resolve().parents[1] / "public"
PHOTO_NAMES = (
    "photos/bambi - lauren's cat/lauren-cat-bambi-closeup.jpeg",
    "photos/bambi - lauren's cat/lauren-cat-bambi-portrait.jpeg",
    "blu-walk.jpeg",
    "photos/ponyo and bambi - lauren's cats/lauren-cat-ponyo-and-bambi-window.jpeg",
    "gallery-aussie.jpeg",
    "gallery-black-dog.jpeg",
    "photos/ponyo - lauren's cat/lauren-cat-ponyo-closeup.jpeg",
    "photos/ponyo - lauren's cat/lauren-cat-ponyo-couch.jpeg",
    "gallery-sunny-dog.jpeg",
    "gallery-tan-dog.jpeg",
    "hero-dog.jpeg",
    "lauren-cat-closeup.jpg",
    "photos/ponyo and bambi - lauren's cats/lauren-cat-ponyo-and-bambi-kittens.jpg",
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
