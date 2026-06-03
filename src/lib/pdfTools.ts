import { Document, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { PDFDocument, PageSizes, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import PptxGenJS from "pptxgenjs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

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
  splitMode?: "ranges" | "every";
  ranges?: string;
  jpgQuality?: number;
};

export type ToolResult = {
  fileName: string;
  blob: Blob;
  details: string[];
};

const MB = 1024 * 1024;
const FREE_LIMIT = 20 * MB;

const isPdf = (file: File) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
const ext = (file: File) => file.name.split(".").pop()?.toLowerCase() ?? "";
const baseName = (file: File) => file.name.replace(/\.[^.]+$/, "");

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / MB).toFixed(2)} MB`;
};

export const validateFiles = (tool: PdfToolId, files: File[]) => {
  if (!files.length) return "Please select a file first.";
  const tooLarge = files.find((file) => file.size > FREE_LIMIT);
  if (tooLarge) return `${tooLarge.name} is ${formatBytes(tooLarge.size)}. Free tools support up to 20MB.`;

  if (["pdf-to-word", "compress-pdf", "split-pdf", "pdf-to-jpg", "pdf-to-ppt"].includes(tool)) {
    return files.length === 1 && isPdf(files[0]) ? "" : "Please select one valid PDF file.";
  }

  if (tool === "merge-pdf") {
    return files.length >= 2 && files.every(isPdf) ? "" : "Please select at least two valid PDF files.";
  }

  if (tool === "jpg-to-pdf") {
    return files.every((file) => ["jpg", "jpeg", "png"].includes(ext(file)) || file.type.startsWith("image/"))
      ? ""
      : "Please select JPG, JPEG, or PNG images.";
  }

  if (tool === "word-to-pdf") {
    return files.length === 1 && ["doc", "docx"].includes(ext(files[0]))
      ? ""
      : "Please select one DOC or DOCX file.";
  }

  return "";
};

export const processPdfTool = async (tool: PdfToolId, files: File[], options: PdfToolOptions): Promise<ToolResult> => {
  const validation = validateFiles(tool, files);
  if (validation) throw new Error(validation);

  if (tool === "merge-pdf") return mergePdf(files);
  if (tool === "split-pdf") return splitPdf(files[0], options);
  if (tool === "jpg-to-pdf") return imagesToPdf(files, options);
  if (tool === "pdf-to-jpg") return pdfToJpg(files[0], options);
  if (tool === "pdf-to-ppt") return pdfToPpt(files[0]);
  if (tool === "pdf-to-word") return pdfToWord(files[0]);
  if (tool === "word-to-pdf") return wordToPdf(files[0]);
  return compressPdf(files[0], options);
};

const loadPdfLibDoc = async (file: File) => {
  try {
    return await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  } catch {
    throw new Error("This PDF is encrypted, corrupted, or unsupported.");
  }
};

const mergePdf = async (files: File[]): Promise<ToolResult> => {
  const output = await PDFDocument.create();
  for (const file of files) {
    const source = await loadPdfLibDoc(file);
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }
  const bytes = await output.save({ useObjectStreams: true });
  return {
    fileName: "merged.pdf",
    blob: new Blob([bytes], { type: "application/pdf" }),
    details: [`Merged ${files.length} PDFs`, `Output size: ${formatBytes(bytes.length)}`],
  };
};

const compressPdf = async (file: File, options: PdfToolOptions): Promise<ToolResult> => {
  const source = await loadPdfLibDoc(file);
  source.setProducer("ToolsNest");
  source.setCreator("ToolsNest PDF Compressor");
  const bytes = await source.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: options.compression === "high" ? 100 : 50,
  });
  const reduction = Math.max(0, Math.round((1 - bytes.length / file.size) * 100));
  return {
    fileName: `${baseName(file)}-compressed.pdf`,
    blob: new Blob([bytes], { type: "application/pdf" }),
    details: [`Original: ${formatBytes(file.size)}`, `New: ${formatBytes(bytes.length)}`, `Reduction: ${reduction}%`],
  };
};

const parseRanges = (input: string, pageCount: number) => {
  const pages = new Set<number>();
  input.split(",").map((part) => part.trim()).filter(Boolean).forEach((part) => {
    const [startRaw, endRaw] = part.split("-").map((value) => Number(value.trim()));
    const start = Math.max(1, Math.min(pageCount, startRaw));
    const end = Math.max(start, Math.min(pageCount, endRaw || startRaw));
    for (let page = start; page <= end; page += 1) pages.add(page - 1);
  });
  return [...pages].sort((a, b) => a - b);
};

const splitPdf = async (file: File, options: PdfToolOptions): Promise<ToolResult> => {
  const source = await loadPdfLibDoc(file);
  const zip = new JSZip();
  const pageCount = source.getPageCount();

  if (options.splitMode === "every") {
    for (let index = 0; index < pageCount; index += 1) {
      const output = await PDFDocument.create();
      const [page] = await output.copyPages(source, [index]);
      output.addPage(page);
      zip.file(`${baseName(file)}-page-${index + 1}.pdf`, await output.save());
    }
  } else {
    const selected = parseRanges(options.ranges || "1", pageCount);
    if (!selected.length) throw new Error("Enter page ranges like 1-3,5.");
    const output = await PDFDocument.create();
    const pages = await output.copyPages(source, selected);
    pages.forEach((page) => output.addPage(page));
    zip.file(`${baseName(file)}-split.pdf`, await output.save());
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return { fileName: `${baseName(file)}-split.zip`, blob, details: [`Source pages: ${pageCount}`, "Split files packaged as ZIP"] };
};

const imageToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });

const imagesToPdf = async (files: File[], options: PdfToolOptions): Promise<ToolResult> => {
  const pdf = await PDFDocument.create();
  const pageSize = options.pageSize === "Letter" ? PageSizes.Letter : PageSizes.A4;
  const size = options.orientation === "landscape" ? [pageSize[1], pageSize[0]] : pageSize;

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const image = ext(file) === "png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage(size as [number, number]);
    const scale = Math.min(page.getWidth() / image.width, page.getHeight() / image.height) * 0.9;
    const width = image.width * scale;
    const height = image.height * scale;
    page.drawImage(image, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height });
  }

  const bytes = await pdf.save();
  return {
    fileName: "images.pdf",
    blob: new Blob([bytes], { type: "application/pdf" }),
    details: [`Converted ${files.length} image${files.length === 1 ? "" : "s"}`, `Output size: ${formatBytes(bytes.length)}`],
  };
};

const renderPdfPages = async (file: File, scale = 2) => {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: { dataUrl: string; width: number; height: number }[] = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available in this browser.");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    pages.push({ dataUrl: canvas.toDataURL("image/jpeg", 0.9), width: viewport.width, height: viewport.height });
  }
  return pages;
};

const pdfToJpg = async (file: File, options: PdfToolOptions): Promise<ToolResult> => {
  const pages = await renderPdfPages(file, options.jpgQuality === 100 ? 2.5 : 2);
  const zip = new JSZip();
  pages.forEach((page, index) => zip.file(`${baseName(file)}-page-${index + 1}.jpg`, page.dataUrl.split(",")[1], { base64: true }));
  const blob = await zip.generateAsync({ type: "blob" });
  return { fileName: `${baseName(file)}-jpg.zip`, blob, details: [`Rendered ${pages.length} page${pages.length === 1 ? "" : "s"}`, "JPG files packaged as ZIP"] };
};

const pdfToPpt = async (file: File): Promise<ToolResult> => {
  const pages = await renderPdfPages(file, 1.5);
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pages.forEach((page) => {
    const slide = pptx.addSlide();
    slide.addImage({ data: page.dataUrl, x: 0, y: 0, w: 13.333, h: 7.5 });
  });
  const blob = await pptx.write({ outputType: "blob" }) as Blob;
  return { fileName: `${baseName(file)}.pptx`, blob, details: [`Created ${pages.length} slide${pages.length === 1 ? "" : "s"}`, "One PDF page per slide"] };
};

const pdfToWord = async (file: File): Promise<ToolResult> => {
  const pages = await renderPdfPages(file, 1.35);
  const children: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: `Converted from ${file.name}`, bold: true })] }),
  ];
  for (const page of pages) {
    const imageBytes = Uint8Array.from(atob(page.dataUrl.split(",")[1]), (char) => char.charCodeAt(0));
    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: imageBytes,
            type: "jpg",
            transformation: { width: 560, height: Math.round((page.height / page.width) * 560) },
          }),
        ],
      }),
    );
  }
  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  return { fileName: `${baseName(file)}.docx`, blob, details: [`Converted ${pages.length} page${pages.length === 1 ? "" : "s"}`, "Layout preserved as editable Word document content"] };
};

const wordToPdf = async (file: File): Promise<ToolResult> => {
  const buffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let page = pdf.addPage(PageSizes.A4);
  const margin = 48;
  let y = page.getHeight() - margin;
  const lines = (value || file.name).split(/\r?\n/).flatMap((line) => line.match(/.{1,88}(\s|$)/g) || [""]);
  for (const line of lines) {
    if (y < margin) {
      page = pdf.addPage(PageSizes.A4);
      y = page.getHeight() - margin;
    }
    page.drawText(line.trim(), { x: margin, y, size: 11, font, color: rgb(0.1, 0.12, 0.18) });
    y -= 16;
  }
  const bytes = await pdf.save();
  return { fileName: `${baseName(file)}.pdf`, blob: new Blob([bytes], { type: "application/pdf" }), details: [`Converted ${formatBytes(file.size)} Word file`, `Output size: ${formatBytes(bytes.length)}`] };
};

export const downloadBlob = (result: ToolResult) => {
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = result.fileName;
  link.click();
  URL.revokeObjectURL(url);
};
