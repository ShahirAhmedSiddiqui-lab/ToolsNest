import { ShieldAlert, FileImage, Minimize2, ArrowRight } from "lucide-react";

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
        {/* Tool Cards */}
        {[
          {
            title: "Image Compressor",
            desc: "Compress JPG, PNG, and WebP images securely.",
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
