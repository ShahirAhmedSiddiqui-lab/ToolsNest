import { useState } from "react";
import { Type, ArrowLeft, Copy, CheckCircle2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const CaseConverter = () => {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const convertCase = (type: string) => {
    if (!input) return;
    
    let result = input;
    
    switch (type) {
      case "upper":
        result = input.toUpperCase();
        break;
      case "lower":
        result = input.toLowerCase();
        break;
      case "title":
        result = input.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        break;
      case "sentence":
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, s => s.toUpperCase());
        break;
      case "camel":
        result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case "snake":
        result = input.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('_') || input;
        break;
      case "kebab":
        result = input.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('-') || input;
        break;
    }
    
    setInput(result);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col">
        {/* Header */}
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <Type className="w-6 h-6" />
            </div>
            Case Converter
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Quickly change the casing of your text. Convert to UPPERCASE, lowercase, camelCase, snake_case, and more.
          </p>
        </div>

        {/* Workspace */}
        <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm relative min-h-[400px]">
          
          {/* Toolbar */}
          <div className="bg-surface-container-low border-b border-border-slate px-4 py-3 flex flex-wrap gap-2 items-center">
            <button onClick={() => convertCase("sentence")} className="text-xs font-medium text-heading-navy bg-surface px-3 py-1.5 rounded border border-border-slate hover:bg-surface-container transition-colors">Sentence case</button>
            <button onClick={() => convertCase("lower")} className="text-xs font-medium text-heading-navy bg-surface px-3 py-1.5 rounded border border-border-slate hover:bg-surface-container transition-colors">lower case</button>
            <button onClick={() => convertCase("upper")} className="text-xs font-medium text-heading-navy bg-surface px-3 py-1.5 rounded border border-border-slate hover:bg-surface-container transition-colors">UPPER CASE</button>
            <button onClick={() => convertCase("title")} className="text-xs font-medium text-heading-navy bg-surface px-3 py-1.5 rounded border border-border-slate hover:bg-surface-container transition-colors">Title Case</button>
            <div className="w-px h-6 bg-border-slate mx-1"></div>
            <button onClick={() => convertCase("camel")} className="text-xs font-medium text-heading-navy bg-surface px-3 py-1.5 rounded border border-border-slate hover:bg-surface-container transition-colors">camelCase</button>
            <button onClick={() => convertCase("snake")} className="text-xs font-medium text-heading-navy bg-surface px-3 py-1.5 rounded border border-border-slate hover:bg-surface-container transition-colors">snake_case</button>
            <button onClick={() => convertCase("kebab")} className="text-xs font-medium text-heading-navy bg-surface px-3 py-1.5 rounded border border-border-slate hover:bg-surface-container transition-colors">kebab-case</button>
            
            <div className="ml-auto flex gap-2">
              <button 
                onClick={handleCopy}
                className="text-xs font-medium text-on-primary bg-primary px-3 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
              >
                {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button 
                onClick={() => setInput("")}
                className="text-xs font-medium text-error hover:bg-error/10 px-2.5 py-1.5 rounded transition-colors flex items-center"
                title="Clear content"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Input Panel */}
          <textarea
            className="flex-1 w-full p-6 resize-none bg-transparent text-base leading-relaxed text-heading-navy outline-none placeholder:text-outline-variant"
            placeholder="Type or paste your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
          
          {/* Status bar */}
          <div className="bg-surface border-t border-border-slate px-4 py-2 flex gap-6 text-xs font-medium text-outline">
            <span>Characters: {input.length}</span>
            <span>Words: {input.trim() ? input.trim().split(/\s+/).length : 0}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
