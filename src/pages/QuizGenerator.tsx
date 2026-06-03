import { useState } from "react";
import { Brain, Play, Copy, CheckCircle2, Trash2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const QuizGenerator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setOutput("This is a simulated AI response for: " + input.substring(0, 20) + "...");
      setIsProcessing(false);
    }, 1500);
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
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full h-full flex flex-col">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <Brain className="w-6 h-6" />
            </div>
            Quiz Generator
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Generate a quiz from your notes.
          </p>
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
              placeholder="Paste your study notes here..."
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
                <Play className="w-3 h-3" /> {isProcessing ? "Processing..." : "Generate Quiz"}
              </button>
            </div>
            <div className="relative flex-1 flex flex-col">
              <textarea
                className="flex-1 w-full p-4 resize-none bg-transparent text-base text-heading-navy outline-none"
                value={output}
                readOnly
                placeholder="Generated quiz questions will appear here..."
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
