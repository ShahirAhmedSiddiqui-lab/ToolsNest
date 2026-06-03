import { useState } from "react";
import { FileJson, ArrowLeft, Copy, CheckCircle2, Play, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const JSONFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    if (!input.trim()) {
      setError("Please paste some JSON to format.");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON input");
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) {
      setError("Please paste some JSON to format.");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON input");
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
    setError(null);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full h-full flex flex-col">
        {/* Header */}
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <FileJson className="w-6 h-6" />
            </div>
            JSON Formatter & Validator
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Beautify, validate, and minify your JSON data instantly and securely in your browser.
          </p>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[500px]">
          {/* Input Panel */}
          <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm">
            <div className="bg-surface-container-low border-b border-border-slate px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-heading-navy">Input</span>
              <button 
                onClick={handleClear}
                className="text-xs font-medium text-error hover:bg-error/10 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <textarea
              className="flex-1 w-full p-4 resize-none bg-transparent font-mono text-sm text-heading-navy outline-none placeholder:text-outline-variant"
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm relative">
            <div className="bg-surface-container-low border-b border-border-slate px-4 py-3 flex justify-between items-center whitespace-nowrap overflow-x-auto gap-4">
              <span className="text-sm font-semibold text-heading-navy mr-auto">Output</span>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={minifyJSON}
                  className="text-xs font-medium text-heading-navy bg-surface px-3 py-1.5 rounded border border-border-slate hover:bg-surface-container transition-colors"
                >
                  Minify
                </button>
                <button 
                  onClick={formatJSON}
                  className="text-xs font-medium text-on-primary bg-primary px-3 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
                >
                  <Play className="w-3 h-3" /> Format
                </button>
              </div>
            </div>
            <div className="relative flex-1 flex flex-col">
              {error ? (
                <div className="absolute inset-0 bg-error/5 p-4 overflow-y-auto">
                  <div className="text-error font-medium flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠️</span> 
                    <span className="font-mono text-sm break-all">{error}</span>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    className="flex-1 w-full p-4 resize-none bg-transparent font-mono text-sm text-heading-navy outline-none"
                    value={output}
                    readOnly
                    placeholder="Result will appear here..."
                    spellCheck={false}
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
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
