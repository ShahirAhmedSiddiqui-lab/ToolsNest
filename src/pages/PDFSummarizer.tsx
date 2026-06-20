import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Check, Copy, FileText, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { deleteAIFile, requestAI, uploadAIFile } from "../services/gemini";

export const PDFSummarizer = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const select = (next?: File) => {
    if (!next) return;
    if (next.type !== "application/pdf" || next.size > 10 * 1024 * 1024) { setError("Choose a PDF no larger than 10 MB."); return; }
    setFile(next); setSummary(""); setError(""); setConsent(false);
  };
  const onInput = (event: ChangeEvent<HTMLInputElement>) => select(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragging(false); select(event.dataTransfer.files[0]); };

  const summarize = async () => {
    if (!file || !consent) return;
    setProcessing(true); setError("");
    let remote;
    try {
      remote = await uploadAIFile(file);
      setSummary(await requestAI("summary", {}, remote));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not summarize this PDF."); }
    finally { if (remote) await deleteAIFile(remote); setProcessing(false); }
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12"><div className="max-w-4xl mx-auto">
      <Breadcrumbs />
      <header className="mb-8 text-center"><Sparkles className="mx-auto mb-4 h-10 w-10 text-primary" /><h1 className="text-3xl font-bold text-heading-navy">AI PDF Summarizer</h1><p className="mt-3 text-on-surface-variant">Upload a PDF to Gemini only after explicit consent. The remote file is deleted after summarization.</p></header>
      <div className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6 md:p-8">
        <div className={`rounded-xl border-2 border-dashed p-8 text-center ${dragging ? "border-primary bg-primary/5" : "border-border-slate"}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
          <FileText className="mx-auto mb-3 h-12 w-12 text-primary" /><p className="font-semibold text-heading-navy">{file?.name ?? "Drop a PDF here"}</p><p className="mt-1 text-sm text-on-surface-variant">PDF only, up to 10 MB</p>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onInput} />
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 min-h-11 rounded-lg bg-primary px-6 py-2.5 font-medium text-on-primary">Select PDF</button>
        </div>
        {file && <label className="mt-5 flex items-start gap-3 rounded-lg bg-primary/5 p-4 text-sm text-heading-navy"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4" /><span>I consent to sending this full PDF to Gemini for this summary. ToolsNest will request deletion immediately afterward.</span></label>}
        <button type="button" onClick={summarize} disabled={!file || !consent || processing} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-heading-navy px-6 py-2.5 font-semibold text-white disabled:opacity-50">{processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}{processing ? "Summarizing…" : "Summarize PDF"}</button>
        {error && <p className="mt-4 text-sm font-medium text-error" role="alert">{error}</p>}
        {summary && <section className="mt-6 rounded-xl bg-surface-container-low p-6" aria-live="polite"><h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-heading-navy"><Check className="h-5 w-5 text-success-teal" /> Summary</h2><div className="whitespace-pre-wrap leading-7 text-heading-navy">{summary}</div><button type="button" onClick={() => navigator.clipboard.writeText(summary)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-slate px-4 py-2"><Copy className="h-4 w-4" /> Copy</button></section>}
      </div>
    </div></div>
  );
};
