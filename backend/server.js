import express from "express";
import formidable from "formidable";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import JSZip from "jszip";
import PptxGenJS from "pptxgenjs";
import mammoth from "mammoth";
import { PDFDocument, PageSizes, rgb, StandardFonts } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const uploadDir = path.join(rootDir, "temp", "uploads");
const outputDir = path.join(rootDir, "temp", "outputs");
const pythonBin = process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");
const port = Number(process.env.PORT || 5000);
const maxFileSize = 20 * 1024 * 1024;

const app = express();
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN || req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json());

const tools = new Set([
  "pdf-to-word",
  "word-to-pdf",
  "compress-pdf",
  "merge-pdf",
  "jpg-to-pdf",
  "split-pdf",
  "pdf-to-jpg",
  "pdf-to-ppt",
]);

const ensureDirs = () => Promise.all([fs.mkdir(uploadDir, { recursive: true }), fs.mkdir(outputDir, { recursive: true })]);
const ext = (filePath) => path.extname(filePath).toLowerCase();
const first = (value) => Array.isArray(value) ? value[0] : value;
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const uploadedFiles = (files) => {
  const raw = files.files || files.file;
  return (Array.isArray(raw) ? raw : raw ? [raw] : []).map((file) => ({
    path: file.filepath,
    name: file.originalFilename || path.basename(file.filepath),
    size: file.size,
  }));
};

const parseJson = (value, fallback = {}) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const parseScriptOutput = (stdout) => {
  const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1);
  if (!line) throw new Error("Processing script returned no output.");
  const parsed = JSON.parse(line);
  if (!Array.isArray(parsed.outputs) || parsed.outputs.length === 0) {
    throw new Error("Processing script returned no files.");
  }
  return parsed.outputs.map((item) => path.resolve(rootDir, item));
};

const findSoffice = () => {
  if (process.env.SOFFICE_BIN) return process.env.SOFFICE_BIN;
  const candidates = [
    "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
    "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
  ];
  for (const candidate of candidates) {
    try {
      if (spawnSync(candidate, ["--version"], { encoding: "utf8" }).status === 0) return candidate;
    } catch {
      // Keep looking.
    }
  }
  for (const command of ["soffice", "libreoffice"]) {
    const found = spawnSync(process.platform === "win32" ? "where.exe" : "which", [command], { encoding: "utf8" });
    if (found.status === 0) return found.stdout.trim().split(/\r?\n/)[0];
  }
  return "";
};

const runPython = (script, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(pythonBin, [path.join(rootDir, "python", script), outputDir, ...args], {
      cwd: rootDir,
      shell: false,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", () => reject(new Error("Python is not available. Install Python and set PYTHON_BIN if needed.")));
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || "PDF processing failed."));
        return;
      }
      try {
        resolve(parseScriptOutput(stdout));
      } catch (error) {
        reject(error);
      }
    });
  });

const validateUpload = (tool, files) => {
  if (!tools.has(tool)) return "Unsupported PDF tool.";
  if (!files.length) return "Please upload a file first.";
  if (files.some((file) => file.size > maxFileSize)) return "Files must be 20MB or smaller.";

  const pdfTools = new Set(["pdf-to-word", "compress-pdf", "split-pdf", "pdf-to-jpg", "pdf-to-ppt"]);
  if (pdfTools.has(tool)) return files.length === 1 && ext(files[0].name) === ".pdf" ? "" : "Please upload one PDF file.";
  if (tool === "merge-pdf") return files.length >= 2 && files.every((file) => ext(file.name) === ".pdf") ? "" : "Please upload at least two PDF files.";
  if (tool === "jpg-to-pdf") return files.every((file) => [".jpg", ".jpeg", ".png"].includes(ext(file.name))) ? "" : "Please upload JPG, JPEG, or PNG images.";
  if (tool === "word-to-pdf") return files.length === 1 && [".doc", ".docx"].includes(ext(files[0].name)) ? "" : "Please upload one Word document.";
  return "";
};

