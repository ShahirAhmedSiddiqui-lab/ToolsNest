import { Code, Type, FileJson, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const DeveloperTools = () => {
  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-[1440px] mx-auto"><Breadcrumbs /></div>
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-heading-navy mb-2 flex items-center gap-3">
          Developer & Text Tools
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
            <Code className="w-6 h-6" />
          </div>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Essential utilities for developers, writers, and data handlers. Format code, convert text cases, and manage strings directly in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tool Cards */}
        {[
          { 
            title: "JSON Formatter", 
            desc: "Format, validate, prettify, and minify JSON data securely in the browser.", 
            icon: FileJson, 
            href: "/developer-tools/json-formatter",
            tags: ["Utility", "Developer"] 
          },
          { 
            title: "Case Converter", 
            desc: "Easily convert text to UPPERCASE, lowercase, camelCase, snake_case, and more.", 
            icon: Type, 
            href: "/developer-tools/case-converter",
            tags: ["Text", "Writing"] 
          }
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.title} to={tool.href} className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all group flex flex-col items-start relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               
               <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors text-primary shadow-sm relative z-10">
                <Icon className="w-7 h-7" />
               </div>
               
               <h3 className="text-xl font-semibold text-heading-navy mb-3 relative z-10">{tool.title}</h3>
               <p className="text-base text-on-surface-variant mb-8 flex-1 relative z-10">{tool.desc}</p>
               
               <div className="flex w-full justify-between items-center mt-auto relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map(tag => (
                      <span key={tag} className="bg-surface-container-low border border-border-slate/50 text-heading-navy text-xs font-medium px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
               </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
};
