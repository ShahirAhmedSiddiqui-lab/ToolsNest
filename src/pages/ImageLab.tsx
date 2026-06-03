import { ShieldAlert, UploadCloud, Eraser, FileImage, Minimize2, Wand2, ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const ImageLab = () => {
  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      {/* Header Section */}
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-heading-navy mb-2">Image Lab</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Professional-grade image processing tools. Process files securely and directly in your browser without uploading to external servers.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-success-teal/10 px-4 py-2 rounded-full border border-success-teal/20 w-fit">
            <ShieldAlert className="w-5 h-5 text-success-teal" />
            <span className="text-sm font-medium text-success-teal">Local Browser Processing</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bulk Upload Area */}
        <div className="md:col-span-12 xl:col-span-8 bg-surface-container-lowest border border-border-slate rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[400px] hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-dashed border-primary rounded-xl pointer-events-none z-0"></div>
          <div className="z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-heading-navy mb-2">Bulk Image Processing</h2>
            <p className="text-base text-on-surface-variant mb-8 max-w-md">
              Drag and drop multiple images here to resize, convert, or enhance them all at once.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="text-sm font-medium text-on-primary bg-primary px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                Select Files
              </button>
              <button className="text-sm font-medium text-heading-navy bg-surface-container-lowest border border-border-slate px-6 py-3 rounded-lg hover:bg-surface-container-low transition-colors">
                Import from URL
              </button>
            </div>
            <p className="text-sm text-outline mt-6">Supports JPG, PNG, WebP, SVG up to 50MB per file.</p>
          </div>
        </div>

        {/* Tool Cards */}
        {[
          {
            title: "Image Compressor",
            desc: "Compress JPG, PNG, SVG, and GIFs securely.",
            icon: Minimize2,
            tags: ["Performance", "Bulk"],
            href: "/image-tools/compressor"
          },
          {
            title: "Image Resizer",
            desc: "Resize images to specific dimensions easily.",
            icon: Minimize2,
            tags: ["Crop", "Scale"],
            href: "/image-tools/resizer"
          },
          {
            title: "WebP Converter",
            desc: "Convert images to and from WebP format.",
            icon: FileImage,
            tags: ["Next-Gen"],
            href: "/image-tools/webp-converter"
          },
          {
            title: "BG Remover",
            desc: "Instantly remove backgrounds from photos with AI precision.",
            icon: Eraser,
            tags: ["AI Powered"],
            href: "#"
          }
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <Link to={tool.href} key={tool.title} className="md:col-span-6 xl:col-span-4 bg-surface-container-lowest border border-border-slate rounded-xl p-6 hover:shadow-md transition-all cursor-pointer group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-heading-navy mb-2">{tool.title}</h3>
              <p className="text-base text-on-surface-variant mb-6">{tool.desc}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {tool.tags.map(tag => (
                  <span key={tag} className="bg-surface-container-low text-heading-navy text-xs font-medium px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
};
