import { ShieldAlert, FileOutput, FileInput, Minimize, Layers, Split, Lock, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const PDFSuite = () => {
  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      {/* Header Section */}
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-heading-navy mb-2">PDF Suite</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Professional PDF manipulation tools. Process documents securely directly in your browser without uploading to external servers.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-success-teal/10 px-4 py-2 rounded-full border border-success-teal/20 w-fit">
            <ShieldAlert className="w-5 h-5 text-success-teal" />
            <span className="text-sm font-medium text-success-teal">End-to-End Secure</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Featured Tool */}
        <div className="md:col-span-12 xl:col-span-8 bg-surface-container-lowest border border-border-slate rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="flex-1">
            <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg text-primary mb-4">
              <FileOutput className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-heading-navy mb-2">PDF to Word Converter</h2>
            <p className="text-base text-on-surface-variant mb-6">
              Convert your PDF documents into editable Word files with high accuracy. Formatting, tables, and images are preserved.
            </p>
            <Link to="/pdf-tools/pdf-to-word" className="text-sm font-medium text-on-primary bg-primary px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm inline-flex items-center gap-2">
              Try Converter <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden md:flex w-64 h-48 bg-surface-container rounded-xl items-center justify-center border border-border-slate/50 shadow-inner p-4 relative group-hover:scale-105 transition-transform duration-500">
            {/* Abstract representation of conversion */}
            <div className="flex items-center gap-4">
              <div className="bg-error/10 p-3 rounded text-error border border-error/20"><FileText className="w-8 h-8" /></div>
              <ArrowRight className="w-6 h-6 text-on-surface-variant animate-pulse" />
              <div className="bg-link-blue/10 p-3 rounded text-link-blue border border-link-blue/20"><FileOutput className="w-8 h-8" /></div>
            </div>
          </div>
        </div>

        {/* Tool Cards */}
        {[
          { title: "Word to PDF", desc: "Convert Word documents to secure PDF files.", icon: FileInput, tags: ["Popular"], href: "/pdf-tools/word-to-pdf" },
          { title: "Compress PDF", desc: "Reduce file size while maintaining quality.", icon: Minimize, tags: ["Optimization"], href: "/pdf-tools/compress-pdf" },
          { title: "Merge PDF", desc: "Combine multiple PDFs into a single document.", icon: Layers, tags: ["Utility"], href: "/pdf-tools/merge-pdf" },
          { title: "Split PDF", desc: "Extract pages or separate PDFs into multiple files.", icon: Split, tags: ["Utility"], href: "/pdf-tools/split-pdf" },
          { title: "JPG to PDF", desc: "Convert images to PDF documents quickly.", icon: FileInput, tags: ["Utility"], href: "/pdf-tools/jpg-to-pdf" },
          { title: "PDF to JPG", desc: "Convert PDF pages into high-quality JPG images.", icon: FileOutput, tags: ["Utility"], href: "/pdf-tools/pdf-to-jpg" },
          { title: "PDF to PPT", desc: "Convert PDFs to editable PowerPoint presentations.", icon: FileOutput, tags: ["Utility"], href: "/pdf-tools/pdf-to-ppt" },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <Link to={tool.href} key={tool.title} className="md:col-span-6 xl:col-span-4 bg-surface-container-lowest border border-border-slate rounded-xl p-6 hover:shadow-md transition-all cursor-pointer group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-heading-navy mb-2">{tool.title}</h3>
              <p className="text-base text-on-surface-variant mb-6">{tool.desc}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {tool.tags.map(tag => (
                  <span key={tag} className="bg-surface-container-low text-heading-navy text-xs font-medium px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
};
