import type { ApiRequest, ApiResponse } from "../server/http";
import { json, secureRequest } from "../server/http";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const MAX_BYTES = 4 * 1024 * 1024;
const MAX_PAGES = 50;

const readPdf = async (request: ApiRequest) => {
  if (Buffer.isBuffer(request.body)) return request.body;
  if (request.body instanceof Uint8Array) return Buffer.from(request.body);
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BYTES) throw new Error("TOO_LARGE");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
};

const safeName = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value ?? "document.pdf";
  try { return decodeURIComponent(raw).replace(/[^a-z0-9 _.-]/gi, "").slice(0, 100) || "document.pdf"; }
  catch { return "document.pdf"; }
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!secureRequest(request, response, ["POST"])) return;
  try {
    if (!String(request.headers["content-type"] ?? "").toLowerCase().startsWith("application/pdf")) {
      json(response, 415, { error: { code: "INVALID_TYPE", message: "Upload a PDF document." } });
      return;
    }
    const input = await readPdf(request);
    if (!input.length || input.length > MAX_BYTES || !input.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
      json(response, input.length > MAX_BYTES ? 413 : 400, { error: { code: "INVALID_PDF", message: input.length > MAX_BYTES ? "PDFs must be 4 MB or smaller for serverless compression." : "The uploaded file is not a valid PDF." } });
      return;
    }

    const source = await PDFDocument.load(input, { updateMetadata: false });
    if (source.getPageCount() > MAX_PAGES) {
      json(response, 400, { error: { code: "PAGE_LIMIT", message: `Compression supports up to ${MAX_PAGES} pages.` } });
      return;
    }
    const url = new URL(request.url ?? "/api/compress-pdf", "https://toolsnest.local");
    const level = url.searchParams.get("level") ?? "medium";
    const settings = level === "high" ? { density: 90, quality: 48 } : level === "low" ? { density: 150, quality: 80 } : { density: 120, quality: 64 };
    let outputBytes: Uint8Array;
    let mode = "structural";

    try {
      const output = await PDFDocument.create();
      for (let pageIndex = 0; pageIndex < source.getPageCount(); pageIndex += 1) {
        const rendered = await sharp(input, { page: pageIndex, density: settings.density, limitInputPixels: 80_000_000 })
          .flatten({ background: "#ffffff" })
          .jpeg({ quality: settings.quality, mozjpeg: true })
          .toBuffer();
        const image = await output.embedJpg(rendered);
        const original = source.getPage(pageIndex);
        const page = output.addPage([original.getWidth(), original.getHeight()]);
        page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
      }
      outputBytes = await output.save({ useObjectStreams: true });
      mode = "image-raster";
    } catch {
      outputBytes = await source.save({ useObjectStreams: true, addDefaultPage: false });
    }

    if (outputBytes.length >= input.length) outputBytes = await source.save({ useObjectStreams: true, addDefaultPage: false });
    const originalName = safeName(request.headers["x-file-name"]);
    const fileName = `${originalName.replace(/\.pdf$/i, "")}-compressed.pdf`;
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    response.setHeader("X-Compression-Mode", mode);
    response.end(Buffer.from(outputBytes));
  } catch (error) {
    const tooLarge = error instanceof Error && error.message === "TOO_LARGE";
    json(response, tooLarge ? 413 : 400, { error: { code: tooLarge ? "FILE_TOO_LARGE" : "COMPRESSION_FAILED", message: tooLarge ? "PDFs must be 4 MB or smaller for serverless compression." : "This PDF could not be compressed." } });
  }
}