const cleanFiles = async (files) => {
  await Promise.all(files.map((file) => fs.unlink(file).catch(() => {})));
};

const readResult = async (filePath, fileName, details, contentType) => {
  const buffer = await fs.readFile(filePath);
  return { buffer, fileName, details: [...details, `Output size: ${formatBytes(buffer.length)}`], contentType };
};

const zipFiles = async (files, fileName, details) => {
  const zip = new JSZip();
  for (const filePath of files) {
    zip.file(path.basename(filePath), await fs.readFile(filePath));
  }
  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  return { buffer, fileName, details: [...details, `Output size: ${formatBytes(buffer.length)}`], contentType: "application/zip" };
};

const convertWithLibreOffice = async (inputPath, outputExtension) => {
  const soffice = findSoffice();
  if (!soffice) return "";

  await new Promise((resolve, reject) => {
    const child = spawn(soffice, ["--headless", "--convert-to", outputExtension, "--outdir", outputDir, inputPath], { shell: false });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `LibreOffice ${outputExtension} conversion failed.`)));
  });

  const converted = path.join(outputDir, `${path.basename(inputPath, path.extname(inputPath))}.${outputExtension}`);
  try {
    await fs.access(converted);
    return converted;
  } catch {
    return "";
  }
};

const pdfFromWord = async (file, fileName) => {
  const converted = await convertWithLibreOffice(file.path, "pdf");
  if (converted) {
    try {
      return await readResult(converted, fileName, ["Converted with LibreOffice layout preservation"], "application/pdf");
    } finally {
      await cleanFiles([converted]);
    }
  }

  const { value } = await mammoth.extractRawText({ path: file.path });
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
  return {
    buffer: Buffer.from(bytes),
    fileName,
    details: ["LibreOffice not found; converted text only. Install LibreOffice for Word layout preservation.", `Output size: ${formatBytes(bytes.length)}`],
    contentType: "application/pdf",
  };
};

const pptFromImages = async (imagePaths, fileName) => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  for (const imagePath of imagePaths) {
    const slide = pptx.addSlide();
    slide.addImage({ path: imagePath, x: 0, y: 0, w: 13.333, h: 7.5 });
  }
  const buffer = await pptx.write({ outputType: "nodebuffer" });
  return {
    buffer,
    fileName,
    details: [`Created ${imagePaths.length} slide${imagePaths.length === 1 ? "" : "s"}`, `Output size: ${formatBytes(buffer.length)}`],
    contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
};

