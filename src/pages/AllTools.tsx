import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ArrowRight, FileText, Image as ImageIcon, Activity, GraduationCap, Briefcase, Code, Brain } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { fuzzyMatch } from "../lib/utils";

const allTools = [
  // PDF
  { category: "PDF Tools", name: "Word to PDF", href: "/pdf-tools/word-to-pdf", icon: FileText, desc: "Convert Word documents to PDF." },
  { category: "PDF Tools", name: "Compress PDF", href: "/pdf-tools/compress-pdf", icon: FileText, desc: "Reduce file size while maintaining quality." },
  { category: "PDF Tools", name: "Merge PDF", href: "/pdf-tools/merge-pdf", icon: FileText, desc: "Combine multiple PDFs." },
  { category: "PDF Tools", name: "Split PDF", href: "/pdf-tools/split-pdf", icon: FileText, desc: "Extract pages from PDF." },
  { category: "PDF Tools", name: "JPG to PDF", href: "/pdf-tools/jpg-to-pdf", icon: FileText, desc: "Convert JPG to PDF." },
  { category: "PDF Tools", name: "PDF to JPG", href: "/pdf-tools/pdf-to-jpg", icon: FileText, desc: "Convert PDF to JPG." },
  { category: "PDF Tools", name: "PDF to PPT", href: "/pdf-tools/pdf-to-ppt", icon: FileText, desc: "Convert PDF to PPT." },
  { category: "PDF Tools", name: "PDF to Word", href: "/pdf-tools/pdf-to-word", icon: FileText, desc: "Convert PDF documents to Word." },
  
  // Image
  { category: "Image Lab", name: "Image Compressor", href: "/image-tools/compressor", icon: ImageIcon, desc: "Compress images securely." },
  { category: "Image Lab", name: "Image Resizer", href: "/image-tools/resizer", icon: ImageIcon, desc: "Resize images to specific dimensions." },
  { category: "Image Lab", name: "WebP Converter", href: "/image-tools/webp-converter", icon: ImageIcon, desc: "Convert to and from WebP." },
  
  // Health
  { category: "Health Calculators", name: "BMI Calculator", href: "/calculators/bmi", icon: Activity, desc: "Calculate your BMI." },
  { category: "Health Calculators", name: "Calorie Calculator", href: "/calculators/calories", icon: Activity, desc: "Calculate daily calorie needs." },
  { category: "Health Calculators", name: "TDEE Calculator", href: "/calculators/tdee", icon: Activity, desc: "Calculate Total Daily Energy Expenditure." },
  
  // Student
  { category: "Student Hub", name: "CGPA Calculator", href: "/student-tools/cgpa-calculator", icon: GraduationCap, desc: "Calculate your GPA and CGPA." },
  { category: "Student Hub", name: "Word Counter", href: "/student-tools/word-counter", icon: GraduationCap, desc: "Count words, characters, and sentences." },
  { category: "Student Hub", name: "Quiz Generator", href: "/student-tools/quiz-generator", icon: GraduationCap, desc: "Generate quizzes from study materials." },
  
  // Business
  { category: "Business Tools", name: "Invoice Generator", href: "/business/invoice-generator", icon: Briefcase, desc: "Create professional invoices." },
  { category: "Business Tools", name: "QR Code Maker", href: "/business/qr-generator", icon: Briefcase, desc: "Generate high-res QR codes." },
  
  // Dev
  { category: "Developer Tools", name: "JSON Formatter", href: "/developer-tools/json-formatter", icon: Code, desc: "Format, validate, prettify JSON." },
  { category: "Developer Tools", name: "Case Converter", href: "/developer-tools/case-converter", icon: Code, desc: "Convert text to various casings." },
  
  // AI
  { category: "AI Tools", name: "AI PDF Summarizer", href: "/ai-tools/pdf-summarizer", icon: Brain, desc: "Summarize large PDF files easily." },
  { category: "AI Tools", name: "Chat with PDF", href: "/ai-tools/chat-with-pdf", icon: Brain, desc: "Interact dynamically with your documents." },
  { category: "AI Tools", name: "Resume Builder", href: "/ai-tools/resume-builder", icon: Brain, desc: "Build ATS-friendly resumes." },
  { category: "AI Tools", name: "Resume Analyzer", href: "/ai-tools/resume-analyzer", icon: Brain, desc: "Analyze and improve your resume." },
  { category: "AI Tools", name: "Cover Letter Generator", href: "/ai-tools/cover-letter", icon: Brain, desc: "Generate customized cover letters." },
  { category: "AI Tools", name: "Email Writer", href: "/ai-tools/email-writer", icon: Brain, desc: "Write professional emails with AI." },
  { category: "AI Tools", name: "Text Rewriter", href: "/ai-tools/text-rewriter", icon: Brain, desc: "Rewrite text for clarity and tone." },
  { category: "AI Tools", name: "Grammar Fixer", href: "/ai-tools/grammar-fixer", icon: Brain, desc: "Instantly fix grammar and spelling." },
  { category: "AI Tools", name: "Content Calendar", href: "/ai-tools/content-calendar", icon: Brain, desc: "Generate content calendars using AI." }
];

export const AllTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  // Initialize search term from location state if coming from Home search
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
    }
  }, [location.state?.searchQuery]);

  const filteredTools = allTools.filter(tool => 
    fuzzyMatch(tool.name, searchTerm) ||
    fuzzyMatch(tool.category, searchTerm) ||
    fuzzyMatch(tool.desc, searchTerm)
  );

  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <h1 className="text-3xl md:text-4xl font-bold text-heading-navy mb-6">All Tools</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-on-surface-variant" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-border-slate rounded-xl text-heading-navy placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
            placeholder="Search tools by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // Search is already filtered in real-time via searchTerm state
              }
            }}
          />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
              key={tool.name} 
              to={tool.href} 
              state={{ fromAllTools: true }}
              className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-2">
                  {tool.category}
                </div>
                <h3 className="text-xl font-bold text-heading-navy mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-on-surface-variant text-sm line-clamp-2">
                  {tool.desc}
                </p>
              </div>
            </Link>
          );
        })}

        {filteredTools.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant">
            No tools found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};
