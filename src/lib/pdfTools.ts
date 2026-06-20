export type PdfToolId =
  | "pdf-to-word"
  | "word-to-pdf"
  | "compress-pdf"
  | "merge-pdf"
  | "jpg-to-pdf"
  | "split-pdf"
  | "pdf-to-jpg"
  | "pdf-to-ppt";

export type PdfToolOptions = {
  compression?: "low" | "medium" | "high";
  pageSize?: "A4" | "Letter";
  orientation?: "portrait" | "landscape";
  splitMode?: "selected" | "ranges" | "fixed" | "every";
  ranges?: string;
  fixedRange?: number;
  jpgQuality?: number;
};

export type ToolResult = { fileName: string; blob: Blob; details: string[] };

const MB = 1024 * 1024;
const FILE_LIMIT = 20 * MB;
const TOTAL_LIMIT = 40 * MB;
const RASTER_PAGE_LIMIT = 50;

const isPdf = (file: File) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
const ext = (file: File) => file.name.split(".").pop()?.toLowerCase() ?? "";
const stem = (name: string) => name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9 _.-]/gi, "").trim() || "document";

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / MB).toFixed(2)} MB`;
};

export const validateFiles = (tool: PdfToolId, files: File[]) => {
  if (!files.length) return "Please select a file first.";
  const tooLarge = files.find((file) => file.size > FILE_LIMIT);
  if (tooLarge) return `${tooLarge.name} exceeds the 20 MB local-processing limit.`;
  if (files.reduce((total, file) => total + file.size, 0) > TOTAL_LIMIT) return "Selected files exceed the 40 MB combined limit.";

  if (["pdf-to-word", "compress-pdf", "split-pdf", "pdf-to-jpg", "pdf-to-ppt"].includes(tool)) {
    return files.length === 1 && isPdf(files[0]) ? "" : "Please select one valid PDF file.";
  }
  if (tool === "merge-pdf") return files.length >= 2 && files.every(isPdf) ? "" : "Please select at least two valid PDF files.";
  if (tool === "jpg-to-pdf") return files.every((file) => ["jpg", "jpeg", "png"].includes(ext(file))) ? "" : "Please select JPG, JPEG, or PNG images.";
  if (tool === "word-to-pdf") return files.length === 1 && ext(files[0]) === "docx" ? "" : "Please select one DOCX file. Legacy .doc files are not supported.";
  return "";
};

const loadPdfJs = async () => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const worker = await import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
};

const canvasBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The browser could not encode the image.")), type, quality));

const renderPdfPages = async (file: File, quality = 0.82, scale = 1.5) => {
  const pdfjs = await loadPdfJs();
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  if (pdf.numPages > RASTER_PAGE_LIMIT) throw new Error(`This operation supports up to ${RASTER_PAGE_LIMIT} pages.`);
  const pages: Array<{ blob: Blob; width: number; height: number }> = [];
  for (let number = 1; number <= pdf.numPages; number += 1) {
    const page = await pdf.getPage(number);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas rendering is unavailable in this browser.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport, canvas }).promise;
    pages.push({ blob: await canvasBlob(canvas, "image/jpeg", quality), width: canvas.width, height: canvas.height });
    canvas.width = 1;
    canvas.height = 1;
  }
  await pdf.cleanup();
  return pages;
};

const extractPdfPages = async (file: File) => {
  const pdfjs = await loadPdfJs();
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];
  for (let number = 1; number <= pdf.numPages; number += 1) {
    const page = await pdf.getPage(number);
    const content = await page.getTextContent();
    const lines: string[] = [];
    let currentY: number | null = null;
    let line = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = item.transform[5];
      if (currentY !== null && Math.abs(y - currentY) > 3) {
        if (line.trim()) lines.push(line.trim());
        line = "";
      }
      line += `${line ? " " : ""}${item.str}`;
      currentY = y;
    }
    if (line.trim()) lines.push(line.trim());
    pages.push(lines.join("\n"));
  }
  await pdf.cleanup();
  return pages;
};

const parsePageSelection = (pageCount: number, options: PdfToolOptions): number[][] => {
  const mode = options.splitMode ?? "ranges";
  if (mode === "every") return Array.from({ length: pageCount }, (_, index) => [index]);
  if (mode === "fixed") {
    const size = Math.max(1, Math.floor(options.fixedRange ?? 2));
    return Array.from({ length: Math.ceil(pageCount / size) }, (_, group) =>
      Array.from({ length: Math.min(size, pageCount - group * size) }, (__, offset) => group * size + offset),
    );
  }
  const source = (options.ranges ?? "1").trim();
  if (!/^\d+(?:\s*-\s*\d+)?(?:\s*,\s*\d+(?:\s*-\s*\d+)?)*$/.test(source)) throw new Error("Enter pages like 1,3-5,8.");
  const groups = source.split(",").map((range) => {
    const [rawStart, rawEnd] = range.split("-").map((part) => Number(part.trim()));
    const end = rawEnd ?? rawStart;
    if (rawStart < 1 || end < rawStart || end > pageCount) throw new Error(`Page ranges must be between 1 and ${pageCount}.`);
    return Array.from({ length: end - rawStart + 1 }, (_, index) => rawStart - 1 + index);
  });
  return mode === "selected" ? [[...new Set(groups.flat())]] : groups;
};

const createDocx = async (pages: string[]) => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const body = pages.map((page, pageIndex) => {
    const paragraphs = page.split(/\n+/).filter(Boolean).map((line) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`).join("");
    return `${paragraphs}${pageIndex < pages.length - 1 ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : ""}`;
  }).join("");
  zip.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  zip.folder("_rels")?.file(".rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  zip.folder("word")?.file("document.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`);
  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", compression: "DEFLATE" });
};

const createPptx = async (pages: string[]) => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const overrides = pages.map((_, index) => `<Override PartName="/ppt/slides/slide${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("");
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>${overrides}</Types>`);
  zip.folder("_rels")?.file(".rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>');
  const ids = pages.map((_, index) => `<p:sldId id="${256 + index}" r:id="rId${index + 1}"/>`).join("");
  zip.folder("ppt")?.file("presentation.xml", `<?xml version="1.0" encoding="UTF-8"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldIdLst>${ids}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="screen16x9"/></p:presentation>`);
  const rels = pages.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${index + 1}.xml"/>`).join("");
  zip.folder("ppt")?.folder("_rels")?.file("presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}</Relationships>`);
  pages.forEach((text, index) => {
    const paragraphs = (text || `Page ${index + 1}`).split(/\n+/).slice(0, 40).map((line) => `<a:p><a:r><a:rPr lang="en-US" sz="1800"/><a:t>${esc(line)}</a:t></a:r><a:endParaRPr lang="en-US"/></a:p>`).join("");
    zip.folder("ppt")?.folder("slides")?.file(`slide${index + 1}.xml`, `<?xml version="1.0" encoding="UTF-8"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Page ${index + 1}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="457200" y="342900"/><a:ext cx="11277600" cy="6172200"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square"/><a:lstStyle/>${paragraphs}</p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`);
  });
  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", compression: "DEFLATE" });
};

