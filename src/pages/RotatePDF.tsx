import { RotateCw } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PdfToolUpload } from "../components/PdfToolUpload";

export const RotatePDF = () => <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12"><div className="max-w-4xl mx-auto"><Breadcrumbs /><header className="mb-8 text-center"><RotateCw className="mx-auto mb-4 h-10 w-10 text-primary" /><h1 className="text-3xl font-bold text-heading-navy">Rotate PDF</h1><p className="mt-3 text-on-surface-variant">Rotate all pages or selected pages locally in your browser.</p></header><PdfToolUpload tool="rotate-pdf" title="Upload a PDF to rotate" browseText="Select PDF" accept="application/pdf,.pdf" /></div></div>;
