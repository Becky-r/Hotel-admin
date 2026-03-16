'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import BookingManagement from '@/components/sections/booking-management';
import RoomManagement from '@/components/sections/room-management';
import AmenitiesManagement from '@/components/sections/amenities-management';
import ServicesManagement from '@/components/sections/services-management';
import StaffManagement from '@/components/sections/staff-management';
import ReportsAnalytics from '@/components/sections/reports-analytics';
import DashboardOverview from '@/components/sections/dashboard-overview';
import Settings from '@/components/sections/settings';
import Account from '@/components/sections/account';

type Section =
  | 'overview'
  | 'bookings'
  | 'rooms'
  | 'amenities'
  | 'services'
  | 'staff'
  | 'reports'
  | 'account'
  | 'settings';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [isMinimized, setIsMinimized] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'bookings':
        return <BookingManagement />;
      case 'rooms':
        return <RoomManagement />;
      case 'amenities':
        return <AmenitiesManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'account':
        return <Account user={user} />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} userRole={user.role} isMinimized={isMinimized} onToggleMinimize={() => setIsMinimized(!isMinimized)} />
        <main className={`${isMinimized ? 'ml-16' : 'ml-64'} flex-1 flex flex-col`}>
          <Header userName={user.name} userRole={user.role} onLogout={onLogout} isMinimized={isMinimized} />
          <div className="flex-1 overflow-auto mt-16">
            <div className="p-6 max-w-7xl mx-auto">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
