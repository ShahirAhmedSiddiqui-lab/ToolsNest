import { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { fuzzyMatch } from "../lib/utils";
import { tools } from "../tools/registry";

export const AllTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    const query = (location.state as { searchQuery?: unknown } | null)?.searchQuery;
    if (typeof query === "string") setSearchTerm(query);
  }, [location.state]);

  const filteredTools = tools.filter((tool) =>
    fuzzyMatch(tool.name, searchTerm) ||
    fuzzyMatch(tool.category, searchTerm) ||
    fuzzyMatch(tool.description, searchTerm),
  );

  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <h1 className="text-3xl md:text-4xl font-bold text-heading-navy mb-6">All Tools</h1>
        <label className="relative block max-w-xl">
          <span className="sr-only">Search tools</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            className="block min-h-12 w-full rounded-xl border border-border-slate bg-surface-container-lowest py-3 pl-11 pr-4 text-sm text-heading-navy outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Search tools by name, category, or description..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={tool.path}
              state={{ fromAllTools: true }}
              className="group flex flex-col gap-4 rounded-xl border border-border-slate bg-surface-container-lowest p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-low text-primary transition-colors group-hover:bg-primary/10">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors group-hover:bg-primary group-hover:text-white">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/80">{tool.category}</div>
                <h2 className="mb-2 text-xl font-bold text-heading-navy transition-colors group-hover:text-primary">{tool.name}</h2>
                <p className="line-clamp-2 text-sm text-on-surface-variant">{tool.description}</p>
              </div>
            </Link>
          );
        })}
        {filteredTools.length === 0 && (
          <p className="col-span-full py-12 text-center text-on-surface-variant" role="status">
            No tools found matching “{searchTerm}”.
          </p>
        )}
      </div>
    </div>
  );
};
