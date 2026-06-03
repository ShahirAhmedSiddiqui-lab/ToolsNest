import { useState } from "react";
import { UploadCloud, FileText, ArrowRight, ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const PDFToWord = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
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

        {/* Upload Box */}
        <div 
          className={`w-full bg-surface-container-lowest border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all ${
            isDragging ? "border-primary bg-primary/5" : "border-border-slate hover:border-primary/50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
        >
          <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-heading-navy mb-2">Drag & Drop your PDF here</h3>
          <p className="text-on-surface-variant mb-8">or click to browse from your device</p>
          
          <button className="bg-primary text-on-primary text-lg font-medium px-8 py-4 rounded-xl shadow-md hover:bg-primary-container transition-all hover:-translate-y-0.5 active:translate-y-0">
            Select PDF File
          </button>
          
          <div className="mt-8 flex items-center gap-2 text-xs font-medium text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full">
            <ShieldAlert className="w-4 h-4 text-success-teal" />
            End-to-End Encrypted • Processed locally if possible
          </div>
        </div>

        {/* Features / FAQ */}
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
            <p className="text-on-surface-variant text-sm">Your files are encrypted during transit and deleted instantly after conversion.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
