'use client';

import { Calendar, Plus, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBookings } from '@/lib/db';
import { useMemo } from 'react';

interface MobileQuickActionsProps {
  onNewBooking: () => void;
  onCheckIn: () => void;
  onViewBookings: () => void;
}

export default function MobileQuickActions({
  onNewBooking,
  onCheckIn,
  onViewBookings,
}: MobileQuickActionsProps) {
  const bookings = getBookings();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => {
      return b.checkInDate === today;
    });

    return {
      todayCheckIns: todayBookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
    };
  }, [bookings]);

  return (
    <div className="md:hidden space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={onNewBooking}>
          <CardContent className="p-4 text-center">
            <Plus className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-semibold">New Booking</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={onCheckIn}>
          <CardContent className="p-4 text-center">
            <Check className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-semibold">Check-in</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Today's Check-ins</span>
              <span className="text-lg font-bold text-primary">{stats.todayCheckIns}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending Bookings</span>
              <span className="text-lg font-bold text-yellow-600">{stats.pendingBookings}</span>
            </div>
            <Button onClick={onViewBookings} variant="outline" className="w-full mt-2">
              <Calendar className="w-4 h-4 mr-2" />
              View All Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
