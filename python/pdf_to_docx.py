from pdf2docx import Converter
import json
import os
import sys
import time

output_dir = sys.argv[1]
input_file = sys.argv[2]
os.makedirs(output_dir, exist_ok=True)
base = os.path.splitext(os.path.basename(input_file))[0]
output = os.path.join(output_dir, f"{base}-{int(time.time())}.docx")

converter = Converter(input_file)
try:
    converter.convert(output, start=0, end=None)
finally:
    converter.close()

print(json.dumps({"outputs": [output]}))
