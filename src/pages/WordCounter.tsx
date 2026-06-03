import { useState } from "react";
import { Type, Trash2, Copy, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const WordCounter = () => {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const words = input.trim() ? input.trim().split(/\\s+/).length : 0;
  const characters = input.length;
  const charactersNoSpaces = input.replace(/\\s/g, "").length;
  const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = input.split(/\\n+/).filter(p => p.trim().length > 0).length;

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full h-full flex flex-col">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <Type className="w-6 h-6" />
            </div>
            Word Counter
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Count words, characters, sentences, and paragraphs in your text instantly.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-primary">{words}</span>
            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mt-1">Words</span>
          </div>
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-heading-navy">{characters}</span>
            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mt-1">Characters</span>
          </div>
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-heading-navy">{sentences}</span>
            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mt-1">Sentences</span>
          </div>
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-heading-navy">{paragraphs}</span>
            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mt-1">Paragraphs</span>
          </div>
          <div className="col-span-2 md:col-span-1 bg-surface-container-lowest border border-border-slate rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-heading-navy">{charactersNoSpaces}</span>
            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mt-1 text-center">Chars (No Space)</span>
          </div>
        </div>

        <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm relative min-h-[400px]">
          <div className="bg-surface-container-low border-b border-border-slate px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-heading-navy">Text</span>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={handleCopy}
                className="text-xs font-medium text-on-primary bg-primary px-3 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
              >
                {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => setInput("")} className="text-xs font-medium text-error hover:bg-error/10 px-2 py-1.5 rounded transition-colors flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
          <textarea
            className="flex-1 w-full p-6 resize-none bg-transparent text-base leading-relaxed text-heading-navy outline-none placeholder:text-outline-variant"
            placeholder="Type or paste your text here to count..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

      </div>
    </div>
  );
};