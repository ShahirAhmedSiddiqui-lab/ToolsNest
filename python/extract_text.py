import fitz
import json
import os
import sys
import time

output_dir = sys.argv[1]
input_file = sys.argv[2]
os.makedirs(output_dir, exist_ok=True)
output = os.path.join(output_dir, f"extracted-{int(time.time())}.txt")

doc = fitz.open(input_file)
text = ""
for page in doc:
    text += page.get_text()
    text += "\n\n"

with open(output, "w", encoding="utf-8") as handle:
    handle.write(text)

print(json.dumps({"outputs": [output]}))
