import { useState } from "react";
import { CheckCircle, Play, Trash2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { AIResultCard } from "../components/AIResultCard";
import { aiErrorMessage, fixGrammar } from "../services/gemini";
import { useAIHealth } from "../hooks/useAIHealth";

export const GrammarFixer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const { aiReady, aiMessage } = useAIHealth();

  const handleProcess = async () => {
    if (!input.trim()) return;
    
    if (!aiReady) {
      setError(aiMessage);
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const correctedText = await fixGrammar(input);
      setOutput(correctedText);
    } catch (err) {
      setError(aiErrorMessage(err, "Failed to process text. Please try again."));
    } finally {
      setIsProcessing(false);
    }
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
              <CheckCircle className="w-6 h-6" />
            </div>
            Grammar Fixer
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Fix grammar and spelling mistakes instantly using AI.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}
        {!aiReady && aiMessage && !error && (
          <div className="mb-6 rounded-lg border border-border-slate bg-surface-container-low p-4">
            <p className="text-sm text-on-surface-variant">{aiMessage}</p>
          </div>
        )}

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
              placeholder="Paste your text with errors..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={25000}
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm relative">
            <div className="bg-surface-container-low border-b border-border-slate px-4 py-3 flex justify-between items-center whitespace-nowrap overflow-x-auto gap-4">
              <span className="text-sm font-semibold text-heading-navy mr-auto">Output</span>
              <button 
                onClick={handleProcess}
                disabled={isProcessing || !input.trim() || !aiReady}
                className="text-xs font-medium text-on-primary bg-primary px-3 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm disabled:opacity-50"
              >
                <Play className="w-3 h-3" /> {isProcessing ? "Processing..." : "Fix Grammar"}
              </button>
            </div>
            <div className="flex-1 p-4">
              <AIResultCard
                title="Corrected Text"
                content={output}
                placeholder="Corrected text will appear here in a polished reading layout."
                exportFileName="grammar-fixed-text.txt"
                className="min-h-full"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
