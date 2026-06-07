import fitz
import json
import os
import sys
import time

output_dir = sys.argv[1]
input_file = sys.argv[2]
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(input_file)
outputs = []
matrix = fitz.Matrix(3, 3)
base = os.path.splitext(os.path.basename(input_file))[0]

for index in range(len(doc)):
    page = doc[index]
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    output = os.path.join(output_dir, f"{base}-page-{index + 1}.jpg")
    pix.save(output)
    outputs.append(output)

print(json.dumps({"outputs": outputs}))
