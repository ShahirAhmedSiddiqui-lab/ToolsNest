import { Sparkles, FileText, MessageSquare, Briefcase, FileSearch, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const AITools = () => {
  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      {/* Header Section */}
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-heading-navy mb-2 flex items-center gap-3">
              AI Tools Room
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
                <Sparkles className="w-5 h-5" />
              </div>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Advanced artificial intelligence models tailored for specific tasks. Enhance your workflow with intelligent document processing and text generation.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-border-slate w-fit">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-heading-navy">Secure API Hub</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tool Cards */}
        {[
          { 
            title: "PDF Summarizer", 
            desc: "Extract key points, abstracts, and summaries from lengthy PDF documents automatically.", 
            icon: FileText, 
            href: "/ai-tools/pdf-summarizer",
            tags: ["Document Processing", "Popular"] 
          },
          { 
            title: "Chat with PDF", 
            desc: "Interact conversationally with your documents. Ask questions and get answers based on the content.", 
            icon: MessageSquare, 
            href: "/ai-tools/chat-with-pdf",
            tags: ["Conversational", "RAG"] 
          },
          { 
            title: "Resume Builder", 
            desc: "Generate professional bullet points and summaries tailored to specific job descriptions.", 
            icon: Briefcase, 
            href: "/ai-tools/resume-builder",
            tags: ["Career"] 
          },
          { 
            title: "Resume Analyzer", 
            desc: "Analyze and improve your resume for target jobs.", 
            icon: FileSearch, 
            href: "/ai-tools/resume-analyzer",
            tags: ["Career"] 
          },
          { 
            title: "Cover Letter Generator", 
            desc: "Generate customized cover letters for any job.", 
            icon: FileText, 
            href: "/ai-tools/cover-letter",
            tags: ["Career"] 
          },
          { 
            title: "Email Writer", 
            desc: "Write professional emails with AI assistance.", 
            icon: FileText, 
            href: "/ai-tools/email-writer",
            tags: ["Writing"] 
          },
          { 
            title: "Text Rewriter", 
            desc: "Rewrite text for better clarity and tone.", 
            icon: FileSearch, 
            href: "/ai-tools/text-rewriter",
            tags: ["Analysis"] 
          },
          { 
            title: "Grammar Fixer", 
            desc: "Instantly fix grammar and spelling mistakes.", 
            icon: Sparkles, 
            href: "/ai-tools/grammar-fixer",
            tags: ["Writing"] 
          },
          { 
            title: "Content Calendar Generator", 
            desc: "Generate a complete content calendar using AI.", 
            icon: FileText, 
            href: "/ai-tools/content-calendar",
            tags: ["Planning"] 
          }
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.title} to={tool.href} className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all group flex flex-col items-start relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               
               <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors text-primary shadow-sm relative z-10">
                <Icon className="w-7 h-7" />
               </div>
               
               <h3 className="text-xl font-semibold text-heading-navy mb-3 relative z-10">{tool.title}</h3>
               <p className="text-base text-on-surface-variant mb-8 flex-1 relative z-10">{tool.desc}</p>
               
               <div className="flex w-full justify-between items-center mt-auto relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map(tag => (
                      <span key={tag} className="bg-surface-container-low border border-border-slate/50 text-heading-navy text-xs font-medium px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
               </div>
            </Link>
          )
        })}

        {/* Coming Soon Card */}
        <div className="border border-dashed border-border-slate rounded-xl p-6 flex flex-col items-center justify-center text-center bg-surface-container/30">
          <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-outline" />
          </div>
          <h3 className="text-lg font-medium text-heading-navy mb-2">More Tools Coming</h3>
          <p className="text-sm text-on-surface-variant max-w-[200px]">
            We're constantly training new models to expand our utility suite.
          </p>
        </div>

      </div>
    </div>
  );
};
