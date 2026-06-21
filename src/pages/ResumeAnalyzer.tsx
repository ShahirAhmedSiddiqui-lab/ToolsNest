import { ChangeEvent, useRef, useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";
import { AIResultCard } from "../components/AIResultCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { analyzeResume, extractPdfForAI } from "../services/gemini";
import { useAIHealth } from "../hooks/useAIHealth";

export const ResumeAnalyzer = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const { aiReady, aiMessage } = useAIHealth();

  const select = async (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (!next) return;
    if (!["application/pdf", "text/plain"].includes(next.type) || next.size > 10 * 1024 * 1024) {
      setError("Choose a PDF or plain-text resume no larger than 10 MB.");
      return;
    }

    setProcessing(true);
    setError("");
    setAnalysis("");
    setFile(next);

    try {
      if (next.type === "text/plain") {
        setText(await next.text());
      } else {
        const extracted = await extractPdfForAI(next);
        setText(extracted.summaryText);
      }
    } catch (caught) {
      setText("");
      setFile(null);
      setError(caught instanceof Error ? caught.message : "Could not read this resume.");
    } finally {
      setProcessing(false);
    }
  };

  const analyze = async () => {
    if (!text.trim()) return;
    if (!aiReady) {
      setError(aiMessage);
      return;
    }
    setProcessing(true);
    setError("");
    try {
      setAnalysis(await analyzeResume(text, jobDescription));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Resume analysis failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs />
        <header className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-heading-navy">
            <FileSearch className="h-8 w-8 text-primary" />
            Resume Analyzer
          </h1>
          <p className="mt-2 text-on-surface-variant">Get focused ATS and job-match feedback from locally extracted resume text.</p>
        </header>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6">
            <label className="text-sm font-semibold text-heading-navy">
              Resume text
              <textarea value={text} onChange={(event) => { setText(event.target.value); setFile(null); }} maxLength={25000} rows={12} className="mt-2 w-full resize-y rounded-lg border border-border-slate p-4" placeholder="Paste resume text, or upload a PDF or TXT..." />
            </label>
            <input ref={inputRef} type="file" accept="application/pdf,text/plain,.pdf,.txt" className="hidden" onChange={select} />
            <button type="button" onClick={() => inputRef.current?.click()} className="mt-3 min-h-11 rounded-lg border border-border-slate px-4 font-medium">
              {processing && file ? "Reading file..." : "Upload PDF or TXT"}
            </button>
            {file && <p className="mt-2 text-sm text-primary">Selected: {file.name}</p>}
            <label className="mt-5 block text-sm font-semibold text-heading-navy">
              Job description (optional)
              <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} maxLength={15000} rows={6} className="mt-2 w-full resize-y rounded-lg border border-border-slate p-4" />
            </label>
            <div className="mt-4 rounded-lg bg-primary/5 p-4 text-sm text-heading-navy">Only extracted text is sent to the AI service. Uploaded PDFs are parsed locally in your browser.</div>
            {!aiReady && aiMessage && <div className="mt-4 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">{aiMessage}</div>}
            <button type="button" onClick={analyze} disabled={processing || !text.trim() || !aiReady} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-6 font-semibold text-on-primary disabled:opacity-50">
              {processing && <Loader2 className="h-4 w-4 animate-spin" />}
              {processing ? "Analyzing..." : "Analyze resume"}
            </button>
            {error && <p className="mt-3 text-sm font-medium text-error" role="alert">{error}</p>}
          </section>
          <section className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6">
            <AIResultCard
              title="Analysis"
              content={analysis}
              placeholder="Your resume analysis will appear here with structured sections and export controls."
              exportFileName="resume-analysis.txt"
              className="min-h-[420px]"
            />
          </section>
        </div>
      </div>
    </div>
  );
};
