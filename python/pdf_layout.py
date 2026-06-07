import fitz
import json
import os
import sys
import time

output_dir = sys.argv[1]
input_file = sys.argv[2]
os.makedirs(output_dir, exist_ok=True)
base = os.path.splitext(os.path.basename(input_file))[0]
output = os.path.join(output_dir, f"{base}-layout-{int(time.time())}.json")

doc = fitz.open(input_file)
pages = []

for page in doc:
    page_data = page.get_text("dict")
    text_items = []
    for block in page_data.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                text = span.get("text", "").strip()
                if not text:
                    continue
                x0, y0, x1, y1 = span["bbox"]
                flags = span.get("flags", 0)
                color = f"{span.get('color', 0):06x}"
                text_items.append({
                    "text": text,
                    "x": x0,
                    "y": y0,
                    "w": max(1, x1 - x0),
                    "h": max(1, y1 - y0),
                    "font": span.get("font", "Arial"),
                    "size": span.get("size", 10),
                    "bold": "bold" in span.get("font", "").lower(),
                    "italic": bool(flags & 2),
                    "color": color,
                })
    rect = page.rect
    pages.append({"width": rect.width, "height": rect.height, "text": text_items})

with open(output, "w", encoding="utf-8") as handle:
    json.dump({"pages": pages}, handle)

print(json.dumps({"outputs": [output]}))
