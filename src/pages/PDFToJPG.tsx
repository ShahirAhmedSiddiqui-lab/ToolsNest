import { useState } from "react";
import { Image, UploadCloud, ArrowLeft, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const PDFToJPG = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />
        
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary inline-flex mb-6">
            <Image className="w-10 h-10" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-4">PDF to JPG</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Convert PDF pages into high-quality JPG images.
          </p>
        </div>

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
          <h3 className="text-xl font-semibold text-heading-navy mb-2">Upload your PDF document here</h3>
          <p className="text-on-surface-variant mb-8">Drag & Drop or click to browse</p>
          
          <button className="bg-primary text-on-primary text-lg font-medium px-8 py-4 rounded-xl shadow-md hover:bg-primary-container transition-all hover:-translate-y-0.5 active:translate-y-0">
            Select PDF
          </button>
          
          <div className="mt-8 flex items-center gap-2 text-xs font-medium text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full">
            <ShieldAlert className="w-4 h-4 text-success-teal" />
            Secure & Private Processing
          </div>
        </div>
      </div>
    </div>
  );
};