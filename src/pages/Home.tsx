import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShieldAlert, FileText, Image as ImageIcon, Brain, GraduationCap, Activity, Briefcase, Code } from "lucide-react";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchTerm.trim()) {
      navigate("/all-tools", { state: { searchQuery: searchTerm } });
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-start pt-6 md:pt-10 pb-12 md:pb-24">
      <div className="w-full max-w-4xl flex flex-col items-center gap-12">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-success-teal/10 text-success-teal px-3 py-1 rounded-full text-sm font-medium">
            <ShieldAlert className="w-4 h-4" />
            Fast & Secure
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading-navy tracking-tight">
            Your Secure Toolbox for Everything
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            A privacy-first suite of essential tools. Process documents, convert images, and utilize powerful AI utilities entirely within your browser.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-xl mt-4 relative bg-surface-container-lowest rounded-lg flex items-center p-1 border border-border-slate focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <div className="pl-4 text-outline flex items-center">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              className="w-full bg-transparent border-none focus:outline-none text-on-surface text-base px-3 py-3 placeholder:text-outline-variant" 
              placeholder="Find a tool..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button 
              type="button"
              onClick={() => handleSearch()}
              className="bg-primary-container text-on-primary font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
            >
              Search
            </button>
          </form>
          
          {/* Security Banner */}
          <div className="flex items-center justify-center gap-2 text-on-surface-variant text-sm mt-2 bg-surface-container-low px-4 py-2 rounded-lg border border-border-slate">
            <ShieldAlert className="w-4 h-4 text-primary" fill="currentColor" />
            100% Secure. Files are deleted immediately after processing.
          </div>
        </section>

        {/* Tool Grid */}
        <section className="w-full flex flex-wrap justify-center gap-6">
          {[
            { icon: FileText, title: "PDF Suite", desc: "Merge, split, compress, and convert PDF files securely in your browser.", href: "/pdf-tools" },
            { icon: ImageIcon, title: "Image Lab", desc: "Resize, crop, format conversion, and bulk image optimization tools.", href: "/image-tools" },
            { icon: Brain, title: "AI Writing", desc: "Grammar checks, summarizing, and structured text generation utilities.", href: "/ai-tools" },
            { icon: Code, title: "Dev Tools", desc: "JSON formatting, case converters, and developer utilities.", href: "/developer-tools" },
            { icon: GraduationCap, title: "Student Hub", desc: "Citation generators, word counters, and academic formatting aids.", href: "/student-tools" },
            { icon: Activity, title: "Health Calculators", desc: "BMI, macro trackers, and other essential wellness metrics.", href: "/calculators/health" },
            { icon: Briefcase, title: "Business Tools", desc: "Invoice generators, tax calculators, and financial utility suites.", href: "/business" },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.title} to={tool.href} className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all group w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] text-left shrink-0">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-fixed transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-heading-navy mb-2">{tool.title}</h3>
                  <p className="text-sm text-on-surface-variant">{tool.desc}</p>
                </div>
              </Link>
            )
          })}
        </section>
      </div>
    </div>
  );
};
