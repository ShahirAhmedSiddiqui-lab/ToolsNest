import json
import os
import sys
import time
import pikepdf

output_dir = sys.argv[1]
input_file = sys.argv[2]
os.makedirs(output_dir, exist_ok=True)
output = os.path.join(output_dir, f"compressed-{int(time.time())}.pdf")

with pikepdf.open(input_file) as pdf:
    pdf.save(output, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)

print(json.dumps({"outputs": [output]}))
