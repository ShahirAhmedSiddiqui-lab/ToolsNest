import { useState } from "react";
import type { FormEvent } from "react";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const ResumeBuilder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setResult("Successfully generated! This is a placeholder result.");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col">
        <Breadcrumbs />
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <Briefcase className="w-6 h-6" />
            </div>
            Resume Builder
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Create professional resumes with AI assistance.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-border-slate rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-border-slate">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-heading-navy">Full Name</label><input type="text" className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-base text-heading-navy outline-none focus:border-primary transition-colors" placeholder="Enter full name..." required /></div><div className="flex flex-col gap-2"><label className="text-sm font-semibold text-heading-navy">Target Job Title</label><input type="text" className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-base text-heading-navy outline-none focus:border-primary transition-colors" placeholder="Enter target job title..." required /></div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="mt-2 bg-primary text-on-primary text-lg font-medium px-8 py-3.5 rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? "Processing..." : "Generate Resume"}
              </button>
            </form>
          </div>

          {/* Result Area */}
          {result && (
            <div className="p-6 md:p-8 bg-surface-container-low flex flex-col items-center justify-center text-center min-h-[200px]">
              <div className="w-16 h-16 bg-success-teal/20 rounded-full flex items-center justify-center mb-4 text-success-teal">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-heading-navy mb-2">Success!</h3>
              <p className="text-on-surface-variant max-w-md">{result}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
