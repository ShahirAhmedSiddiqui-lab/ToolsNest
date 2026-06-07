# ToolsNest Project Memory

## Project Shape

ToolsNest is a Vite + React + TypeScript app in `D:\ToolsNest`.

Core stack:
- Vite frontend on port `3000`
- React Router routes in `src/App.tsx`
- Tool pages in `src/pages`
- Shared UI in `src/components`
- PDF backend in `backend/server.js`
- Python PDF scripts in `python/`

This is not a Next.js app. Do not add `/pages/api` routes for this repo.

## Main Work Completed

### Initial Cleanup

- Fixed TypeScript lint errors.
- Fixed broken health calculator routes:
  - old bad links: `/calculators/health/...`
  - correct links: `/calculators/bmi`, `/calculators/calories`, `/calculators/tdee`
- Fixed Gemini service function signatures to match page calls.

### PDF Backend Architecture

The uploaded implementation file originally described Next.js API routes, but the error notes correctly said this project is Vite and needs a separate backend.

Implemented:
- `backend/server.js`
- `python/merge.py`
- `python/split.py`
- `python/compress.py`
- `python/pdf_to_image.py`
- `python/image_to_pdf.py`
- `python/pdf_to_docx.py`
- `python/pdf_layout.py`
- `python/requirements.txt`

Frontend PDF upload component still uses the existing `PdfToolUpload` flow, but `src/lib/pdfTools.ts` now sends files to:

```txt
/api/pdf/process
```

Vite dev proxy forwards `/api` to:

```txt
http://localhost:5000
```

Local run:

```bash
npm run server
npm run dev
```

### PDF Tool Improvements

Implemented/fixed:
- PDF to Word
  - tries LibreOffice PDF import to DOCX first
  - falls back to `pdf2docx`
  - avoids plain text paragraph-only conversion
- Word to PDF
  - uses LibreOffice when available for layout preservation
  - falls back to text-only PDF with a clear message
- Merge PDF
  - fixed `PdfMerger` ImportError by switching to `PdfWriter`
- Split PDF
  - supports selected pages
  - supports custom ranges
  - supports fixed N-page chunks
  - supports every page as separate PDF
  - validates invalid text, reversed ranges, positive page numbers, and out-of-range pages
- PDF to JPG
  - returns direct `.jpg` for single-page PDFs
  - returns ZIP for multi-page PDFs
  - uses higher render quality
- PDF to PPT
  - creates editable text boxes where PyMuPDF can extract layout text
  - no longer relies only on page screenshots

### Important Local Dependencies

Python is installed:

```txt
Python 3.14.3
```

Required Python libraries:

```bash
python -m pip install -r python/requirements.txt
```

Current `python/requirements.txt`:

```txt
pymupdf
pypdf
pikepdf
pillow
pdf2docx
```

LibreOffice is installed locally at:

```txt
C:\Program Files\LibreOffice\program\soffice.exe
```

Backend detection order:
- `SOFFICE_BIN`
- `C:\Program Files\LibreOffice\program\soffice.exe`
- `C:\Program Files (x86)\LibreOffice\program\soffice.exe`
- `soffice` / `libreoffice` on PATH

### Verification Already Done

Passed:

```bash
npm run lint
node --check backend/server.js
python -m py_compile python\merge.py python\split.py python\compress.py python\pdf_to_image.py python\image_to_pdf.py python\extract_text.py python\pdf_to_docx.py python\pdf_layout.py
```

Smoke-tested with generated sample PDFs:
- merge
- split
- PDF to JPG
- PDF to DOCX
- PDF layout extraction

Some later checks were rejected by the user, usually port checks or smoke tests.

## Deployment Notes

Vercel can host the Vite frontend.

The current PDF backend should not be hosted as a normal Vercel static deployment because it needs:
- long-running Express server
- Python
- native Python packages
- LibreOffice binary
- temporary file processing

Production-ready approach:
- Host frontend on Vercel.
- Host backend separately on a service that supports Node + Python + LibreOffice, preferably Docker-based.
- Set frontend env var:

```txt
VITE_PDF_API_BASE_URL=https://your-backend-domain.com
```

The backend already supports CORS through:

```txt
CORS_ORIGIN
```

Set it in production to the Vercel domain, for example:

```txt
CORS_ORIGIN=https://your-toolsnest.vercel.app
```

Recommended backend hosts:
- Render Web Service
- Railway
- Fly.io
- VPS with Docker

Avoid deploying the current backend directly as Vercel serverless unless it is redesigned around serverless constraints and a custom runtime/container strategy.

## Useful Commands

Frontend:

```bash
npm run dev
npm run build
npm run lint
```

Backend:

```bash
npm run server
```

Python deps:

```bash
python -m pip install -r python/requirements.txt
```

LibreOffice override if needed:

```bash
set SOFFICE_BIN=C:\Program Files\LibreOffice\program\soffice.exe
```

## Current Production Readiness Gaps

- Backend should be containerized for deployment.
- Add a Dockerfile that installs:
  - Node
  - Python
  - `python/requirements.txt`
  - LibreOffice
- Add backend health route like `/health`.
- Add request cleanup/age-based temp cleanup for `temp/uploads` and `temp/outputs`.
- Add clearer production env docs.
- Consider increasing upload limits only after checking host memory/time limits.
