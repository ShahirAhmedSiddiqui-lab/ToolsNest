import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { Footer } from "./Footer";

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-surface p-2 md:p-3 gap-2 md:gap-3">
      <TopNav onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 w-full relative transition-all duration-300 gap-2 md:gap-3">
        <SideNav isOpen={isSidebarOpen} />
        <main className="flex-1 w-full flex flex-col min-h-[calc(100vh-104px)] min-w-0">
          <div className="flex-1 max-w-[1440px] mx-auto relative px-margin-mobile md:px-margin-desktop w-full">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const SimpleLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface p-2 md:p-3 gap-2 md:gap-3">
      <TopNav />
      <main className="flex-1 flex flex-col w-full relative">
        <div className="flex-1 max-w-[1440px] mx-auto relative px-margin-mobile md:px-margin-desktop w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
