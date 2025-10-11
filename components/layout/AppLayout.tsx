"use client";

import { ReactNode } from "react";
import MainSidebar from "./MainSidebar";
import { useSocket } from "@/hooks/useSocket";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Initialize socket connection at app level so it persists across pages
  useSocket();
  
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b141a]">
      {/* Main Navigation Sidebar */}
      <MainSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
}
