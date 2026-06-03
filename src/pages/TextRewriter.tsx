import { useState } from "react";
import { Type, Play, Copy, CheckCircle2, Trash2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { enhanceText, isGeminiAvailable } from "../services/gemini";

export const TextRewriter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [style, setStyle] = useState<"professional" | "casual" | "formal" | "creative">("professional");

  const handleProcess = async () => {
    if (!input.trim()) return;
    
    if (!isGeminiAvailable()) {
      setError("AI service is not configured. Please check your API key.");
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const rewrittenText = await enhanceText(input, style);
      setOutput(rewrittenText);
    } catch (err) {
      setError("Failed to rewrite text. Please try again.");
      console.error("Text Rewriter Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
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
            Text Rewriter
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Rewrite and improve your text instantly using AI. Choose a style to match your needs.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Style Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          <label className="text-sm font-semibold text-heading-navy">Writing Style:</label>
          {(["professional", "formal", "casual", "creative"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                style === s
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[500px]">
          {/* Input Panel */}
          <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm">
            <div className="bg-surface-container-low border-b border-border-slate px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-heading-navy">Input</span>
              <button onClick={handleClear} className="text-xs font-medium text-error hover:bg-error/10 px-2 py-1 rounded transition-colors flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <textarea
              className="flex-1 w-full p-4 resize-none bg-transparent text-base text-heading-navy outline-none placeholder:text-outline-variant"
              placeholder="Paste your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm relative">
            <div className="bg-surface-container-low border-b border-border-slate px-4 py-3 flex justify-between items-center whitespace-nowrap overflow-x-auto gap-4">
              <span className="text-sm font-semibold text-heading-navy mr-auto">Output</span>
              <button 
                onClick={handleProcess}
                disabled={isProcessing || !input.trim()}
                className="text-xs font-medium text-on-primary bg-primary px-3 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm disabled:opacity-50"
              >
                <Play className="w-3 h-3" /> {isProcessing ? "Processing..." : "Rewrite Text"}
              </button>
            </div>
            <div className="relative flex-1 flex flex-col">
              <textarea
                className="flex-1 w-full p-4 resize-none bg-transparent text-base text-heading-navy outline-none"
                value={output}
                readOnly
                placeholder="Rewritten text will appear here..."
              />
              {output && (
                <button 
                  onClick={handleCopy}
                  className="absolute top-4 right-4 bg-surface border border-border-slate shadow-sm text-heading-navy hover:text-primary transition-colors p-2 rounded-md flex items-center gap-2 group"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-success-teal" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                  <span className="text-xs font-medium sr-only md:not-sr-only md:block">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
