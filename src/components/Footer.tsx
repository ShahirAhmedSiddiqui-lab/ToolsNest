import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-border-slate w-full z-10 relative mt-auto">
      <div className="w-full mx-auto flex justify-center px-margin-mobile md:px-margin-desktop">
        <div className="w-full max-w-[1440px] py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="mb-4 md:mb-0 text-center md:text-left flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary mix-blend-multiply" fill="currentColor" />
            <span className="text-sm font-bold text-heading-navy block md:inline">© 2026 ToolsNest. Security through clarity.</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-on-surface-variant">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Security Whitepaper</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-primary transition-colors">API Docs</Link>
            <Link to="#" className="hover:text-primary transition-colors">Support</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