export const documentPackageWriters = { createDocx, createPptx };

const extractDocxText = async (file: File) => {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const document = zip.file("word/document.xml");
  if (!document) throw new Error("This DOCX does not contain a readable document body.");
  const xml = new DOMParser().parseFromString(await document.async("text"), "application/xml");
  if (xml.querySelector("parsererror")) throw new Error("The DOCX document is malformed.");
  return Array.from(xml.getElementsByTagNameNS("*", "p")).map((paragraph) =>
    Array.from(paragraph.getElementsByTagNameNS("*", "t")).map((node) => node.textContent ?? "").join(""),
  ).filter(Boolean);
};

const textPdf = async (lines: string[], pageSize: "A4" | "Letter" = "A4") => {
  const { PDFDocument, PageSizes, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const dimensions = pageSize === "Letter" ? PageSizes.Letter : PageSizes.A4;
  let page = pdf.addPage(dimensions);
  let y = page.getHeight() - 48;
  const safe = (value: string) => value.replace(/[^\x20-\x7E]/g, "?");
  for (const rawLine of lines) {
    const chunks = safe(rawLine).match(/.{1,88}(?:\s|$)|.{1,88}/g) ?? [""];
    for (const line of chunks) {
      if (y < 48) { page = pdf.addPage(dimensions); y = page.getHeight() - 48; }
      page.drawText(line.trim(), { x: 48, y, size: 11, font, color: rgb(0.08, 0.1, 0.16) });
      y -= 16;
    }
    y -= 4;
  }
  return new Blob([await pdf.save()], { type: "application/pdf" });
};

export const processPdfTool = async (tool: PdfToolId, files: File[], options: PdfToolOptions): Promise<ToolResult> => {
  const validation = validateFiles(tool, files);
  if (validation) throw new Error(validation);
  const { PDFDocument } = await import("pdf-lib");

  if (tool === "merge-pdf") {
    const output = await PDFDocument.create();
    for (const file of files) {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const copied = await output.copyPages(source, source.getPageIndices());
      copied.forEach((page) => output.addPage(page));
    }
    const blob = new Blob([await output.save()], { type: "application/pdf" });
    return { fileName: "merged.pdf", blob, details: [`Merged ${files.length} PDFs`, `Output size: ${formatBytes(blob.size)}`] };
  }

  if (tool === "split-pdf") {
    const source = await PDFDocument.load(await files[0].arrayBuffer());
    const groups = parsePageSelection(source.getPageCount(), options);
    const outputs: Array<{ name: string; bytes: Uint8Array }> = [];
    for (let index = 0; index < groups.length; index += 1) {
      const output = await PDFDocument.create();
      const copied = await output.copyPages(source, groups[index]);
      copied.forEach((page) => output.addPage(page));
      outputs.push({ name: `${stem(files[0].name)}-part-${index + 1}.pdf`, bytes: await output.save() });
    }
    if (outputs.length === 1) {
      const blob = new Blob([outputs[0].bytes], { type: "application/pdf" });
      return { fileName: outputs[0].name, blob, details: [`Extracted ${groups[0].length} pages`, `Output size: ${formatBytes(blob.size)}`] };
    }
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    outputs.forEach((output) => zip.file(output.name, output.bytes));
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    return { fileName: `${stem(files[0].name)}-split.zip`, blob, details: [`Created ${outputs.length} PDFs`, `Output size: ${formatBytes(blob.size)}`] };
  }

  if (tool === "jpg-to-pdf") {
    const output = await PDFDocument.create();
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const image = ext(file) === "png" ? await output.embedPng(bytes) : await output.embedJpg(bytes);
      const page = output.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    const blob = new Blob([await output.save()], { type: "application/pdf" });
    return { fileName: "images.pdf", blob, details: [`Converted ${files.length} images`, `Output size: ${formatBytes(blob.size)}`] };
  }

  if (tool === "pdf-to-jpg") {
    const pages = await renderPdfPages(files[0], Math.min(1, Math.max(0.4, (options.jpgQuality ?? 90) / 100)), 1.75);
    if (pages.length === 1) return { fileName: `${stem(files[0].name)}-page-1.jpg`, blob: pages[0].blob, details: ["Rendered 1 page locally", `Output size: ${formatBytes(pages[0].blob.size)}`] };
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    pages.forEach((page, index) => zip.file(`${stem(files[0].name)}-page-${index + 1}.jpg`, page.blob));
    const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
    return { fileName: `${stem(files[0].name)}-jpg.zip`, blob, details: [`Rendered ${pages.length} pages locally`, `Output size: ${formatBytes(blob.size)}`] };
  }

  if (tool === "compress-pdf") {
    const settings = { low: { quality: 0.82, scale: 1.5 }, medium: { quality: 0.65, scale: 1.25 }, high: { quality: 0.45, scale: 1 } }[options.compression ?? "medium"];
    const pages = await renderPdfPages(files[0], settings.quality, settings.scale);
    const output = await PDFDocument.create();
    for (const rendered of pages) {
      const image = await output.embedJpg(await rendered.blob.arrayBuffer());
      const page = output.addPage([rendered.width, rendered.height]);
      page.drawImage(image, { x: 0, y: 0, width: rendered.width, height: rendered.height });
    }
    const blob = new Blob([await output.save({ useObjectStreams: true })], { type: "application/pdf" });
    return { fileName: `${stem(files[0].name)}-compressed.pdf`, blob, details: ["Visual compression flattens searchable text", `Reduced from ${formatBytes(files[0].size)} to ${formatBytes(blob.size)}`] };
  }

  if (tool === "pdf-to-word") {
    const pages = await extractPdfPages(files[0]);
    const blob = await createDocx(pages);
    return { fileName: `${stem(files[0].name)}.docx`, blob, details: ["Created an editable text-first DOCX", "Complex layouts may be simplified"] };
  }

  if (tool === "pdf-to-ppt") {
    const pages = await extractPdfPages(files[0]);
    const blob = await createPptx(pages);
    return { fileName: `${stem(files[0].name)}.pptx`, blob, details: [`Created ${pages.length} editable text slides`, "Complex layouts may be simplified"] };
  }

  const lines = await extractDocxText(files[0]);
  const blob = await textPdf(lines, options.pageSize);
  return { fileName: `${stem(files[0].name)}.pdf`, blob, details: ["Created a readable text-first PDF", "Complex Word layouts may be simplified"] };
};

export const getPdfPageCount = async (file: File) => {
  if (!isPdf(file)) return null;
  const pdfjs = await loadPdfJs();
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const count = pdf.numPages;
  await pdf.cleanup();
  return count;
};

export const downloadBlob = (result: ToolResult) => {
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = result.fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};
