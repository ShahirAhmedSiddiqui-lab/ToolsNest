import { Minimize } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ImageTool } from "../components/ImageTool";

export const ImageCompressor = () => (
  <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12"><div className="max-w-4xl mx-auto">
    <Breadcrumbs />
    <div className="mb-8 text-center"><Minimize className="mx-auto mb-4 h-10 w-10 text-primary" /><h1 className="text-3xl font-bold text-heading-navy">Image Compressor</h1><p className="mt-3 text-on-surface-variant">Reduce JPG, PNG, or WebP size without uploading it.</p></div>
    <ImageTool mode="compress" />
  </div></div>
);
