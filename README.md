# ToolsNest

ToolsNest is a Vite, React, and TypeScript toolbox designed for a single Vercel deployment. Most PDF, image, calculator, document, and developer tools run in the browser. PDF compression and AI use narrowly scoped Vercel Functions.

## Architecture

```text
Browser
├── React application and lazy tool routes
├── Local PDF/image/document processors
└── Direct, consented document upload to Gemini
       ↑ short-lived upload URL
Vercel Functions
├── POST /api/ai/upload-session
├── POST /api/ai/generate
└── DELETE /api/ai/file
```

- PDF structure: `pdf-lib`
- PDF rendering and text extraction: PDF.js worker
- Serverless image-aware compression: Sharp with a `pdf-lib` structural fallback
- Downloads: FileSaver.js
- DOCX/PPTX packaging: JSZip and minimal Open XML writers
- Image processing: Canvas and browser image APIs
- AI: Gemini REST API through same-project Vercel Functions
- Storage: none; local results remain in memory and AI files are explicitly deleted

The application has no Express server, Python runtime, LibreOffice installation, database, or separate backend deployment.

## Local development

```bash
npm install
npm run dev
```

The local Vite server does not emulate Vercel Functions. To exercise compression or AI endpoints locally, install the Vercel CLI and run:

```bash
vercel dev
```

Create `.env.local` from `.env.example` and set `GEMINI_API_KEY`. Never create a `VITE_GEMINI_API_KEY`; `VITE_` values are public browser configuration.

## Verification

```bash
npm run lint
npm run test
npm run build
```

Tests cover the tool registry, file validation, merge/rotate/delete/watermark operations, serverless compression, DOCX/PPTX package creation, and AI boundary validation.

## Deployment

1. Import the repository into Vercel as a Vite project.
2. Set `GEMINI_API_KEY`, `GEMINI_MODEL`, and `APP_ORIGIN` in Project Settings → Environment Variables.
3. Configure a Vercel Firewall rate limit for `/api/ai/*` before enabling anonymous public AI access.
4. Deploy. Static routes and same-project functions are handled by `vercel.json`.

## Privacy behavior

- PDF editing/conversion, image processing, calculators, invoice/resume creation, citations, QR codes, and text utilities are local. PDF compression sends the selected PDF to the same Vercel deployment for temporary in-memory processing.
- Text AI inputs are sent to Gemini only after the user invokes an AI action.
- PDF summarizer, Chat with PDF, and Resume Analyzer show an explicit consent control before a file is sent directly to Gemini.
- One-shot AI files are deleted after the response. Chat files remain only for the active session and are deleted when the session ends; provider-side expiry is the final fallback.
