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

export type ToolResult = {
  fileName: string;
  blob: Blob;
  details: string[];
};

const MB = 1024 * 1024;
const FREE_LIMIT = 20 * MB;
const API_BASE_URL = import.meta.env.VITE_PDF_API_BASE_URL || "";

const isPdf = (file: File) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
const ext = (file: File) => file.name.split(".").pop()?.toLowerCase() ?? "";

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

const fileNameFromDisposition = (header: string | null, fallback: string) => {
  const match = header?.match(/filename="?([^";]+)"?/i);
  return match?.[1] ? decodeURIComponent(match[1]) : fallback;
};

const responseError = async (response: Response) => {
  try {
    const body = await response.json();
    return typeof body.error === "string" ? body.error : "PDF processing failed.";
  } catch {
    if (response.status >= 500) {
      return "PDF backend is not running. Start it with npm run server, then retry.";
    }
    return "PDF processing failed.";
  }
};

export const processPdfTool = async (tool: PdfToolId, files: File[], options: PdfToolOptions): Promise<ToolResult> => {
  const validation = validateFiles(tool, files);
  if (validation) throw new Error(validation);

  const formData = new FormData();
  formData.append("tool", tool);
  formData.append("options", JSON.stringify(options));
  files.forEach((file) => formData.append("files", file));

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/pdf/process`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("PDF backend is not running. Start it with npm run server, then retry.");
  }

  if (!response.ok) throw new Error(await responseError(response));

  const blob = await response.blob();
  const fileName = fileNameFromDisposition(response.headers.get("content-disposition"), `${tool}-output`);
  const detailsHeader = response.headers.get("x-toolsnest-details");
  const details = detailsHeader ? JSON.parse(detailsHeader) as string[] : [`Output size: ${formatBytes(blob.size)}`];

  return { fileName, blob, details };
};

export const getPdfPageCount = async (file: File) => {
  if (!isPdf(file)) return null;
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const worker = await import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url");
  pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  return pdf.numPages;
};

export const downloadBlob = (result: ToolResult) => {
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = result.fileName;
  link.click();
  URL.revokeObjectURL(url);
};
