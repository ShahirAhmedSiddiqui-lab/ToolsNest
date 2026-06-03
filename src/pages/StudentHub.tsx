import { Quote, AlignLeft, Calculator, ShieldAlert, FileText, MoreVertical, ArrowRight, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const StudentHub = () => {
  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-[1440px] mx-auto"><Breadcrumbs /></div>
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-2">Student Hub</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Your secure environment for academic processing. Tools are optimized for speed, accuracy, and absolute data privacy.
        </p>
      </div>

      {/* Academic Tools Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
        {/* Citation Generator (Featured) */}
        <Link to="/student-tools/citation-generator" className="xl:col-span-2 bg-surface-container-lowest border border-border-slate rounded-xl p-6 lg:p-8 relative overflow-hidden group hover:shadow-md transition-shadow block">
          <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
          <div className="flex items-start justify-between relative z-10 mb-6">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">
              <Quote className="w-8 h-8" />
            </div>
            <span className="bg-surface-container-low text-heading-navy text-xs font-medium px-3 py-1 rounded-full border border-border-slate">
              Popular
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-heading-navy mb-2 relative z-10">Citation Generator</h3>
          <p className="text-base text-on-surface-variant mb-6 relative z-10 max-w-md">
            Instantly format sources in APA, MLA, Chicago, and IEEE. Local processing ensures your research data never leaves your device.
          </p>
          <div className="bg-primary text-on-primary font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 relative z-10">
            Start Citing
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Word Counter */}
        <Link to="/student-tools/word-counter" className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="bg-secondary/10 w-12 h-12 flex items-center justify-center rounded-lg text-secondary mb-4">
            <AlignLeft className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-heading-navy mb-2">Word & Character Counter</h3>
          <p className="text-sm text-on-surface-variant mb-6 flex-1">
            Analyze document density, reading time, and keyword frequency instantly.
          </p>
          <div className="w-full bg-surface-container-low rounded-lg p-3 border border-border-slate flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors">
            <span className="font-mono text-sm text-primary font-medium">Open Tool</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        </Link>

        {/* GPA Calculator */}
        <Link to="/student-tools/cgpa-calculator" className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="bg-tertiary/10 w-12 h-12 flex items-center justify-center rounded-lg text-tertiary mb-4">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-heading-navy mb-2">CGPA Calculator</h3>
          <p className="text-sm text-on-surface-variant mb-6 flex-1">
            Project final grades and track academic standing securely.
          </p>
          <div className="w-full bg-surface-container text-primary flex justify-center items-center font-medium py-2 rounded-lg hover:bg-surface-container-highest transition-colors">
            Calculate Now
          </div>
        </Link>

        {/* Quiz Generator */}
        <Link to="/student-tools/quiz-generator" className="md:col-span-2 xl:col-span-1 bg-surface border border-border-slate rounded-xl p-6 relative flex flex-col justify-center items-center text-center group hover:bg-surface-container-lowest transition-colors">
          <div className="bg-primary/5 border border-primary/20 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm relative z-10">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-heading-navy mb-2 relative z-10">Quiz Generator from Notes</h3>
          <p className="text-sm text-on-surface-variant mb-4 relative z-10">
            AI-powered quiz generation from your study materials.
          </p>
        </Link>
      </div>

      {/* Document Management / Study Sessions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-heading-navy">Recent Study Sessions</h2>
          <button className="text-primary hover:text-primary-container font-medium flex items-center gap-1 transition-colors text-sm">
            View All Archive <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border-slate bg-surface-container-lowest text-on-surface-variant font-medium text-xs uppercase tracking-wider">
            <div className="col-span-6 md:col-span-5">Document Name</div>
            <div className="col-span-3 hidden md:block">Tool Used</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 md:col-span-1 text-right">Action</div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-border-slate">
            {/* Row 1 */}
            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-container-low transition-colors">
              <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                <div className="bg-error/10 text-error p-2 rounded flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-heading-navy truncate">Thesis_Draft_v4_Final.pdf</p>
                  <p className="font-mono text-xs text-on-surface-variant">2.4 MB • Today, 10:42 AM</p>
                </div>
              </div>
              <div className="col-span-3 hidden md:flex items-center text-on-surface-variant text-sm">
                Citation Gen
              </div>
              <div className="col-span-3 flex items-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-teal/10 text-success-teal border border-success-teal/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-teal"></span>
                  Complete
                </span>
              </div>
              <div className="col-span-3 md:col-span-1 flex justify-end">
                <button className="text-on-surface-variant hover:text-heading-navy transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-container-low transition-colors">
              <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-heading-navy truncate">History_101_Essay_Prompt.docx</p>
                  <p className="font-mono text-xs text-on-surface-variant">15 KB • Yesterday, 4:15 PM</p>
                </div>
              </div>
              <div className="col-span-3 hidden md:flex items-center text-on-surface-variant text-sm">
                Word Counter
              </div>
              <div className="col-span-3 flex items-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-teal/10 text-success-teal border border-success-teal/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-teal"></span>
                  Complete
                </span>
              </div>
              <div className="col-span-3 md:col-span-1 flex justify-end">
                <button className="text-on-surface-variant hover:text-heading-navy transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
