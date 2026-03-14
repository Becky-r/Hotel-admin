'use client';

import { LogOut, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export default function Header({ userName, userRole, onLogout }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Welcome back, {userName}</h2>
          <p className="text-sm text-muted-foreground capitalize">Role: {userRole}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
