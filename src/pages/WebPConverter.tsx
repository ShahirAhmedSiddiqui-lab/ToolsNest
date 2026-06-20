import { Images } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ImageTool } from "../components/ImageTool";

export const WebPConverter = () => (
  <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12"><div className="max-w-4xl mx-auto">
    <Breadcrumbs />
    <div className="mb-8 text-center"><Images className="mx-auto mb-4 h-10 w-10 text-primary" /><h1 className="text-3xl font-bold text-heading-navy">WebP Converter</h1><p className="mt-3 text-on-surface-variant">Convert between JPG, PNG, and WebP locally.</p></div>
    <ImageTool mode="convert" />
  </div></div>
);
