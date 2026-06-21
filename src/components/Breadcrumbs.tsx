import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const state = location.state as { fromAllTools?: boolean } | null;

  // If we're on the home page, don't show breadcrumbs
  if (pathnames.length === 0) {
    return null;
  }

  // If navigated from All Tools page, show a back button to All Tools
  if (state?.fromAllTools) {
    return (
      <nav className="flex items-center text-sm font-medium text-on-surface-variant mb-6 md:mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/all-tools" className="hover:text-primary transition-colors flex items-center gap-1.5 opacity-80 hover:opacity-100 bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-slate">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </Link>
      </nav>
    );
  }

  const getLabel = (path: string) => {
    // Customize label mapping
    const labels: Record<string, string> = {
      // Categories
      "pdf-tools": "PDF Suite",
      "image-tools": "Image Lab",
      "ai-tools": "AI Tools",
      "developer-tools": "Developer Tools",
      "student-tools": "Student Hub",
      "business": "Business Tools",
      "calculators": "Calculators",
      "health": "Health",
      "all-tools": "All Tools",

      // PDF
      "word-to-pdf": "Word to PDF",
      "compress-pdf": "Compress PDF",
      "merge-pdf": "Merge PDF",
      "split-pdf": "Split PDF",
      "jpg-to-pdf": "JPG to PDF",
      "pdf-to-jpg": "PDF to JPG",
      "pdf-to-ppt": "PDF to PPT",
      "pdf-to-word": "PDF to Word",

      // Image
      "compressor": "Image Compressor",
      "resizer": "Image Resizer",
      "webp-converter": "WebP Converter",

      // Health
      "bmi": "BMI Calculator",
      "calories": "Calorie Calculator",
      "tdee": "TDEE Calculator",

      // Student
      "cgpa-calculator": "CGPA Calculator",
      "word-counter": "Word Counter",
      "quiz-generator": "Quiz Generator",
      "citation-generator": "Citation Generator",

      // Business
      "invoice-generator": "Invoice Generator",
      "expenses": "Expenses",
      "qr-generator": "QR Code Maker",
      "utm-builder": "UTM Link Builder",

      // Developer
      "json-formatter": "JSON Formatter",
      "case-converter": "Case Converter",

      // AI
      "pdf-summarizer": "PDF Summarizer",
      "chat-with-pdf": "Chat with PDF",
      "resume-builder": "Resume Builder",
      "resume-analyzer": "Resume Analyzer",
      "cover-letter": "Cover Letter Generator",
      "email-writer": "Email Writer",
      "text-rewriter": "Text Rewriter",
      "grammar-fixer": "Grammar Fixer",
      "content-calendar": "Content Calendar Generator"
    };

    // If it's a known path, return the mapped label
    if (labels[path]) return labels[path];

    // Otherwise, convert from kebab-case or camelCase to Title Case
    return path
      .replace(/-/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="flex items-center text-sm font-medium text-on-surface-variant mb-6 md:mb-8 overflow-x-auto whitespace-nowrap pb-2">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5 opacity-80 hover:opacity-100">
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = getLabel(value);

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-border-slate shrink-0" />
            {isLast ? (
              <span className="text-primary" aria-current="page">
                {label}
              </span>
            ) : (
              <Link to={to} className="hover:text-primary transition-colors opacity-80 hover:opacity-100">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
