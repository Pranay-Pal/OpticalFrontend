import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Link, useLocation } from 'react-router';
import { Users, FileText, LogOut, Stethoscope } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

interface SidebarProps { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void; }

interface NavItem { label: string; to: string; icon: any; description: string; }
interface NavSection { category: string; items: NavItem[]; }

const nav: Array<NavItem | NavSection> = [
  { label: 'Overview', to: '/doctor-dashboard', icon: Stethoscope, description: 'Dashboard overview' },
  { label: 'Patients', to: '/doctor-dashboard/patients', icon: Users, description: 'Patient list' },
  { label: 'Prescriptions', to: '/doctor-dashboard/prescriptions', icon: FileText, description: 'Manage prescriptions' },
];

function SidebarContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.to);
    return (
      <Button key={item.to} variant="ghost" className={`group w-full justify-start gap-3 mb-2 h-12 rounded-xl pl-2 clay ${active ? 'ring-1 ring-primary/25' : 'hover:ring-1 hover:ring-primary/15'}`} asChild>
        <Link to={item.to} className="relative flex items-center gap-3 w-full">
          <span className={`absolute left-0 h-8 w-1 rounded-r bg-primary transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          <Icon className="h-4 w-4 flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
          </div>
        </Link>
      </Button>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl clay flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-brand-gradient">Doctor Portal</h2>
        </div>
      </div>
      <div className="flex-1 px-4 h-full overflow-y-auto custom-sidebar-scroll">
        <div className="space-y-6 pb-24 pt-1">
          {nav.map((entry, i) => (
            'items' in entry ? (
              <div key={i}>
                <div className="px-3 py-2"><h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{entry.category}</h3></div>
                <div className="space-y-1">{entry.items.map(renderItem)}</div>
                {i < nav.length - 1 && <Separator className="my-4" />}
              </div>
            ) : (
              renderItem(entry)
            )
          ))}
        </div>
        <div className="p-4 pt-0">
          <Button variant="destructive" className="w-full" onClick={() => dispatch(logout())}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50 border-r border-sidebar-border bg-sidebar h-screen" aria-label="Primary">
        <SidebarContent />
      </aside>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar flex flex-col h-screen" aria-label="Mobile navigation" aria-modal="true">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
