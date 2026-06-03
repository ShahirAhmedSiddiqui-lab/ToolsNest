/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentType } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout, SimpleLayout } from "./components/Layouts";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { StudentHub } from "./pages/StudentHub";
import { Pricing } from "./pages/Pricing";
import { ImageLab } from "./pages/ImageLab";
import { BusinessTools } from "./pages/BusinessTools";
import { BMICalculator } from "./pages/BMICalculator";
import { PDFSuite } from "./pages/PDFSuite";
import { PDFToWord } from "./pages/PDFToWord";
import { AITools } from "./pages/AITools";
import { PDFSummarizer } from "./pages/PDFSummarizer";
import { DeveloperTools } from "./pages/DeveloperTools";
import { JSONFormatter } from "./pages/JSONFormatter";
import { CaseConverter } from "./pages/CaseConverter";

// Generated Pages
import { WordToPDF } from "./pages/WordToPDF";
import { CompressPDF } from "./pages/CompressPDF";
import { MergePDF } from "./pages/MergePDF";
import { JPGToPDF } from "./pages/JPGToPDF";
import { SplitPDF } from "./pages/SplitPDF";
import { PDFToJPG } from "./pages/PDFToJPG";
import { PDFToPPT } from "./pages/PDFToPPT";

import { ImageCompressor } from "./pages/ImageCompressor";
import { ImageResizer } from "./pages/ImageResizer";
import { WebPConverter } from "./pages/WebPConverter";

import { HealthCalculators } from "./pages/HealthCalculators";
import { CalorieCalculator } from "./pages/CalorieCalculator";
import { TDEECalculator } from "./pages/TDEECalculator";

import { CGPACalculator } from "./pages/CGPACalculator";
import { WordCounter } from "./pages/WordCounter";
import { QuizGenerator } from "./pages/QuizGenerator";
import { CitationGenerator } from "./pages/CitationGenerator";

import { InvoiceGenerator } from "./pages/InvoiceGenerator";
import { QRCodeGenerator } from "./pages/QRCodeGenerator";

import { ChatWithPDF } from "./pages/ChatWithPDF";
import { ResumeBuilder } from "./pages/ResumeBuilder";
import { ResumeAnalyzer } from "./pages/ResumeAnalyzer";
import { CoverLetterGenerator } from "./pages/CoverLetterGenerator";
import { EmailWriter } from "./pages/EmailWriter";
import { TextRewriter } from "./pages/TextRewriter";
import { GrammarFixer } from "./pages/GrammarFixer";
import { ContentCalendarGenerator } from "./pages/ContentCalendarGenerator";
import { AllTools } from "./pages/AllTools";
import { Security } from "./pages/Security";
import { Privacy } from "./pages/Privacy";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Pages without Sidebar */}
        <Route element={<SimpleLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        {/* Pages with Sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/all-tools" element={<AllTools />} />
          <Route path="/pdf-tools" element={<PDFSuite />} />
          <Route path="/pdf-tools/pdf-to-word" element={<PDFToWord />} />
          <Route path="/pdf-tools/word-to-pdf" element={<WordToPDF />} />
          <Route path="/pdf-tools/compress-pdf" element={<CompressPDF />} />
          <Route path="/pdf-tools/merge-pdf" element={<MergePDF />} />
          <Route path="/pdf-tools/jpg-to-pdf" element={<JPGToPDF />} />
          <Route path="/pdf-tools/split-pdf" element={<SplitPDF />} />
          <Route path="/pdf-tools/pdf-to-jpg" element={<PDFToJPG />} />
          <Route path="/pdf-tools/pdf-to-ppt" element={<PDFToPPT />} />

          <Route path="/image-tools" element={<ImageLab />} />
          <Route path="/image-tools/compressor" element={<ImageCompressor />} />
          <Route path="/image-tools/resizer" element={<ImageResizer />} />
          <Route path="/image-tools/webp-converter" element={<WebPConverter />} />

          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/ai-tools/pdf-summarizer" element={<PDFSummarizer />} />
          <Route path="/ai-tools/chat-with-pdf" element={<ChatWithPDF />} />
          <Route path="/ai-tools/resume-builder" element={<ResumeBuilder />} />
          <Route path="/ai-tools/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/ai-tools/cover-letter" element={<CoverLetterGenerator />} />
          <Route path="/ai-tools/email-writer" element={<EmailWriter />} />
          <Route path="/ai-tools/text-rewriter" element={<TextRewriter />} />
          <Route path="/ai-tools/grammar-fixer" element={<GrammarFixer />} />
          <Route path="/ai-tools/content-calendar" element={<ContentCalendarGenerator />} />

          <Route path="/developer-tools" element={<DeveloperTools />} />
          <Route path="/developer-tools/json-formatter" element={<JSONFormatter />} />
          <Route path="/developer-tools/case-converter" element={<CaseConverter />} />

          <Route path="/student-tools" element={<StudentHub />} />
          <Route path="/student-tools/cgpa-calculator" element={<CGPACalculator />} />
          <Route path="/student-tools/word-counter" element={<WordCounter />} />
          <Route path="/student-tools/quiz-generator" element={<QuizGenerator />} />
          <Route path="/student-tools/citation-generator" element={<CitationGenerator />} />

          <Route path="/business" element={<BusinessTools />} />
          <Route path="/business/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/business/qr-generator" element={<QRCodeGenerator />} />

          <Route path="/calculators" element={<HealthCalculators />} />
          <Route path="/calculators/bmi" element={<BMICalculator />} />
          <Route path="/calculators/calories" element={<CalorieCalculator />} />
          <Route path="/calculators/tdee" element={<TDEECalculator />} />

          <Route path="/security" element={<Security />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
