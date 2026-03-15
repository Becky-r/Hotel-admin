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

type Section = 'overview' | 'bookings' | 'rooms' | 'amenities' | 'services' | 'staff' | 'reports';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('overview');

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
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} userRole={user.role} />
        <main className="flex-1 flex flex-col">
          <Header userName={user.name} userRole={user.role} onLogout={onLogout} />
          <div className="flex-1 overflow-auto">
            <div className="p-6 max-w-7xl mx-auto">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
