from pypdf import PdfReader, PdfWriter
import json
import os
import sys
import time

output_dir = sys.argv[1]
input_file = sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else "ranges"
ranges = sys.argv[4] if len(sys.argv) > 4 else "1"
os.makedirs(output_dir, exist_ok=True)
base = os.path.splitext(os.path.basename(input_file))[0]

reader = PdfReader(input_file)
page_count = len(reader.pages)
stamp = int(time.time())

def selected_pages(raw):
    pages = set()
    for part in raw.split(","):
        part = part.strip()
        if not part:
            continue
        if mode == "selected" and "-" in part:
            raise ValueError("Selected pages must use single page numbers like 1,3,5.")
        if "-" in part:
            start_raw, end_raw = part.split("-", 1)
            start = int(start_raw)
            end = int(end_raw)
        else:
            start = end = int(part)
        if start < 1 or end < 1:
            raise ValueError("Page numbers must be positive.")
        if start > end:
            raise ValueError("Ranges must go from lower page to higher page, like 2-5.")
        if start > page_count or end > page_count:
            raise ValueError(f"Page numbers cannot exceed total pages ({page_count}).")
        for page in range(start - 1, end):
            pages.add(page)
    return sorted(pages)

outputs = []

if mode == "every":
    for index, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)
        output = os.path.join(output_dir, f"{base}-page-{index + 1}.pdf")
        with open(output, "wb") as handle:
            writer.write(handle)
        outputs.append(output)
elif mode == "fixed":
    size = int(ranges)
    if size < 1:
        raise ValueError("Fixed split size must be at least 1 page.")
    group = 1
    for start in range(0, page_count, size):
        writer = PdfWriter()
        end = min(start + size, page_count)
        for page_index in range(start, end):
            writer.add_page(reader.pages[page_index])
        output = os.path.join(output_dir, f"{base}-split-{group}-pages-{start + 1}-{end}.pdf")
        with open(output, "wb") as handle:
            writer.write(handle)
        outputs.append(output)
        group += 1
else:
    pages = selected_pages(ranges)
    if not pages:
        raise ValueError("Enter page ranges like 1-3,5.")
    writer = PdfWriter()
    for page_index in pages:
        writer.add_page(reader.pages[page_index])
    label = ranges.replace(" ", "").replace(",", "_")
    output = os.path.join(output_dir, f"{base}-pages-{label}.pdf")
    with open(output, "wb") as handle:
        writer.write(handle)
    outputs.append(output)

print(json.dumps({"outputs": outputs}))
