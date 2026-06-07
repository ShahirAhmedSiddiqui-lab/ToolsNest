from pypdf import PdfReader, PdfWriter
import json
import os
import sys
import time

output_dir = sys.argv[1]
files = sys.argv[2:]
os.makedirs(output_dir, exist_ok=True)
output = os.path.join(output_dir, f"merged-{int(time.time())}.pdf")

writer = PdfWriter()
for file_path in files:
    reader = PdfReader(file_path)
    for page in reader.pages:
        writer.add_page(page)

with open(output, "wb") as handle:
    writer.write(handle)

print(json.dumps({"outputs": [output]}))
