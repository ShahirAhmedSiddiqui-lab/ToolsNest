import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { FileText, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { AIResultCard } from "../components/AIResultCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { extractPdfForAI, requestAI } from "../services/gemini";
import { useAIHealth } from "../hooks/useAIHealth";

export const PDFSummarizer = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const { aiReady, aiMessage } = useAIHealth();

  const select = (next?: File) => {
    if (!next) return;
    if (next.type !== "application/pdf" || next.size > 10 * 1024 * 1024) {
      setError("Choose a PDF no larger than 10 MB.");
      return;
    }
    setFile(next);
    setSummary("");
    setError("");
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => select(event.target.files?.[0]);

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    select(event.dataTransfer.files[0]);
  };

  const summarize = async () => {
    if (!file) return;
    if (!aiReady) {
      setError(aiMessage);
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const extracted = await extractPdfForAI(file);
      setSummary(await requestAI("summary", { text: extracted.summaryText, maxLength: 300 }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not summarize this PDF.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        <header className="mb-8 text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-heading-navy">AI PDF Summarizer</h1>
          <p className="mt-3 text-on-surface-variant">
            Your PDF is parsed locally in the browser. Only extracted text is sent to the AI service for summarization.
          </p>
        </header>

        <div className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6 md:p-8">
          <div
            className={`rounded-xl border-2 border-dashed p-8 text-center ${dragging ? "border-primary bg-primary/5" : "border-border-slate"}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <FileText className="mx-auto mb-3 h-12 w-12 text-primary" />
            <p className="font-semibold text-heading-navy">{file?.name ?? "Drop a PDF here"}</p>
            <p className="mt-1 text-sm text-on-surface-variant">PDF only, up to 10 MB</p>
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onInput} />
            <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 min-h-11 rounded-lg bg-primary px-6 py-2.5 font-medium text-on-primary">
              Select PDF
            </button>
          </div>

          {file && <div className="mt-5 rounded-lg bg-primary/5 p-4 text-sm text-heading-navy">Text is extracted locally first. Scanned image-only PDFs may return limited results.</div>}
          {!aiReady && aiMessage && <div className="mt-5 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">{aiMessage}</div>}

          <button type="button" onClick={summarize} disabled={!file || processing || !aiReady} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-heading-navy px-6 py-2.5 font-semibold text-white disabled:opacity-50">
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {processing ? "Summarizing..." : "Summarize PDF"}
          </button>

          {error && <p className="mt-4 text-sm font-medium text-error" role="alert">{error}</p>}

          <div className="mt-6">
            <AIResultCard
              title="Summary"
              content={summary}
              placeholder="Your summary will appear here once the PDF text is extracted and processed."
              exportFileName="pdf-summary.txt"
              className="min-h-[280px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
