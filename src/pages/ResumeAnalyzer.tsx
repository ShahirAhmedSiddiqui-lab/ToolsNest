import { useState, useRef } from "react";
import type { DragEvent } from "react";
import { FileSearch, Upload, Trash2, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { analyzeResume, isGeminiAvailable } from "../services/gemini";

export const ResumeAnalyzer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("text/") && !file.name.endsWith(".pdf")) {
      setError("Please upload a text file or PDF");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setResumeText(e.target?.result as string);
      setError("");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please upload or paste your resume");
      return;
    }

    if (!isGeminiAvailable()) {
      setError("AI service is not configured. Please check your API key.");
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
      console.error("Resume Analysis Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResumeText("");
    setJobDescription("");
    setAnalysis("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex flex-col">
        <Breadcrumbs />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <FileSearch className="w-6 h-6" />
            </div>
            Resume Analyzer
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Get AI-powered feedback on your resume to improve your chances of getting hired.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Resume Upload */}
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden">
              <div className="bg-surface-container-low border-b border-border-slate px-4 py-3">
                <span className="text-sm font-semibold text-heading-navy">Resume</span>
              </div>
              {!resumeText ? (
                <div
                  className={`p-8 flex flex-col items-center justify-center text-center border-2 border-dashed transition-all cursor-pointer m-4 rounded-lg ${
                    isDragging ? "border-primary bg-primary/5" : "border-border-slate hover:border-primary/50"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm font-medium text-heading-navy">Upload resume or paste text</p>
                  <p className="text-xs text-on-surface-variant">Drag & Drop or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="text/*,.pdf"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-xs text-on-surface-variant mb-2">Resume loaded ({resumeText.length} chars)</p>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full h-32 bg-surface border border-border-slate rounded-lg p-3 text-sm text-heading-navy resize-none"
                  />
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden">
              <div className="bg-surface-container-low border-b border-border-slate px-4 py-3">
                <span className="text-sm font-semibold text-heading-navy">Job Description (Optional)</span>
              </div>
              <div className="p-4">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description to get targeted feedback..."
                  className="w-full h-32 bg-surface border border-border-slate rounded-lg p-3 text-sm text-heading-navy resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action & Output Section */}
          <div className="flex flex-col space-y-4">
            {/* Actions */}
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-4 space-y-3">
              <button
                onClick={handleAnalyze}
                disabled={isProcessing || !resumeText.trim()}
                className="w-full bg-primary text-on-primary font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isProcessing ? "Analyzing..." : "Analyze Resume"}
              </button>
              <button
                onClick={handleClear}
                className="w-full text-error hover:bg-error/10 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>

            {/* Analysis Output */}
            {analysis && (
              <div className="bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden flex flex-col">
                <div className="bg-surface-container-low border-b border-border-slate px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-heading-navy">Analysis</span>
                  <button
                    onClick={handleCopy}
                    className="text-heading-navy hover:text-primary transition-colors p-1.5 rounded"
                    title="Copy analysis"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-success-teal" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto max-h-96 p-4">
                  <div className="text-sm text-heading-navy whitespace-pre-wrap font-mono">
                    {analysis}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
