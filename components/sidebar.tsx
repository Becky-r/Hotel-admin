'use client';

import { 
  Calendar, LayoutGrid, Users, User, Home, 
  BarChart3, List, Gift, ChevronLeft, ChevronRight, 
  Settings, Sparkles, LogOut, Sun, Moon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import confetti from 'canvas-confetti';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
  userRole: string;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, userRole, isMinimized, onToggleMinimize }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const reservationNotifications = 3;

  const playClick = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.2;
    audio.play();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.1, y: 0.5 },
      colors: ['#4f46e5', '#818cf8', '#c7d2fe'],
      zIndex: 100
    });
  };

  const handleNavClick = (id: string) => {
    playClick();
    if (id === 'overview') triggerConfetti();
    onSectionChange(id);
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'bookings', label: 'Reservation Desk', icon: Calendar, badge: reservationNotifications },
    { id: 'rooms', label: 'Inventory', icon: LayoutGrid },
    { id: 'amenities', label: 'Property Assets', icon: List },
    { id: 'services', label: 'Guest Services', icon: Gift },
    ...(userRole === 'owner' || userRole === 'manager'
      ? [{ id: 'staff', label: 'Human Resources', icon: Users }]
      : []),
    ...(userRole === 'owner' || userRole === 'manager' || userRole === 'receptionist'
      ? [{ id: 'reports', label: 'Analytics', icon: BarChart3 }]
      : []),
  ];

  const isAccountActive = activeSection === 'account';

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 h-screen flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50",
        "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50",
        "shadow-[20px_0_50px_rgba(0,0,0,0.05)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.3)]",
        isMinimized ? "w-20" : "w-64"
      )}
    >
      {/* 3D Toggle Handle */}
      <button
        onClick={() => { playClick(); onToggleMinimize(); }}
        className="absolute -right-4 top-12 bg-indigo-600 text-white rounded-full p-2 shadow-[0_4px_10px_rgba(79,70,229,0.4)] hover:scale-110 active:scale-95 transition-all z-50 border-2 border-white dark:border-slate-900"
      >
        {isMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* 3D Header */}
      <div className={cn("p-8 flex items-center shrink-0", isMinimized ? "justify-center" : "gap-4")}>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-12 h-12 shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_10px_20px_rgba(79,70,229,0.3)] transform-gpu transition-transform group-hover:rotate-12">
            <Sparkles className="text-white animate-pulse" size={26} />
          </div>
        </div>
        {!isMinimized && (
          <div className="overflow-hidden animate-in slide-in-from-left-4 duration-500">
            <h1 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Kerawi</h1>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black tracking-[0.3em] mt-1">HOTEL OS</p>
          </div>
        )}
      </div>

      {/* 3D Navigation Body */}
      <nav className="flex-1 px-4 space-y-3 overflow-y-auto no-scrollbar py-6">
        {menuItems.map(item => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "group relative w-full flex items-center transition-all duration-300 rounded-2xl",
                isActive 
                  ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.5)] scale-[1.02] translate-x-1" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:translate-x-1",
                isMinimized ? "justify-center h-14 w-12 mx-auto" : "px-4 py-4 gap-4"
              )}
            >
              <div className="relative">
                <Icon 
                  size={24} 
                  className={cn(
                    "shrink-0 transition-transform duration-500", 
                    isActive ? "scale-110 rotate-[5deg] drop-shadow-md" : "group-hover:scale-110"
                  )} 
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[11px] font-black text-white border-2 border-white dark:border-slate-950 shadow-lg animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>
              
              {!isMinimized && <span className="text-[16px] font-bold tracking-tight">{item.label}</span>}

              {/* Hover Glow Effect */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-50 pointer-events-none" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3D Footer Card */}
      <div className="mt-auto p-4">
        <div className={cn(
          "bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-2 transition-all duration-300",
          isMinimized ? "items-center" : "ring-1 ring-slate-200 dark:ring-slate-800"
        )}>
          <button
            onClick={() => handleNavClick('account')}
            className={cn(
              "group relative w-full flex items-center rounded-2xl transition-all",
              isAccountActive ? "bg-white dark:bg-slate-800 shadow-xl scale-[1.05]" : "hover:bg-white/50 dark:hover:bg-slate-800/50",
              isMinimized ? "justify-center h-12 w-12" : "p-3 gap-3"
            )}
          >
            <div className={cn(
              "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-500 shadow-inner",
              isAccountActive ? "bg-indigo-600 text-white rotate-12" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
            )}>
              <User size={22} />
            </div>
            {!isMinimized && (
              <div className="text-left flex-1 overflow-hidden">
                <p className="text-[14px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">Admin</p>
                <p className="text-[10px] text-indigo-600 font-bold">{userRole}</p>
              </div>
            )}
          </button>

          <div className={cn("flex items-center mt-2", isMinimized ? "flex-col gap-4 py-2" : "justify-around p-2")}>
            <button 
              onClick={() => { playClick(); setTheme(theme === 'dark' ? 'light' : 'dark'); }}
              className="text-slate-400 hover:text-indigo-600 hover:rotate-12 transition-all p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={playClick}
              className="text-slate-400 hover:text-red-500 hover:-rotate-12 transition-all p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        {!isMinimized && (
          <p className="text-center text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.7em] mt-4 opacity-80 animate-pulse">
  @Sabih Software
</p>
        )}
      </div>
    </aside>
  );
}