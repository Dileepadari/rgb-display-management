#!/usr/bin/env python3
"""Convert an image to the headerless RGB888 .raw format the panel streams.

The `image` scene element is fetched by the ESP32 and read as a flat byte
stream: width * height * 3 bytes, row-major, no header, no palette. That's
deliberate — the firmware can decode it a pixel at a time as it arrives,
without buffering the whole file or linking a PNG/JPEG decoder.

The web app does this in the browser at upload time (see uploadImageAsRaw() in
components/scene-editor-complete.tsx); this script is for preparing a file by
hand or in a batch.

Usage:
    python3 converter.py input.png output.raw [width] [height]

Width and height default to 64x64 (one panel). For a multi-panel wall, pass
the wall's full resolution — e.g. 192 128 for a 3x2 arrangement.
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  pip install pillow")


def convert(src: Path, dest: Path, width: int, height: int) -> None:
    # "RGB" drops any alpha channel; the panel has no notion of transparency,
    # and an RGBA array would make the stream 4 bytes per pixel and desync the
    # firmware's reader.
    image = Image.open(src).convert("RGB")

    # LANCZOS rather than the default: these are heavy downscales (a 4000px
    # photo to 64px), where nearest-neighbour turns fine detail into noise.
    image = image.resize((width, height), Image.LANCZOS)

    dest.write_bytes(image.tobytes())

    expected = width * height * 3
    actual = dest.stat().st_size
    if actual != expected:
        sys.exit(f"Wrote {actual} bytes but expected {expected} — the panel will misread this file.")

    print(f"{src} -> {dest}  ({width}x{height}, {actual} bytes)")


def main() -> None:
    if len(sys.argv) < 3:
        sys.exit(__doc__)

    src = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 64
    height = int(sys.argv[4]) if len(sys.argv) > 4 else 64

    if not src.is_file():
        sys.exit(f"No such file: {src}")
    if width < 1 or height < 1:
        sys.exit("Width and height must be positive.")

    convert(src, dest, width, height)


if __name__ == "__main__":
    main()
