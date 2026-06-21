# ToolsNest Project Memory

## Current Architecture

ToolsNest is a Vite + React + TypeScript application deployed as one Vercel project.

- PDF editing/conversion, image, document, calculator, citation, QR, and developer tools run in the browser.
- PDF compression alone uses `/api/compress-pdf` with Sharp and a structural `pdf-lib` fallback.
- CPU-heavy libraries are dynamically imported only by the routes that use them.
- AI uses same-project Vercel Functions under `api/ai/`.
- The Gemini key is server-only in `GEMINI_API_KEY`.
- AI document files upload directly from the browser to Gemini after explicit consent.
- There is no Express server, Python runtime, LibreOffice dependency, Docker image, Render service, database, or persistent file store.

## Main Boundaries

- `src/tools/registry.ts`: canonical registry for all 34 tool routes, search metadata, execution mode, and lazy page loading.
- `src/lib/pdfTools.ts`: browser-local PDF, DOCX, and PPTX processors.
- `src/components/ImageTool.tsx`: browser-local image compression and conversion.
- `src/services/gemini.ts`: typed browser client for same-origin AI functions and direct Gemini uploads.
- `api/ai/upload-session.ts`: creates resumable Gemini upload sessions without exposing the API key.
- `api/ai/generate.ts`: validates allow-listed AI actions and streams Gemini responses.
- `api/ai/file.ts`: deletes Gemini files.
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
- One-shot Gemini files are deleted after processing; chat files are deleted when the session ends.

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
