'use client';

import { Calendar, LayoutGrid, Users, FileText, Home, BarChart3, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
  userRole: string;
}

export default function Sidebar({ activeSection, onSectionChange, userRole }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: LayoutGrid },
    ...(userRole === 'owner' || userRole === 'manager'
      ? [{ id: 'staff', label: 'Staff', icon: Users }]
      : []),
    ...(userRole === 'owner' || userRole === 'manager' || userRole === 'receptionist'
      ? [{ id: 'reports', label: 'Reports', icon: BarChart3 }]
      : []),
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold">
            HE
          </div>
          <div>
            <h1 className="font-bold text-lg">Hotel Management</h1>
            <p className="text-xs text-sidebar-foreground/60">Kerawi International Hotel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60 mb-3">
          <p className="font-semibold mb-1">Current Version</p>
          <p>1.0.0 - Beta</p>
          <p>@Sabih Software Design company</p>
        </div>
      </div>
    </aside>
  );
}
