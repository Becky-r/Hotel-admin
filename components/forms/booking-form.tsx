'use client';

import { useState, useMemo } from 'react';
import { Booking } from '@/lib/types';
import { getAvailableRooms, getRoomById } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface BookingFormProps {
  booking?: Booking | null;
  onSave: (booking: Booking) => void;
  onCancel: () => void;
}

export default function BookingForm({ booking, onSave, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState<Partial<Booking>>(
    booking || {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      roomId: '',
      checkInDate: new Date().toISOString().split('T')[0],
      checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      numberOfGuests: 1,
      totalPrice: 0,
      bookingType: 'manual',
      paymentStatus: 'pending',
    }
  );

  const availableRooms = useMemo(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      return getAvailableRooms(formData.checkInDate, formData.checkOutDate);
    }
    return [];
  }, [formData.checkInDate, formData.checkOutDate]);

  const calculatePrice = useMemo(() => {
    if (!formData.roomId || !formData.checkInDate || !formData.checkOutDate) return 0;

    const room = getRoomById(formData.roomId);
    if (!room) return 0;

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    return room.currentPrice * nights;
  }, [formData.roomId, formData.checkInDate, formData.checkOutDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: Booking = {
      id: booking?.id || Math.random().toString(36).substr(2, 9),
      guestName: formData.guestName || '',
      guestEmail: formData.guestEmail || '',
      guestPhone: formData.guestPhone || '',
      roomId: formData.roomId || '',
      checkInDate: formData.checkInDate || '',
      checkOutDate: formData.checkOutDate || '',
      status: (formData.status as any) || 'pending',
      numberOfGuests: formData.numberOfGuests || 1,
      totalPrice: calculatePrice,
      bookingType: (formData.bookingType as any) || 'manual',
      specialRequests: formData.specialRequests,
      paymentStatus: (formData.paymentStatus as any) || 'pending',
      createdAt: booking?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newBooking);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{booking ? 'Edit Booking' : 'Create New Booking'}</h1>
          <p className="text-muted-foreground mt-1">
            {booking ? 'Update booking details' : 'Add a new guest booking or walk-in'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guest Information</CardTitle>
          <CardDescription>Enter guest details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Guest Name *</label>
                <Input
                  value={formData.guestName || ''}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.guestEmail || ''}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone *</label>
                <Input
                  type="tel"
                  value={formData.guestPhone || ''}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Guests *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.numberOfGuests || 1}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-6">
              <h3 className="font-semibold text-foreground">Booking Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in Date *</label>
                  <Input
                    type="date"
                    value={formData.checkInDate || ''}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out Date *</label>
                  <Input
                    type="date"
                    value={formData.checkOutDate || ''}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    required
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room *</label>
                  <Select value={formData.roomId || ''} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          Room {room.roomNumber} - {room.roomType} (${room.currentPrice}/night)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availableRooms.length === 0 && (
                    <p className="text-xs text-yellow-600">No rooms available for selected dates</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Booking Type *</label>
                  <Select value={formData.bookingType || 'manual'} onValueChange={(value) => setFormData({ ...formData, bookingType: value as any })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="walkin">Walk-in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status *</label>
                  <Select value={formData.status || 'pending'} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="checked-out">Checked Out</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Status *</label>
                  <Select value={formData.paymentStatus || 'pending'} onValueChange={(value) => setFormData({ ...formData, paymentStatus: value as any })}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Special Requests</label>
                <Textarea
                  value={formData.specialRequests || ''}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Late arrival, high floor preferred, etc."
                  className="bg-input border-border"
                  rows={3}
                />
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-3xl font-bold text-foreground">${calculatePrice}</p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-border pt-6">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {booking ? 'Update Booking' : 'Create Booking'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
