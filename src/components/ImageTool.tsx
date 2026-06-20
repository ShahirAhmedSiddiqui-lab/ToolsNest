import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, Image as ImageIcon, ShieldCheck, Trash2 } from "lucide-react";
import { formatBytes } from "../lib/pdfTools";

type ImageMode = "compress" | "convert";
type OutputType = "image/jpeg" | "image/png" | "image/webp";

const extensionFor = (type: OutputType) => ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" })[type];

export const ImageTool = ({ mode }: { mode: ImageMode }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [quality, setQuality] = useState(75);
  const [outputType, setOutputType] = useState<OutputType>("image/webp");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  const select = (next: File | undefined) => {
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (next.size > 20 * 1024 * 1024) {
      setError("Images must be 20 MB or smaller.");
      return;
    }
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setFile(next);
    setError("");
    if (mode === "compress" && next.type !== "image/png") setOutputType(next.type as OutputType);
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => select(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    select(event.dataTransfer.files[0]);
  };

  const process = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d", { alpha: outputType === "image/png" });
      if (!context) throw new Error("Canvas processing is unavailable.");
      if (outputType !== "image/png") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Image encoding failed.")), outputType, quality / 100));
      canvas.width = 1;
      canvas.height = 1;
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9 _.-]/gi, "") || "image";
      setResult({ blob, url: URL.createObjectURL(blob), name: `${base}-${mode === "compress" ? "compressed" : "converted"}.${extensionFor(outputType)}` });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Image processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  const clear = () => {
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6 md:p-10">
      <div
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border-slate"}`}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <ImageIcon className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
        <p className="font-semibold text-heading-navy">{file ? file.name : "Drop a JPG, PNG, or WebP image here"}</p>
        {file && <p className="mt-1 text-sm text-on-surface-variant">{formatBytes(file.size)}</p>}
        <input ref={inputRef} type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={onInput} />
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 min-h-11 rounded-lg bg-primary px-6 py-2.5 font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          {file ? "Choose another image" : "Select image"}
        </button>
      </div>

      {file && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-heading-navy">Output format
            <select value={outputType} onChange={(event) => setOutputType(event.target.value as OutputType)} className="mt-2 min-h-11 w-full rounded-lg border border-border-slate bg-surface px-3">
              <option value="image/webp">WebP</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-heading-navy">Quality: {quality}%
            <input type="range" min="35" max="95" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-4 w-full" disabled={outputType === "image/png"} />
          </label>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" disabled={!file || processing} onClick={process} className="min-h-11 rounded-lg bg-primary px-6 py-2.5 font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-50">{processing ? "Processing…" : mode === "compress" ? "Compress image" : "Convert image"}</button>
        {file && <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-slate px-5 py-2.5 font-medium text-heading-navy"><Trash2 className="h-4 w-4" /> Clear</button>}
      </div>
      {error && <p className="mt-4 text-sm font-medium text-error" role="alert">{error}</p>}
      {result && (
        <div className="mt-6 rounded-xl bg-surface-container-low p-5" aria-live="polite">
          <p className="flex items-center gap-2 font-semibold text-success-teal"><CheckCircle2 className="h-5 w-5" /> Ready — {formatBytes(result.blob.size)}</p>
          <a href={result.url} download={result.name} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-heading-navy px-5 py-2.5 font-medium text-white"><Download className="h-4 w-4" /> Download {result.name}</a>
        </div>
      )}
      <p className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-on-surface-variant"><ShieldCheck className="h-4 w-4 text-success-teal" /> Processed locally in your browser</p>
    </div>
  );
};
