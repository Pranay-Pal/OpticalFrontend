import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import React from "react"; // Import React for React.ReactNode

interface DashboardLayoutProps {
  navItems: any[];
  title: string;
  sidebarLogo?: React.ReactNode; // New prop for sidebar logo
  sidebarTitle?: string; // New prop for sidebar title
  sidebarActiveLinkClassName?: string; // New prop for sidebar active link styling
  sidebarQuickStats?: React.ReactNode; // New prop for sidebar quick stats
  headerUserAvatarFallback?: React.ReactNode; // New prop for header user avatar fallback
  children: React.ReactNode;
}

export default function DashboardLayout({
  navItems,
  title,
  sidebarLogo,
  sidebarTitle,
  sidebarActiveLinkClassName,
  sidebarQuickStats,
  headerUserAvatarFallback,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems}
        logo={sidebarLogo}
        title={sidebarTitle}
        activeLinkClassName={sidebarActiveLinkClassName}
        quickStats={sidebarQuickStats}
      />
      <div className="md:ml-80">
        <Header setSidebarOpen={setSidebarOpen} title={title} userAvatarFallback={headerUserAvatarFallback} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}