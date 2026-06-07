import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { CheckCircle2, Download, FileText, Image as ImageIcon, ShieldAlert } from "lucide-react";
import { downloadBlob, formatBytes, getPdfPageCount, PdfToolId, PdfToolOptions, processPdfTool, ToolResult, validateFiles } from "../lib/pdfTools";

type Props = {
  tool: PdfToolId;
  icon?: "pdf" | "image";
  title: string;
  browseText: string;
  multiple?: boolean;
  accept: string;
};

export const PdfToolUpload = ({ tool, icon = "pdf", title, browseText, multiple = false, accept }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<PdfToolOptions>({
    compression: "medium",
    pageSize: "A4",
    orientation: "portrait",
    splitMode: "ranges",
    ranges: "1",
    fixedRange: 2,
    jpgQuality: 90,
  });
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ToolResult | null>(null);

  const Icon = icon === "image" ? ImageIcon : FileText;

  const pickFiles = async (selected: FileList | null) => {
    const next = Array.from(selected ?? []);
    setFiles(next);
    setResult(null);
    setError(validateFiles(tool, next));
    setPageCount(null);
    if (tool === "split-pdf" && next.length === 1) {
      try {
        setPageCount(await getPdfPageCount(next[0]));
      } catch {
        setError("Could not read the PDF page count.");
      }
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void pickFiles(event.dataTransfer.files);
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => void pickFiles(event.target.files);

  const runTool = async () => {
    setError("");
    setResult(null);
    const validation = validateFiles(tool, files);
    if (validation) {
      setError(validation);
      return;
    }
    setIsProcessing(true);
    try {
      setResult(await processPdfTool(tool, files, options));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while processing this file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`w-full bg-surface-container-lowest border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all ${
        isDragging ? "border-primary bg-primary/5" : "border-border-slate hover:border-primary/50"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={onInput} />
      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-heading-navy mb-2">{title}</h3>
      <p className="text-on-surface-variant mb-8">Drag & Drop or click to browse</p>

      {tool === "compress-pdf" && (
        <select className="mb-4 bg-surface-container-low border border-border-slate rounded-lg px-4 py-2 text-sm" value={options.compression} onChange={(event) => setOptions({ ...options, compression: event.target.value as PdfToolOptions["compression"] })}>
          <option value="low">Low compression</option>
          <option value="medium">Medium compression</option>
          <option value="high">High compression</option>
        </select>
      )}

      {tool === "jpg-to-pdf" && (
        <div className="mb-4 flex flex-wrap justify-center gap-3">
          <select className="bg-surface-container-low border border-border-slate rounded-lg px-4 py-2 text-sm" value={options.pageSize} onChange={(event) => setOptions({ ...options, pageSize: event.target.value as PdfToolOptions["pageSize"] })}>
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
          </select>
          <select className="bg-surface-container-low border border-border-slate rounded-lg px-4 py-2 text-sm" value={options.orientation} onChange={(event) => setOptions({ ...options, orientation: event.target.value as PdfToolOptions["orientation"] })}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      )}

      {tool === "split-pdf" && (
        <div className="mb-4 flex max-w-xl flex-col items-center gap-3 text-left">
          {pageCount && <p className="text-sm font-medium text-primary">Total pages: {pageCount}</p>}
          <select className="bg-surface-container-low border border-border-slate rounded-lg px-4 py-2 text-sm" value={options.splitMode} onChange={(event) => setOptions({ ...options, splitMode: event.target.value as PdfToolOptions["splitMode"] })}>
            <option value="selected">Extract selected pages</option>
            <option value="ranges">Split by custom ranges</option>
            <option value="fixed">Split every N pages</option>
            <option value="every">Extract every page as a separate PDF</option>
          </select>
          {(options.splitMode === "selected" || options.splitMode === "ranges") && (
            <>
              <input className="bg-surface-container-low border border-border-slate rounded-lg px-4 py-2 text-sm w-64" value={options.ranges} onChange={(event) => setOptions({ ...options, ranges: event.target.value })} placeholder={options.splitMode === "selected" ? "1,3,5" : "1-3,5,8-10"} />
              <p className="text-xs text-on-surface-variant">Use commas for separate pages and hyphens for ranges. Example: 1-3, 5, 8-10</p>
            </>
          )}
          {options.splitMode === "fixed" && (
            <label className="text-sm text-heading-navy">
              Split every{" "}
              <input type="number" min={1} className="bg-surface-container-low border border-border-slate rounded-lg px-3 py-2 text-sm w-20" value={options.fixedRange ?? 2} onChange={(event) => setOptions({ ...options, fixedRange: Number(event.target.value) })} /> pages
            </label>
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className="mb-5 text-sm text-on-surface-variant">
          {files.length === 1 ? `${files[0].name} (${formatBytes(files[0].size)})` : `${files.length} files selected`}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} className="bg-primary text-on-primary text-lg font-medium px-8 py-4 rounded-xl shadow-md hover:bg-primary-container transition-all hover:-translate-y-0.5 active:translate-y-0">
          {browseText}
        </button>
        {files.length > 0 && (
          <button type="button" onClick={runTool} disabled={isProcessing} className="bg-heading-navy text-white text-lg font-medium px-8 py-4 rounded-xl shadow-md hover:opacity-90 transition-all disabled:opacity-60">
            {isProcessing ? "Processing..." : "Convert"}
          </button>
        )}
      </div>

      {error && <p className="mt-5 text-sm font-medium text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-surface-container-low rounded-xl p-4 w-full max-w-md">
          <div className="flex items-center justify-center gap-2 text-success-teal font-semibold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Ready to download
          </div>
          {result.details.map((detail) => (
            <p key={detail} className="text-sm text-on-surface-variant">{detail}</p>
          ))}
          <button type="button" onClick={() => downloadBlob(result)} className="mt-4 inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary-container transition-colors">
            <Download className="w-4 h-4" />
            Download {result.fileName}
          </button>
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 text-xs font-medium text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full">
        <ShieldAlert className="w-4 h-4 text-success-teal" />
        Secure & Private Processing
      </div>
    </div>
  );
};
