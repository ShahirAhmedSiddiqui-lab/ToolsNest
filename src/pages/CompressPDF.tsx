import { FileText, Minimize } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PdfToolUpload } from "../components/PdfToolUpload";

export const CompressPDF = () => {
  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <div className="mb-10 text-center flex flex-col items-center">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary inline-flex mb-6">
            <Minimize className="w-10 h-10" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-4">Compress PDF</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Reduce PDF file size without losing quality.
          </p>
        </div>

        <PdfToolUpload tool="compress-pdf" title="Upload your PDF document here" browseText="Select PDF" accept="application/pdf,.pdf" />
      </div>
    </div>
  );
};
