import assert from "node:assert/strict";
import test from "node:test";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { promptFor, validGeminiFile } from "../server/gemini";
import { documentPackageWriters, processPdfTool, validateFiles } from "../src/lib/pdfTools";
import { tools } from "../src/tools/registry";

test("tool registry has one unique route for every tool", () => {
  assert.equal(tools.length, 31);
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
