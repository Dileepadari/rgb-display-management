from PIL import Image
import numpy as np

im = Image.open("./test.jpg").convert("RGB")
im = im.resize((64, 64))        # match panel exactly
pixels = np.array(im, dtype=np.uint8)
pixels.tofile("./profile.raw")
