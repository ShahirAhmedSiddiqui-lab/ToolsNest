import { ArrowRight, Briefcase, FileText, Link as LinkIcon, QrCode, Receipt, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

const businessTools = [
  {
    title: "Invoice Generator",
    description: "Create and print invoices locally without uploading business data.",
    href: "/business/invoice-generator",
    icon: FileText,
    tags: ["Documents", "Printing"],
  },
  {
    title: "Expenses",
    description: "Track expense entries, totals, and category breakdowns directly in your browser.",
    href: "/business/expenses",
    icon: Receipt,
    tags: ["Tracking", "Local"],
  },
  {
    title: "QR Code Maker",
    description: "Generate downloadable QR codes for links, text, and contact details.",
    href: "/business/qr-generator",
    icon: QrCode,
    tags: ["Downloads", "Marketing"],
  },
  {
    title: "UTM Link Builder",
    description: "Build campaign tracking URLs instantly with clean query parameters.",
    href: "/business/utm-builder",
    icon: LinkIcon,
    tags: ["Marketing", "Analytics"],
  },
];

export const BusinessTools = () => {
  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-heading-navy mb-2 flex items-center gap-3">
              Business Tools
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
                <Briefcase className="w-5 h-5" />
              </div>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Focused business utilities for invoices, expenses, QR codes, and campaign tracking. Open each tool separately for a lighter, faster workflow.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-success-teal/10 px-4 py-2 rounded-full border border-success-teal/20 w-fit">
            <ShieldAlert className="w-5 h-5 text-success-teal" />
            <span className="text-sm font-medium text-success-teal">Local-first processing</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {businessTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              to={tool.href}
              key={tool.title}
              className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
              </div>

              <h2 className="text-xl font-semibold text-heading-navy mb-2">{tool.title}</h2>
              <p className="text-base text-on-surface-variant mb-6">{tool.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {tool.tags.map((tag) => (
                  <span key={tag} className="bg-surface-container-low text-heading-navy text-xs font-medium px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
