import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, Brain, Briefcase, Code, FileMinus2, FileText, GraduationCap, Image as ImageIcon, RotateCw, Stamp } from "lucide-react";

export type ToolCategory =
  | "PDF Tools"
  | "Image Lab"
  | "Health Calculators"
  | "Student Hub"
  | "Business Tools"
  | "Developer Tools"
  | "AI Tools";

export type ToolExecution = "local" | "ai-text" | "ai-extracted";

export type ToolDefinition = {
  id: string;
  category: ToolCategory;
  name: string;
  path: string;
  description: string;
  execution: ToolExecution;
  icon: LucideIcon;
  component: LazyExoticComponent<ComponentType>;
};

const page = <T extends Record<string, ComponentType>>(
  loader: () => Promise<T>,
  exportName: keyof T,
) => lazy(async () => ({ default: (await loader())[exportName] }));

export const tools: ToolDefinition[] = [
  { id: "word-to-pdf", category: "PDF Tools", name: "Word to PDF", path: "/pdf-tools/word-to-pdf", description: "Convert DOCX to PDF in Visual Match or Editable mode.", execution: "local", icon: FileText, component: page(() => import("../pages/WordToPDF"), "WordToPDF") },
  { id: "compress-pdf", category: "PDF Tools", name: "Compress PDF", path: "/pdf-tools/compress-pdf", description: "Reduce PDF file size locally.", execution: "local", icon: FileText, component: page(() => import("../pages/CompressPDF"), "CompressPDF") },
  { id: "merge-pdf", category: "PDF Tools", name: "Merge PDF", path: "/pdf-tools/merge-pdf", description: "Combine multiple PDFs.", execution: "local", icon: FileText, component: page(() => import("../pages/MergePDF"), "MergePDF") },
  { id: "split-pdf", category: "PDF Tools", name: "Split PDF", path: "/pdf-tools/split-pdf", description: "Extract or divide PDF pages.", execution: "local", icon: FileText, component: page(() => import("../pages/SplitPDF"), "SplitPDF") },
  { id: "rotate-pdf", category: "PDF Tools", name: "Rotate PDF", path: "/pdf-tools/rotate-pdf", description: "Rotate all or selected PDF pages.", execution: "local", icon: RotateCw, component: page(() => import("../pages/RotatePDF"), "RotatePDF") },
  { id: "delete-pdf-pages", category: "PDF Tools", name: "Delete PDF Pages", path: "/pdf-tools/delete-pages", description: "Remove selected pages from a PDF.", execution: "local", icon: FileMinus2, component: page(() => import("../pages/DeletePDFPages"), "DeletePDFPages") },
  { id: "watermark-pdf", category: "PDF Tools", name: "Add Watermark", path: "/pdf-tools/watermark", description: "Add a professional text watermark.", execution: "local", icon: Stamp, component: page(() => import("../pages/WatermarkPDF"), "WatermarkPDF") },
  { id: "jpg-to-pdf", category: "PDF Tools", name: "JPG to PDF", path: "/pdf-tools/jpg-to-pdf", description: "Convert images to a PDF.", execution: "local", icon: FileText, component: page(() => import("../pages/JPGToPDF"), "JPGToPDF") },
  { id: "pdf-to-jpg", category: "PDF Tools", name: "PDF to JPG", path: "/pdf-tools/pdf-to-jpg", description: "Render PDF pages as JPG images.", execution: "local", icon: FileText, component: page(() => import("../pages/PDFToJPG"), "PDFToJPG") },
  { id: "pdf-to-ppt", category: "PDF Tools", name: "PDF to PPT", path: "/pdf-tools/pdf-to-ppt", description: "Convert PDF pages to PowerPoint in Visual Match or Editable mode.", execution: "local", icon: FileText, component: page(() => import("../pages/PDFToPPT"), "PDFToPPT") },
  { id: "pdf-to-word", category: "PDF Tools", name: "PDF to Word", path: "/pdf-tools/pdf-to-word", description: "Convert PDF to DOCX in Visual Match or Editable mode.", execution: "local", icon: FileText, component: page(() => import("../pages/PDFToWord"), "PDFToWord") },
  { id: "image-compressor", category: "Image Lab", name: "Image Compressor", path: "/image-tools/compressor", description: "Compress JPG, PNG, and WebP images.", execution: "local", icon: ImageIcon, component: page(() => import("../pages/ImageCompressor"), "ImageCompressor") },
  { id: "image-resizer", category: "Image Lab", name: "Image Resizer", path: "/image-tools/resizer", description: "Resize images to exact dimensions.", execution: "local", icon: ImageIcon, component: page(() => import("../pages/ImageResizer"), "ImageResizer") },
  { id: "webp-converter", category: "Image Lab", name: "WebP Converter", path: "/image-tools/webp-converter", description: "Convert JPG, PNG, and WebP images.", execution: "local", icon: ImageIcon, component: page(() => import("../pages/WebPConverter"), "WebPConverter") },
  { id: "bmi", category: "Health Calculators", name: "BMI Calculator", path: "/calculators/bmi", description: "Calculate body mass index.", execution: "local", icon: Activity, component: page(() => import("../pages/BMICalculator"), "BMICalculator") },
  { id: "calories", category: "Health Calculators", name: "Calorie Calculator", path: "/calculators/calories", description: "Estimate daily calorie needs.", execution: "local", icon: Activity, component: page(() => import("../pages/CalorieCalculator"), "CalorieCalculator") },
  { id: "tdee", category: "Health Calculators", name: "TDEE Calculator", path: "/calculators/tdee", description: "Calculate total daily energy expenditure.", execution: "local", icon: Activity, component: page(() => import("../pages/TDEECalculator"), "TDEECalculator") },
  { id: "cgpa", category: "Student Hub", name: "CGPA Calculator", path: "/student-tools/cgpa-calculator", description: "Calculate GPA and CGPA.", execution: "local", icon: GraduationCap, component: page(() => import("../pages/CGPACalculator"), "CGPACalculator") },
  { id: "word-counter", category: "Student Hub", name: "Word Counter", path: "/student-tools/word-counter", description: "Count words, characters, and sentences.", execution: "local", icon: GraduationCap, component: page(() => import("../pages/WordCounter"), "WordCounter") },
  { id: "quiz-generator", category: "Student Hub", name: "Quiz Generator", path: "/student-tools/quiz-generator", description: "Generate quizzes from study notes.", execution: "ai-text", icon: GraduationCap, component: page(() => import("../pages/QuizGenerator"), "QuizGenerator") },
  { id: "citation-generator", category: "Student Hub", name: "Citation Generator", path: "/student-tools/citation-generator", description: "Format APA, MLA, Chicago, and IEEE citations.", execution: "local", icon: GraduationCap, component: page(() => import("../pages/CitationGenerator"), "CitationGenerator") },
  { id: "invoice-generator", category: "Business Tools", name: "Invoice Generator", path: "/business/invoice-generator", description: "Create and print professional invoices.", execution: "local", icon: Briefcase, component: page(() => import("../pages/InvoiceGenerator"), "InvoiceGenerator") },
  { id: "expenses", category: "Business Tools", name: "Expenses", path: "/business/expenses", description: "Track expense entries and totals locally.", execution: "local", icon: Briefcase, component: page(() => import("../pages/Expenses"), "Expenses") },
  { id: "qr-generator", category: "Business Tools", name: "QR Code Maker", path: "/business/qr-generator", description: "Generate downloadable QR codes.", execution: "local", icon: Briefcase, component: page(() => import("../pages/QRCodeGenerator"), "QRCodeGenerator") },
  { id: "utm-builder", category: "Business Tools", name: "UTM Link Builder", path: "/business/utm-builder", description: "Build campaign tracking links locally.", execution: "local", icon: Briefcase, component: page(() => import("../pages/UTMLinkBuilder"), "UTMLinkBuilder") },
  { id: "json-formatter", category: "Developer Tools", name: "JSON Formatter", path: "/developer-tools/json-formatter", description: "Format, validate, and minify JSON.", execution: "local", icon: Code, component: page(() => import("../pages/JSONFormatter"), "JSONFormatter") },
  { id: "case-converter", category: "Developer Tools", name: "Case Converter", path: "/developer-tools/case-converter", description: "Convert text between common cases.", execution: "local", icon: Code, component: page(() => import("../pages/CaseConverter"), "CaseConverter") },
  { id: "pdf-summarizer", category: "AI Tools", name: "AI PDF Summarizer", path: "/ai-tools/pdf-summarizer", description: "Summarize locally extracted PDF text with AI.", execution: "ai-extracted", icon: Brain, component: page(() => import("../pages/PDFSummarizer"), "PDFSummarizer") },
  { id: "chat-with-pdf", category: "AI Tools", name: "Chat with PDF", path: "/ai-tools/chat-with-pdf", description: "Ask questions using relevant locally extracted PDF text.", execution: "ai-extracted", icon: Brain, component: page(() => import("../pages/ChatWithPDF"), "ChatWithPDF") },
  { id: "resume-builder", category: "AI Tools", name: "Resume Builder", path: "/ai-tools/resume-builder", description: "Build and print an ATS-friendly resume.", execution: "local", icon: Brain, component: page(() => import("../pages/ResumeBuilder"), "ResumeBuilder") },
  { id: "resume-analyzer", category: "AI Tools", name: "Resume Analyzer", path: "/ai-tools/resume-analyzer", description: "Analyze locally extracted resume text with AI.", execution: "ai-extracted", icon: Brain, component: page(() => import("../pages/ResumeAnalyzer"), "ResumeAnalyzer") },
  { id: "cover-letter", category: "AI Tools", name: "Cover Letter Generator", path: "/ai-tools/cover-letter", description: "Generate a tailored cover letter.", execution: "ai-text", icon: Brain, component: page(() => import("../pages/CoverLetterGenerator"), "CoverLetterGenerator") },
  { id: "email-writer", category: "AI Tools", name: "Email Writer", path: "/ai-tools/email-writer", description: "Draft professional emails.", execution: "ai-text", icon: Brain, component: page(() => import("../pages/EmailWriter"), "EmailWriter") },
  { id: "text-rewriter", category: "AI Tools", name: "Text Rewriter", path: "/ai-tools/text-rewriter", description: "Rewrite text for clarity and tone.", execution: "ai-text", icon: Brain, component: page(() => import("../pages/TextRewriter"), "TextRewriter") },
  { id: "grammar-fixer", category: "AI Tools", name: "Grammar Fixer", path: "/ai-tools/grammar-fixer", description: "Correct grammar and spelling.", execution: "ai-text", icon: Brain, component: page(() => import("../pages/GrammarFixer"), "GrammarFixer") },
  { id: "content-calendar", category: "AI Tools", name: "Content Calendar", path: "/ai-tools/content-calendar", description: "Generate a structured content calendar.", execution: "ai-text", icon: Brain, component: page(() => import("../pages/ContentCalendarGenerator"), "ContentCalendarGenerator") },
];

export const toolByPath = new Map(tools.map((tool) => [tool.path, tool]));
