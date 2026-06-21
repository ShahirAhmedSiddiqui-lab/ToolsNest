import { useState } from "react";
import { FileText, Trash2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { AIResultCard } from "../components/AIResultCard";
import { aiErrorMessage, generateCoverLetter } from "../services/gemini";
import { useAIHealth } from "../hooks/useAIHealth";

export const CoverLetterGenerator = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [yourName, setYourName] = useState("");
  const [skills, setSkills] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const { aiReady, aiMessage } = useAIHealth();

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !companyName.trim() || !yourName.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!aiReady) {
      setError(aiMessage);
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const letter = await generateCoverLetter(
        jobTitle,
        companyName,
        yourName,
        skills
      );
      setCoverLetter(letter);
    } catch (err) {
      setError(aiErrorMessage(err, "Failed to generate cover letter. Please try again."));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setJobTitle("");
    setCompanyName("");
    setYourName("");
    setSkills("");
    setCoverLetter("");
    setError("");
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex flex-col">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <FileText className="w-6 h-6" />
            </div>
            Cover Letter Generator
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Write tailored cover letters instantly with AI assistance.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-heading-navy block mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-heading-navy block mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter the role title"
                    className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-heading-navy block mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter the company name"
                    className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-heading-navy block mb-2">Your Skills & Experience</label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="List your relevant skills and achievements..."
                  className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action & Output Section */}
          <div className="flex flex-col space-y-4">
            {/* Actions */}
            <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-4 space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isProcessing || !jobTitle.trim() || !companyName.trim() || !yourName.trim() || !aiReady}
                className="w-full bg-primary text-on-primary font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isProcessing ? "Generating..." : "Generate Letter"}
              </button>
              <button
                onClick={handleClear}
                className="w-full text-error hover:bg-error/10 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>

            {/* Cover Letter Output */}
            <AIResultCard
              title="Cover Letter"
              content={coverLetter}
              placeholder="Your tailored cover letter will appear here with cleaner formatting and export controls."
              exportFileName="cover-letter.txt"
              className="min-h-[360px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
