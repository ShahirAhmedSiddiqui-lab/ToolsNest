import { FileText } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PdfToolUpload } from "../components/PdfToolUpload";

export const PDFToWord = () => {
  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <div className="mb-10 text-center flex flex-col items-center">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary inline-flex mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-4">PDF to Word Converter</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Securely convert your PDF files into an editable Word document format (.docx) with absolute layout preservation.
          </p>
        </div>

        <PdfToolUpload tool="pdf-to-word" title="Drag & Drop your PDF here" browseText="Select PDF File" accept="application/pdf,.pdf" />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="font-bold text-heading-navy text-lg mb-2">Perfect Layout</div>
            <p className="text-on-surface-variant text-sm">We ensure your converted Word document perfectly mirrors your PDF's formatting.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="font-bold text-heading-navy text-lg mb-2">Fast Processing</div>
            <p className="text-on-surface-variant text-sm">Most conversions complete within 5 seconds using our optimized engine.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="font-bold text-heading-navy text-lg mb-2">Absolute Privacy</div>
            <p className="text-on-surface-variant text-sm">Your files are processed in your browser and never stored by ToolsNest.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
