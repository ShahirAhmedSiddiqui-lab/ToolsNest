import { useState } from "react";
import { UploadCloud, FileText, ArrowRight, ShieldAlert, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const PDFSummarizer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSummary("This is an AI-generated summary of the uploaded document. It efficiently condenses the primary arguments, extracts key metrics, and outlines the conclusions in a streamlined format. The document discusses advanced secure utility processing and emphasizes privacy-first infrastructure design.");
    }, 2500);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        
        <Breadcrumbs />
        
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary inline-flex mb-6">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-4">AI PDF Summarizer</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Extract key insights, executive summaries, and action items from dense documents instantly.
          </p>
        </div>

        {!summary && !isProcessing && (
          <div 
            className={cn(
              "w-full bg-surface-container-lowest border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-border-slate hover:border-primary/50"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleSimulateUpload(); }}
            onClick={handleSimulateUpload}
          >
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-heading-navy mb-2">Upload document to summarize</h3>
            <p className="text-on-surface-variant mb-8">Supports PDF, DOCX, TXT up to 20MB</p>
            
            <button className="bg-primary text-on-primary text-lg font-medium px-8 py-4 rounded-xl shadow-md hover:bg-primary-container transition-all hover:-translate-y-0.5 active:translate-y-0">
              Browse Files
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="w-full bg-surface-container-lowest border border-border-slate rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <h3 className="text-xl font-semibold text-heading-navy mb-2">Analyzing Document...</h3>
            <p className="text-on-surface-variant">Our AI is reading and extracting key points.</p>
          </div>
        )}

        {summary && !isProcessing && (
          <div className="w-full bg-surface-container-lowest border border-border-slate rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-slate">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-heading-navy">Executive Summary</h3>
                <p className="text-sm text-on-surface-variant">Generated in 2.5s</p>
              </div>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-heading-navy leading-relaxed text-lg">
                {summary}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border-slate flex justify-end gap-4">
              <button onClick={() => setSummary(null)} className="text-sm font-medium text-on-surface-variant hover:text-heading-navy px-4 py-2 border border-border-slate rounded-lg hover:bg-surface-container-low transition-colors">
                Summarize Another
              </button>
              <button className="text-sm font-medium text-on-primary bg-primary px-6 py-2 rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
