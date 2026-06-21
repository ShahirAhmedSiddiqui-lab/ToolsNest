import { ChangeEvent, FormEvent, useState } from "react";
import { CheckCircle2, Copy, Download, FileText, Loader2, MessageSquare, Send, Trash2 } from "lucide-react";
import { AIResultBody } from "../components/AIResultCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { buildChatTranscript, exportAIOutput } from "../lib/aiOutput";
import { buildPdfQuestionContext, extractPdfForAI, ExtractedPdfDocument, requestAI } from "../services/gemini";
import { useAIHealth } from "../hooks/useAIHealth";

type Message = { role: "user" | "assistant"; text: string };

export const ChatWithPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDocument, setPdfDocument] = useState<ExtractedPdfDocument | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { aiReady, aiMessage } = useAIHealth();

  const select = async (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (!next) return;
    if (next.type !== "application/pdf" || next.size > 10 * 1024 * 1024) {
      setError("Choose a PDF no larger than 10 MB.");
      return;
    }

    setProcessing(true);
    setError("");
    setMessages([]);
    setQuestion("");
    setFile(next);

    try {
      setPdfDocument(await extractPdfForAI(next));
    } catch (caught) {
      setPdfDocument(null);
      setError(caught instanceof Error ? caught.message : "Could not read this PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const text = question.trim();
    if (!pdfDocument || !text || processing) return;
    if (!aiReady) {
      setError(aiMessage);
      return;
    }

    setQuestion("");
    setMessages((current) => [...current, { role: "user", text }]);
    setProcessing(true);
    setError("");

    try {
      const answer = await requestAI("document-chat", {
        question: text,
        text: buildPdfQuestionContext(pdfDocument, text),
      });
      setMessages((current) => [...current, { role: "assistant", text: answer }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not answer that question.");
    } finally {
      setProcessing(false);
    }
  };

  const remove = () => {
    setPdfDocument(null);
    setFile(null);
    setMessages([]);
    setQuestion("");
    setError("");
  };

  const transcript = buildChatTranscript(messages);

  const copyTranscript = async () => {
    if (!transcript) return;
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    globalThis.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        <header className="mb-8 text-center">
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-heading-navy">Chat with PDF</h1>
          <p className="mt-3 text-on-surface-variant">Your PDF is parsed locally. Each question sends only relevant extracted text snippets to the AI service.</p>
        </header>
        <div className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6 md:p-8">
          {!pdfDocument ? (
            <>
              <div className="rounded-xl border-2 border-dashed border-border-slate p-8 text-center">
                <FileText className="mx-auto mb-3 h-12 w-12 text-primary" />
                <p className="font-semibold text-heading-navy">{file?.name ?? "Select a PDF to begin"}</p>
                <p className="mt-1 text-sm text-on-surface-variant">PDF only, up to 10 MB</p>
                <input type="file" accept="application/pdf,.pdf" className="hidden" id="pdf-chat-upload" onChange={select} />
                <button type="button" onClick={() => globalThis.document.getElementById("pdf-chat-upload")?.click()} className="mt-5 min-h-11 rounded-lg bg-primary px-6 py-2.5 font-medium text-on-primary">
                  {processing ? "Reading PDF..." : "Select PDF"}
                </button>
              </div>
              {file && !processing && <div className="mt-5 rounded-lg bg-primary/5 p-4 text-sm text-heading-navy">PDF text extraction happens locally in your browser. Scanned PDFs may have limited chat accuracy.</div>}
              {!aiReady && aiMessage && <div className="mt-5 rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">{aiMessage}</div>}
            </>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-4 rounded-lg bg-surface-container-low p-4">
                <div>
                  <p className="font-semibold text-heading-navy">{file?.name}</p>
                  <p className="text-xs text-on-surface-variant">{pdfDocument.pageCount} pages parsed locally for chat</p>
                </div>
                <button type="button" onClick={remove} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-error hover:bg-error/10">
                  <Trash2 className="h-4 w-4" /> Remove PDF
                </button>
              </div>
              <div className="rounded-xl border border-border-slate bg-linear-to-br from-white via-surface-container-lowest to-surface-container p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border-slate/80 pb-4">
                  <div>
                    <h2 className="text-base font-semibold text-heading-navy">Conversation</h2>
                    <p className="text-xs text-on-surface-variant">Relevant snippets are sent per question, and you can export the transcript anytime.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={copyTranscript} disabled={!transcript} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border-slate bg-white px-3 py-2 text-sm font-medium text-heading-navy transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
                      {copied ? <CheckCircle2 className="h-4 w-4 text-success-teal" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button type="button" onClick={() => exportAIOutput("pdf-chat-transcript.txt", transcript)} disabled={!transcript} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-heading-navy px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>
                <div className="min-h-64 space-y-4" aria-live="polite">
                {messages.length === 0 && <p className="py-16 text-center text-on-surface-variant">Ask your first question about the document.</p>}
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`max-w-[85%] rounded-xl p-4 ${message.role === "user" ? "ml-auto bg-primary text-on-primary" : "border border-border-slate bg-white text-heading-navy shadow-sm"}`}>
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <AIResultBody content={message.text} />
                    )}
                  </div>
                ))}
              </div>
              </div>
              <form onSubmit={send} className="mt-4 flex gap-3">
                <label className="flex-1">
                  <span className="sr-only">Question about this PDF</span>
                  <input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={4000} className="min-h-12 w-full rounded-lg border border-border-slate px-4" placeholder="Ask about the document..." />
                </label>
                <button type="submit" disabled={!question.trim() || processing || !aiReady} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 text-on-primary disabled:opacity-50">
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
                </button>
              </form>
            </>
          )}
          {error && <p className="mt-4 text-sm font-medium text-error" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
};
