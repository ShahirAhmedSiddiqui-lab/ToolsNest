import { Link, useLocation } from "react-router-dom";
import { Leaf, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../lib/utils";

interface TopNavProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const TopNav = ({ onToggleSidebar, isSidebarOpen = true }: TopNavProps) => {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: "PDF Tools", href: "/pdf-tools" },
    { name: "Image Lab", href: "/image-tools" },
    { name: "AI Tools", href: "/ai-tools" },
    { name: "Dev Tools", href: "/developer-tools" },
    { name: "Student Hub", href: "/student-tools" },
    { name: "Health", href: "/calculators" },
    { name: "Business", href: "/business" },
  ];

  return (
    <nav className="bg-surface-container-lowest border-b border-border-slate sticky top-0 w-full z-50 flex justify-center">
      <div className="w-full max-w-[1440px] flex justify-between lg:justify-center flex-wrap gap-y-4 items-center px-margin-mobile md:px-margin-desktop h-auto min-h-16 py-3 relative">
        <div className="flex items-center lg:absolute lg:left-0 lg:ml-margin-desktop h-full z-10 shrink-0 gap-3">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-on-surface-variant hover:text-heading-navy hover:bg-surface-container-low transition-colors"
              title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
          )}
          <Link to="/" className="font-semibold text-2xl text-heading-navy flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary mix-blend-multiply" fill="currentColor" />
            ToolsNest
          </Link>
        </div>
        
        <div className="hidden lg:flex gap-4 xl:gap-8 h-full">
          {links.map((link) => {
            const isActive = path.startsWith(link.href) && link.href !== "/";
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center h-full",
                  isActive
                    ? "text-primary border-b-2 border-primary mt-[2px]"
                    : "text-on-surface-variant hover:text-primary mt-[2px] border-b-2 border-transparent"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center lg:absolute lg:right-0 lg:mr-margin-desktop h-full z-10 shrink-0">
          <Link to="/all-tools" className="text-sm font-medium text-on-primary bg-primary px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
            All Tools
          </Link>
        </div>
      </div>
    </nav>
  );
};
