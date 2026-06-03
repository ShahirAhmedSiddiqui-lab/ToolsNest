import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { Footer } from "./Footer";

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 w-full relative transition-all duration-300">
        <SideNav isOpen={isSidebarOpen} />
        <main className="flex-1 w-full flex flex-col min-h-[calc(100vh-64px)] min-w-0">
          <div className="flex-1 max-w-[1440px] mx-auto relative px-margin-mobile md:px-margin-desktop w-full">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export const SimpleLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 flex flex-col w-full max-w-[1440px] mx-auto relative px-margin-mobile md:px-margin-desktop">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
