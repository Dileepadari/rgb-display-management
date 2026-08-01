# extra_code

Things that live alongside the firmware but are **not** part of the build.

PlatformIO compiles everything under `src/`, so non-C++ files kept there were
getting scanned on every build, and an old `main_backup.cpp` sitting next to a
live `main.cpp` is an easy thing to edit by mistake. Both now live here.

| File | What it is |
| --- | --- |
| `main_backup.cpp` | The pre-rewrite firmware, from before the scene/playlist/mood architecture. Kept only as a reference for the original NTP clock and ThingSpeak polling code. **Not compiled, not maintained** — it will not build against the current headers. |
| `converter.py` | Turns an image into the headerless RGB888 `.raw` format the `image` element streams. The web app now does this in the browser at upload time (`uploadImageAsRaw()` in `components/scene-editor-complete.tsx`), so this is only useful for preparing a file by hand. |
| `profile.raw` | A sample 64×64 raw image, produced by `converter.py`. Test fixture. |
| `GPxMatrix.code-workspace` | VS Code workspace from the original `GPxMatrix` driver, which was replaced by `ESP32-HUB75-MatrixPanel-I2S-DMA`. Stale. |

## Using converter.py

```bash
python3 extra_code/converter.py input.png output.raw 64 64
```

The output is width × height × 3 bytes, row-major, no header — exactly what
`loadSceneAssets()` in `src/elements.cpp` expects to stream.