const pptFromLayout = async (layoutPath, fileName) => {
  const layout = JSON.parse(await fs.readFile(layoutPath, "utf8"));
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";

  for (const page of layout.pages) {
    const slide = pptx.addSlide();
    const scaleX = 13.333 / page.width;
    const scaleY = 7.5 / page.height;
    for (const item of page.text) {
      slide.addText(item.text, {
        x: item.x * scaleX,
        y: item.y * scaleY,
        w: Math.max(0.2, item.w * scaleX),
        h: Math.max(0.15, item.h * scaleY),
        fontFace: item.font || "Arial",
        fontSize: Math.max(6, item.size * 0.75),
        bold: item.bold,
        italic: item.italic,
        color: item.color || "111111",
        margin: 0,
        breakLine: false,
        fit: "shrink",
      });
    }
  }

  const buffer = await pptx.write({ outputType: "nodebuffer" });
  return {
    buffer,
    fileName,
    details: [`Created ${layout.pages.length} editable slide${layout.pages.length === 1 ? "" : "s"}`, "Text is editable where PyMuPDF can extract it.", `Output size: ${formatBytes(buffer.length)}`],
    contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
};

const buildResult = async (tool, files, options) => {
  const stem = path.basename(files[0].name, path.extname(files[0].name));

  if (tool === "word-to-pdf") return { result: await pdfFromWord(files[0], `${stem}.pdf`), outputs: [] };

  if (tool === "pdf-to-word") {
    const libreOfficeDocx = await convertWithLibreOffice(files[0].path, "docx");
    if (libreOfficeDocx) {
      try {
        return {
          result: await readResult(libreOfficeDocx, `${stem}.docx`, ["Converted with LibreOffice PDF import"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
          outputs: [],
        };
      } finally {
        await cleanFiles([libreOfficeDocx]);
      }
    }

    const outputs = await runPython("pdf_to_docx.py", [files[0].path]);
    return { result: await readResult(outputs[0], `${stem}.docx`, ["LibreOffice PDF import unavailable; converted with layout-aware pdf2docx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document"), outputs };
  }

  if (tool === "merge-pdf") {
    const outputs = await runPython("merge.py", files.map((file) => file.path));
    return { result: await readResult(outputs[0], "merged.pdf", [`Merged ${files.length} PDFs`], "application/pdf"), outputs };
  }

  if (tool === "compress-pdf") {
    const outputs = await runPython("compress.py", [files[0].path]);
    return { result: await readResult(outputs[0], `${stem}-compressed.pdf`, ["Compressed PDF streams"], "application/pdf"), outputs };
  }

  if (tool === "split-pdf") {
    const mode = ["selected", "ranges", "fixed", "every"].includes(options.splitMode) ? options.splitMode : "ranges";
    const splitValue = mode === "fixed" ? String(options.fixedRange || 2) : options.ranges || "1";
    const outputs = await runPython("split.py", [files[0].path, mode, splitValue]);
    const result = outputs.length === 1
      ? await readResult(outputs[0], `${stem}-split.pdf`, ["Extracted selected pages"], "application/pdf")
      : await zipFiles(outputs, `${stem}-split.zip`, [`Created ${outputs.length} PDF files`]);
    return { result, outputs };
  }

  if (tool === "jpg-to-pdf") {
    const outputs = await runPython("image_to_pdf.py", files.map((file) => file.path));
    return { result: await readResult(outputs[0], "images.pdf", [`Converted ${files.length} image${files.length === 1 ? "" : "s"}`], "application/pdf"), outputs };
  }

  if (tool === "pdf-to-jpg") {
    const outputs = await runPython("pdf_to_image.py", [files[0].path]);
    if (outputs.length === 1) {
      return { result: await readResult(outputs[0], `${stem}-page-1.jpg`, ["Rendered 1 page at high quality"], "image/jpeg"), outputs };
    }
    return { result: await zipFiles(outputs, `${stem}-jpg.zip`, [`Rendered ${outputs.length} page${outputs.length === 1 ? "" : "s"}`]), outputs };
  }

  const outputs = await runPython("pdf_layout.py", [files[0].path]);
  return { result: await pptFromLayout(outputs[0], `${stem}.pptx`), outputs };
};

const handlePdfProcess = async (req, res) => {
  await ensureDirs();
  const form = formidable({ uploadDir, keepExtensions: true, maxFileSize, multiples: true });

  form.parse(req, async (err, fields, rawFiles) => {
    if (err) {
      res.status(400).json({ error: "Upload failed. Check file size and type." });
      return;
    }

    const tool = String(first(fields.tool) || "");
    const options = parseJson(first(fields.options));
    const files = uploadedFiles(rawFiles);
    const validation = validateUpload(tool, files);

    if (validation) {
      await cleanFiles(files.map((file) => file.path));
      res.status(400).json({ error: validation });
      return;
    }

    let outputs = [];
    try {
      const { result, outputs: resultOutputs } = await buildResult(tool, files, options);
      outputs = resultOutputs;

      res.setHeader("Content-Type", result.contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(result.fileName)}"`);
      res.setHeader("X-ToolsNest-Details", JSON.stringify(result.details));
      res.send(result.buffer);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "PDF processing failed." });
    } finally {
      await cleanFiles([...files.map((file) => file.path), ...outputs]);
    }
  });
};

app.post("/api/pdf/process", handlePdfProcess);
app.post("/upload", handlePdfProcess);
app.post("/process", handlePdfProcess);

await ensureDirs();
app.listen(port, () => {
  console.log(`ToolsNest PDF backend running on http://localhost:${port}`);
});
