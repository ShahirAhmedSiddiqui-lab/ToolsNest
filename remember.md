# ToolsNest Project Memory

## Current Architecture

ToolsNest is a Vite + React + TypeScript application deployed as one Vercel project.

- PDF editing/conversion, image, document, calculator, citation, QR, and developer tools run in the browser.
- PDF compression alone uses `/api/compress-pdf` with Sharp and a structural `pdf-lib` fallback.
- CPU-heavy libraries are dynamically imported only by the routes that use them.
- Fidelity-sensitive conversion tools now support two modes:
  - `Visual Match`: preserve appearance as closely as possible
  - `Editable`: preserve editability with some layout drift
- AI uses same-project Vercel Functions under `api/ai/`.
- The Gemini key is server-only in `GEMINI_API_KEY`.
- AI document tools extract text locally in the browser first and send only bounded text or snippets to Gemini.
- AI pages use `/api/ai/health` before submit so setup/config problems are surfaced deterministically.
- There is no Express server, Python runtime, LibreOffice dependency, Docker image, Render service, database, or persistent file store.

## Main Boundaries

- `src/tools/registry.ts`: canonical registry for all 34 tool routes, search metadata, execution mode, and lazy page loading.
- `src/lib/pdfTools.ts`: browser-local PDF, DOCX, and PPTX processors, including `Visual Match` and `Editable` conversion paths.
- `src/components/ImageTool.tsx`: browser-local image compression and conversion.
- `src/components/PdfToolUpload.tsx`: shared PDF upload UI and conversion mode selector.
- `src/services/gemini.ts`: typed browser client for same-origin AI functions, local PDF text extraction, snippet ranking, and AI health checks.
- `src/hooks/useAIHealth.ts`: shared client-side AI readiness hook for AI pages.
- `api/ai/health.ts`: reports whether the server-side Gemini configuration is available.
- `api/ai/generate.ts`: validates allow-listed AI actions and streams Gemini responses from text-only inputs.
- `api/compress-pdf.ts`: performs temporary in-memory serverless compression without storing uploads.
- `server/`: shared serverless-only validation and Gemini helpers; it is not a standalone backend.

## File and Privacy Limits

- Local file size: 20 MB each, 40 MB combined.
- Serverless PDF compression size: 4 MB.
- Raster PDF operations: 50 pages.
- AI document size: 10 MB.
- AI document types: PDF and plain text.
- Text AI input: 25,000 characters.
- Local results remain in memory only.
- No PDF files are uploaded to Gemini; only extracted text is sent for document AI tools.

## Current Tool Behavior Notes

- `pdf-to-word`, `pdf-to-ppt`, and `word-to-pdf` default to `Visual Match`.
- `Visual Match` uses image-based or rendered-page output to keep layout close to the source.
- `Editable` uses extracted text / lightweight document reconstruction and may change layout.
- Scanned or image-only PDFs work better in `Visual Match`; editable extraction may return limited text.
- AI document tools fail honestly when no readable text can be extracted locally.
- AI registry entries for document workflows use extracted-text execution, not file-upload execution.

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
```

Use `vercel dev` when testing the Vercel Functions locally.

## Required Vercel Environment

```txt
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
APP_ORIGIN=https://your-toolsnest.vercel.app
```

Configure Vercel Firewall rate limiting for `/api/ai/*` before enabling anonymous public AI access.
