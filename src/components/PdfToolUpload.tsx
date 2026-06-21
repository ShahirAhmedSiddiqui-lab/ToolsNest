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
    conversionMode: "visual",
    pageSize: "A4",
    orientation: "portrait",
    splitMode: "ranges",
    ranges: "1",
    fixedRange: 2,
    jpgQuality: 90,
    rotation: 90,
    pageSelection: "all",
    selectedPages: "1",
    removePages: "1",
    watermarkText: "CONFIDENTIAL",
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
    if (["split-pdf", "rotate-pdf", "delete-pdf-pages"].includes(tool) && next.length === 1) {
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
        <div className="mb-4 flex flex-col items-center gap-2"><select aria-label="Compression level" className="bg-surface-container-low border border-border-slate rounded-lg px-4 py-2 text-sm" value={options.compression} onChange={(event) => setOptions({ ...options, compression: event.target.value as PdfToolOptions["compression"] })}>
          <option value="low">Low compression</option><option value="medium">Medium compression</option><option value="high">High compression</option>
        </select><p className="text-xs text-on-surface-variant">Low keeps original quality, medium balances savings and clarity, and high only rasterizes when it produces a meaningful size win.</p></div>
      )}

      {["pdf-to-word", "pdf-to-ppt", "word-to-pdf"].includes(tool) && (
        <div className="mb-4 flex max-w-xl flex-col items-center gap-2">
          <select
            aria-label="Conversion mode"
            className="bg-surface-container-low border border-border-slate rounded-lg px-4 py-2 text-sm"
            value={options.conversionMode}
            onChange={(event) => setOptions({ ...options, conversionMode: event.target.value as PdfToolOptions["conversionMode"] })}
          >
            <option value="visual">Visual Match</option>
            <option value="editable">Editable</option>
          </select>
          <p className="text-xs text-on-surface-variant">
            {options.conversionMode === "visual"
              ? "Visual Match keeps the page appearance as closely as possible. Editing is limited."
              : "Editable rebuilds text for easier editing. Layout may change."}
          </p>
        </div>
      )}

      {tool === "rotate-pdf" && (
        <div className="mb-4 flex max-w-xl flex-col items-center gap-3">
          {pageCount && <p className="text-sm font-medium text-primary">Total pages: {pageCount}</p>}
          <label className="text-sm font-semibold text-heading-navy">Rotation
            <select value={options.rotation} onChange={(event) => setOptions({ ...options, rotation: Number(event.target.value) as 90 | 180 | 270 })} className="ml-3 min-h-11 rounded-lg border border-border-slate bg-surface px-3"><option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option></select>
          </label>
          <div className="flex gap-4 text-sm"><label><input type="radio" name="page-selection" checked={options.pageSelection === "all"} onChange={() => setOptions({ ...options, pageSelection: "all" })} /> All pages</label><label><input type="radio" name="page-selection" checked={options.pageSelection === "selected"} onChange={() => setOptions({ ...options, pageSelection: "selected" })} /> Selected pages</label></div>
          {options.pageSelection === "selected" && <label className="text-sm font-semibold">Pages<input value={options.selectedPages} onChange={(event) => setOptions({ ...options, selectedPages: event.target.value })} placeholder="1,3-5" className="ml-3 min-h-11 w-44 rounded-lg border border-border-slate px-3" /></label>}
        </div>
      )}

      {tool === "delete-pdf-pages" && (
        <div className="mb-4 flex flex-col items-center gap-3">{pageCount && <><p className="text-sm font-medium text-primary">Total pages: {pageCount}</p><div className="flex max-w-lg flex-wrap justify-center gap-1.5" aria-label={`Available pages 1 through ${pageCount}`}>{Array.from({ length: Math.min(pageCount, 60) }, (_, index) => <span key={index} className="flex h-7 min-w-7 items-center justify-center rounded border border-border-slate bg-surface px-1 text-xs">{index + 1}</span>)}{pageCount > 60 && <span className="px-2 text-sm text-on-surface-variant">… {pageCount}</span>}</div></>}<label className="text-sm font-semibold text-heading-navy">Pages to remove<input value={options.removePages} onChange={(event) => setOptions({ ...options, removePages: event.target.value })} placeholder="2,4-6" className="ml-3 min-h-11 w-44 rounded-lg border border-border-slate px-3" /></label><p className="text-xs text-on-surface-variant">Use commas and ranges, for example 2,4-6.</p></div>
      )}

      {tool === "watermark-pdf" && (
        <label className="mb-4 w-full max-w-md text-left text-sm font-semibold text-heading-navy">Watermark text<input value={options.watermarkText} maxLength={80} onChange={(event) => setOptions({ ...options, watermarkText: event.target.value })} className="mt-2 min-h-11 w-full rounded-lg border border-border-slate px-3" /></label>
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

      {error && <p className="mt-5 text-sm font-medium text-red-600" role="alert">{error}</p>}

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
