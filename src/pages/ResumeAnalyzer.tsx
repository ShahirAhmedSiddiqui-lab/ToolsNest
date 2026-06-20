import { ChangeEvent, useRef, useState } from "react";
import { Copy, FileSearch, Loader2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { deleteAIFile, requestAI, uploadAIFile } from "../services/gemini";

export const ResumeAnalyzer = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [consent, setConsent] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const select = async (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0]; if (!next) return;
    if (!["application/pdf", "text/plain"].includes(next.type) || next.size > 10 * 1024 * 1024) { setError("Choose a PDF or plain-text resume no larger than 10 MB."); return; }
    setFile(next); setText(next.type === "text/plain" ? await next.text() : ""); setConsent(false); setError(""); setAnalysis("");
  };

  const analyze = async () => {
    if ((!file && !text.trim()) || !consent) return;
    setProcessing(true); setError(""); let remote;
    try {
      if (file?.type === "application/pdf") remote = await uploadAIFile(file);
      setAnalysis(await requestAI("resume-analysis", { text: remote ? "" : text, jobDescription }, remote));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Resume analysis failed."); }
    finally { if (remote) await deleteAIFile(remote); setProcessing(false); }
  };

  return <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12"><div className="max-w-5xl mx-auto"><Breadcrumbs />
    <header className="mb-8"><h1 className="flex items-center gap-3 text-3xl font-bold text-heading-navy"><FileSearch className="h-8 w-8 text-primary" /> Resume Analyzer</h1><p className="mt-2 text-on-surface-variant">Get focused ATS and job-match feedback through Gemini.</p></header>
    <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6">
      <label className="text-sm font-semibold text-heading-navy">Resume text<textarea value={text} onChange={(event) => { setText(event.target.value); setFile(null); }} maxLength={25000} rows={12} className="mt-2 w-full resize-y rounded-lg border border-border-slate p-4" placeholder="Paste resume text, or upload a PDF…" /></label>
      <input ref={inputRef} type="file" accept="application/pdf,text/plain,.pdf,.txt" className="hidden" onChange={select} /><button type="button" onClick={() => inputRef.current?.click()} className="mt-3 min-h-11 rounded-lg border border-border-slate px-4 font-medium">Upload PDF or TXT</button>{file && <p className="mt-2 text-sm text-primary">Selected: {file.name}</p>}
      <label className="mt-5 block text-sm font-semibold text-heading-navy">Job description (optional)<textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} maxLength={15000} rows={6} className="mt-2 w-full resize-y rounded-lg border border-border-slate p-4" /></label>
      <label className="mt-4 flex items-start gap-3 rounded-lg bg-primary/5 p-4 text-sm"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" /><span>I consent to sending this resume content to Gemini. Uploaded files are deleted after analysis.</span></label>
      <button type="button" onClick={analyze} disabled={processing || !consent || (!file && !text.trim())} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-6 font-semibold text-on-primary disabled:opacity-50">{processing && <Loader2 className="h-4 w-4 animate-spin" />}{processing ? "Analyzing…" : "Analyze resume"}</button>{error && <p className="mt-3 text-sm font-medium text-error" role="alert">{error}</p>}
    </section><section className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-heading-navy">Analysis</h2>{analysis && <button type="button" onClick={() => navigator.clipboard.writeText(analysis)} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3"><Copy className="h-4 w-4" /> Copy</button>}</div><div className="whitespace-pre-wrap leading-7 text-heading-navy" aria-live="polite">{analysis || <span className="text-on-surface-variant">Your analysis will appear here.</span>}</div></section></div>
  </div></div>;
};
