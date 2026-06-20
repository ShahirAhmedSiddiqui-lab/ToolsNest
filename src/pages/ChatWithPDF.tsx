import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FileText, Loader2, MessageSquare, Send, Trash2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { deleteAIFile, GeminiFile, requestAI, uploadAIFile } from "../services/gemini";

type Message = { role: "user" | "assistant"; text: string };

export const ChatWithPDF = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const remoteRef = useRef<GeminiFile | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [remote, setRemote] = useState<GeminiFile | null>(null);
  const [consent, setConsent] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { remoteRef.current = remote; }, [remote]);
  useEffect(() => () => { if (remoteRef.current) void deleteAIFile(remoteRef.current); }, []);

  const select = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (!next) return;
    if (next.type !== "application/pdf" || next.size > 10 * 1024 * 1024) { setError("Choose a PDF no larger than 10 MB."); return; }
    setFile(next); setConsent(false); setError(""); setMessages([]);
  };

  const start = async () => {
    if (!file || !consent) return;
    setProcessing(true); setError("");
    try { const uploaded = await uploadAIFile(file); setRemote(uploaded); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not upload this PDF."); }
    finally { setProcessing(false); }
  };

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const text = question.trim();
    if (!remote || !text || processing) return;
    setQuestion(""); setMessages((current) => [...current, { role: "user", text }]); setProcessing(true); setError("");
    try { const answer = await requestAI("document-chat", { question: text }, remote); setMessages((current) => [...current, { role: "assistant", text: answer }]); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not answer that question."); }
    finally { setProcessing(false); }
  };

  const remove = async () => {
    if (remote) await deleteAIFile(remote);
    setRemote(null); setFile(null); setConsent(false); setMessages([]); setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12"><div className="max-w-4xl mx-auto"><Breadcrumbs />
    <header className="mb-8 text-center"><MessageSquare className="mx-auto mb-4 h-10 w-10 text-primary" /><h1 className="text-3xl font-bold text-heading-navy">Chat with PDF</h1><p className="mt-3 text-on-surface-variant">The PDF is sent directly to Gemini and deleted when you end the session.</p></header>
    <div className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6 md:p-8">
      {!remote ? <>
        <div className="rounded-xl border-2 border-dashed border-border-slate p-8 text-center"><FileText className="mx-auto mb-3 h-12 w-12 text-primary" /><p className="font-semibold text-heading-navy">{file?.name ?? "Select a PDF to begin"}</p><input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={select} /><button type="button" onClick={() => inputRef.current?.click()} className="mt-5 min-h-11 rounded-lg bg-primary px-6 py-2.5 font-medium text-on-primary">Select PDF</button></div>
        {file && <label className="mt-5 flex gap-3 rounded-lg bg-primary/5 p-4 text-sm"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" /><span>I consent to uploading this full PDF to Gemini for this chat session.</span></label>}
        {file && <button type="button" onClick={start} disabled={!consent || processing} className="mt-5 min-h-11 rounded-lg bg-heading-navy px-6 py-2.5 font-semibold text-white disabled:opacity-50">{processing ? "Uploading…" : "Start chat"}</button>}
      </> : <>
        <div className="mb-5 flex items-center justify-between gap-4 rounded-lg bg-surface-container-low p-4"><div><p className="font-semibold text-heading-navy">{file?.name}</p><p className="text-xs text-on-surface-variant">Active Gemini document session</p></div><button type="button" onClick={remove} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-error hover:bg-error/10"><Trash2 className="h-4 w-4" /> End session</button></div>
        <div className="min-h-64 space-y-4 rounded-xl border border-border-slate p-4" aria-live="polite">{messages.length === 0 && <p className="py-16 text-center text-on-surface-variant">Ask your first question about the document.</p>}{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[85%] whitespace-pre-wrap rounded-xl p-4 ${message.role === "user" ? "ml-auto bg-primary text-on-primary" : "bg-surface-container-low text-heading-navy"}`}>{message.text}</div>)}</div>
        <form onSubmit={send} className="mt-4 flex gap-3"><label className="flex-1"><span className="sr-only">Question about this PDF</span><input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={4000} className="min-h-12 w-full rounded-lg border border-border-slate px-4" placeholder="Ask about the document…" /></label><button type="submit" disabled={!question.trim() || processing} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 text-on-primary disabled:opacity-50">{processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send</button></form>
      </>}
      {error && <p className="mt-4 text-sm font-medium text-error" role="alert">{error}</p>}
    </div>
  </div></div>;
};
