import assert from "node:assert/strict";
import test from "node:test";
import { Readable } from "node:stream";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import compressHandler from "../api/compress-pdf";
import type { ApiRequest, ApiResponse } from "../server/http";
import { promptFor, validGeminiFile } from "../server/gemini";
import { documentPackageWriters, processPdfTool, validateFiles } from "../src/lib/pdfTools";
import { tools } from "../src/tools/registry";

test("tool registry has one unique route for every tool", () => {
  assert.equal(tools.length, 34);
  assert.equal(new Set(tools.map((tool) => tool.id)).size, tools.length);
  assert.equal(new Set(tools.map((tool) => tool.path)).size, tools.length);
  assert.ok(tools.some((tool) => tool.id === "citation-generator"));
  assert.ok(tools.every((tool) => tool.path.startsWith("/")));
});

test("file validation enforces DOCX and combined size boundaries", () => {
  const legacy = new File([new Uint8Array(10)], "resume.doc", { type: "application/msword" });
  assert.match(validateFiles("word-to-pdf", [legacy]), /DOCX/);
  const pdf = new File([new Uint8Array(10)], "sample.pdf", { type: "application/pdf" });
  assert.equal(validateFiles("split-pdf", [pdf]), "");
});

test("browser PDF merge produces a readable two-page PDF", async () => {
  const first = await PDFDocument.create(); first.addPage();
  const second = await PDFDocument.create(); second.addPage();
  const files = [
    new File([await first.save()], "one.pdf", { type: "application/pdf" }),
    new File([await second.save()], "two.pdf", { type: "application/pdf" }),
  ];
  const result = await processPdfTool("merge-pdf", files, {});
  const merged = await PDFDocument.load(await result.blob.arrayBuffer());
  assert.equal(merged.getPageCount(), 2);
});

test("rotate and delete-page tools preserve valid page structure", async () => {
  const source = await PDFDocument.create();
  source.addPage(); source.addPage(); source.addPage();
  const file = new File([await source.save()], "three-pages.pdf", { type: "application/pdf" });
  const rotatedResult = await processPdfTool("rotate-pdf", [file], { pageSelection: "selected", selectedPages: "2", rotation: 90 });
  const rotated = await PDFDocument.load(await rotatedResult.blob.arrayBuffer());
  assert.deepEqual(rotated.getPages().map((page) => page.getRotation().angle), [0, 90, 0]);
  const deletedResult = await processPdfTool("delete-pdf-pages", [file], { removePages: "2" });
  const deleted = await PDFDocument.load(await deletedResult.blob.arrayBuffer());
  assert.equal(deleted.getPageCount(), 2);
});

test("watermark tool creates a valid PDF without changing page count", async () => {
  const source = await PDFDocument.create(); source.addPage(); source.addPage();
  const file = new File([await source.save()], "watermark.pdf", { type: "application/pdf" });
  const result = await processPdfTool("watermark-pdf", [file], { watermarkText: "DRAFT" });
  const watermarked = await PDFDocument.load(await result.blob.arrayBuffer());
  assert.equal(watermarked.getPageCount(), 2);
  assert.ok(result.blob.size > file.size);
});

test("serverless compression returns a valid PDF without external binaries", async () => {
  const source = await PDFDocument.create(); source.addPage();
  const bytes = await source.save();
  const request = Object.assign(Readable.from([Buffer.from(bytes)]), {
    method: "POST",
    headers: { "content-type": "application/pdf", "x-file-name": "sample.pdf", origin: "http://localhost:3000" },
    url: "/api/compress-pdf?level=medium",
  }) as unknown as ApiRequest;
  const chunks: Buffer[] = [];
  const headers = new Map<string, string>();
  const response = {
    statusCode: 0,
    setHeader: (name: string, value: string | number | readonly string[]) => { headers.set(name.toLowerCase(), String(value)); },
    end: (chunk?: Uint8Array) => { if (chunk) chunks.push(Buffer.from(chunk)); },
  } as unknown as ApiResponse;
  await compressHandler(request, response);
  assert.equal(response.statusCode, 200);
  assert.equal(headers.get("content-type"), "application/pdf");
  const compressed = await PDFDocument.load(Buffer.concat(chunks));
  assert.equal(compressed.getPageCount(), 1);
});

test("compression client falls back to browser compression when the API is unavailable", async () => {
  const source = await PDFDocument.create();
  source.addPage();
  const file = new File([await source.save()], "broken.pdf", { type: "application/pdf" });
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = (async () => new Response("<html>missing route</html>", { status: 404, headers: { "Content-Type": "text/html" } })) as typeof fetch;
    const result = await processPdfTool("compress-pdf", [file], { compression: "medium" });
    const compressed = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(compressed.getPageCount(), 1);
    assert.match(result.details.join(" "), /Medium compression|Size stayed at|Reduced from/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("compression never returns a larger file than the original", async () => {
  const source = await PDFDocument.create();
  source.addPage();
  const file = new File([await source.save()], "already-optimized.pdf", { type: "application/pdf" });
  const originalFetch = globalThis.fetch;

  try {
    const bigger = new Uint8Array(file.size + 256);
    globalThis.fetch = (async () => new Response(bigger, { status: 200, headers: { "Content-Type": "application/pdf", "X-Compression-Mode": "image-raster" } })) as typeof fetch;
    const result = await processPdfTool("compress-pdf", [file], { compression: "high" });
    assert.ok(result.blob.size <= file.size);
    assert.match(result.details.join(" "), /already near its smallest size|Reduced from|Size stayed at/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("compression levels are wired through to the API and fallback messaging", async () => {
  const source = await PDFDocument.create();
  source.addPage();
  const file = new File([await source.save()], "levels.pdf", { type: "application/pdf" });
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];

  try {
    globalThis.fetch = (async (input: URL | RequestInfo) => {
      requests.push(String(input));
      return new Response("<html>fail</html>", { status: 500, headers: { "Content-Type": "text/html" } });
    }) as typeof fetch;

    const low = await processPdfTool("compress-pdf", [file], { compression: "low" });
    const high = await processPdfTool("compress-pdf", [file], { compression: "high" });

    assert.ok(requests.some((url) => url.includes("level=low")));
    assert.ok(requests.some((url) => url.includes("level=high")));
    assert.match(low.details[0], /Low compression/);
    assert.match(high.details[0], /High compression/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("lightweight DOCX and PPTX writers create real Open XML packages", async () => {
  const docx = await JSZip.loadAsync(await (await documentPackageWriters.createDocx(["Hello world"])).arrayBuffer());
  assert.ok(docx.file("word/document.xml"));
  const pptx = await JSZip.loadAsync(await (await documentPackageWriters.createPptx(["Slide content"])).arrayBuffer());
  assert.ok(pptx.file("ppt/presentation.xml"));
  assert.ok(pptx.file("ppt/slides/slide1.xml"));
});

test("AI actions are allow-listed and file references are constrained", () => {
  assert.match(promptFor("grammar", { text: "hello" }), /Correct grammar/);
  assert.throws(() => promptFor("arbitrary", {}), /INVALID_ACTION/);
  assert.equal(validGeminiFile({ name: "files/abc_123", uri: "https://generativelanguage.googleapis.com/v1beta/files/abc_123", mimeType: "application/pdf" }), true);
  assert.equal(validGeminiFile({ name: "files/abc", uri: "https://attacker.example/file", mimeType: "application/pdf" }), false);
});
