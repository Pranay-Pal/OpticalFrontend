import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router";
import { UserCheck } from "lucide-react";
import React from "react"; // Import React for React.ReactNode

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

interface NavSection {
  category?: string;
  items?: NavItem[];
  label?: string;
  to?: string;
  icon?: any;
  description?: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navItems: NavSection[];
  logo?: React.ReactNode;
  title?: string;
  activeLinkClassName?: string; // New prop for active link styling
  quickStats?: React.ReactNode; // New prop for quick stats
}

function SidebarContent({ navItems, logo, title, activeLinkClassName, quickStats }: { navItems: NavSection[], logo?: React.ReactNode, title?: string, activeLinkClassName?: string, quickStats?: React.ReactNode }) {
  const location = useLocation();

  const isActiveLink = (to: string) => {
    // Handle exact match for root dashboard path, and startsWith for sub-paths
    if (to === "/shop-admin-dashboard" || to === "/staff-dashboard") {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    const isActive = isActiveLink(item.to);

    return (
      <Button
        key={item.to}
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start gap-3 mb-1 h-12 ${
          isActive
            ? activeLinkClassName || "bg-primary text-primary-foreground shadow-sm" // Use new prop or default
            : "hover:bg-accent hover:text-accent-foreground"
        }`}
        asChild
      >
        <Link to={item.to} className="flex items-center gap-3">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
          </div>
          {item.badge && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </Button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-verdigris to-celeste flex items-center justify-center">
            {logo || <UserCheck className="h-4 w-4 text-white" />}
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-non-photo-blue to-celeste bg-clip-text text-transparent">
            {title || "OpticalShop"}
          </h2>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          {navItems.map((section, index) => {
            if (section.category && section.items) {
              return (
                <div key={index}>
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.category}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {section.items.map(renderNavItem)}
                  </div>
                  {index < navItems.length - 1 && <Separator className="my-4" />}
                </div>
              );
            } else {
              return renderNavItem(section);
            }
          })}
        </div>
        {quickStats && ( // Render quickStats if provided
          <>
            <Separator className="my-4" />
            {quickStats}
          </>
        )}
      </ScrollArea>
    </div>
  );
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, navItems, logo, title, activeLinkClassName, quickStats }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-50 bg-white border-r">
        <SidebarContent navItems={navItems} logo={logo} title={title} activeLinkClassName={activeLinkClassName} quickStats={quickStats} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent navItems={navItems} logo={logo} title={title} activeLinkClassName={activeLinkClassName} quickStats={quickStats} />
        </SheetContent>
      </Sheet>
    </>
  );
}