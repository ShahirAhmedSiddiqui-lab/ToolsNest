import { Link, useLocation } from "react-router-dom";
import { 
  FileText, Image as ImageIcon, Brain, Activity, 
  Briefcase, Shield, Lock, GraduationCap, Code 
} from "lucide-react";
import { cn } from "../lib/utils";

interface SideNavProps {
  isOpen?: boolean;
}

export const SideNav = ({ isOpen = true }: SideNavProps) => {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { name: "PDF Suite", icon: FileText, href: "/pdf-tools" },
    { name: "Image Lab", icon: ImageIcon, href: "/image-tools" },
    { name: "AI Writing", icon: Brain, href: "/ai-tools" },
    { name: "Dev Tools", icon: Code, href: "/developer-tools" },
    { name: "Student Hub", icon: GraduationCap, href: "/student-tools" },
    { name: "Health Tools", icon: Activity, href: "/calculators" },
    { name: "Business Gen", icon: Briefcase, href: "/business" },
  ];

  if (!isOpen) return null;

  return (
    <aside className="sticky top-16 h-[calc(100vh-64px)] w-64 p-4 flex-col bg-surface border-r border-border-slate z-40 hidden lg:flex shrink-0 transition-all duration-300">
      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = path.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-base",
                isActive 
                  ? "bg-surface-container text-primary font-bold shadow-sm" 
                  : "text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-current opacity-20")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col pb-4">
        <div className="flex justify-between gap-2 px-2">
          <Link to="#" className="flex-1 bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors flex justify-center items-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-border-slate">
            <Shield className="w-3.5 h-3.5" /> Security
          </Link>
          <Link to="#" className="flex-1 bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors flex justify-center items-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-border-slate">
            <Lock className="w-3.5 h-3.5" /> Privacy
          </Link>
        </div>
      </div>
    </aside>
  );
};
