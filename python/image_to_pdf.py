from PIL import Image
import json
import os
import sys
import time

output_dir = sys.argv[1]
files = sys.argv[2:]
os.makedirs(output_dir, exist_ok=True)
output = os.path.join(output_dir, f"images-{int(time.time())}.pdf")

def as_rgb(file_path):
    image = Image.open(file_path)
    if image.mode in ("RGBA", "LA"):
        background = Image.new("RGB", image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[-1])
        return background
    return image.convert("RGB")

images = [as_rgb(file_path) for file_path in files]
images[0].save(output, save_all=True, append_images=images[1:])

print(json.dumps({"outputs": [output]}))
