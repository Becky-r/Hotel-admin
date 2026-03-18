'use client';

import { useState, useMemo } from 'react';
import { Booking, BookingRoom } from '@/lib/types';
import { getAvailableRooms } from '@/lib/db';
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
import { ArrowLeft, Plus, X } from 'lucide-react';

interface BookingFormProps {
  booking?: Partial<Booking> | null;
  onSave: (booking: Booking) => void;
  onCancel: () => void;
}

export default function BookingForm({ booking, onSave, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState<Partial<Booking> & {
    firstName: string;
    lastName: string;
    companyName?: string;
    tinNumber?: string;
    adults: number;
    children: number;
    rooms: BookingRoom[];
  }>(() => {
    if (booking) {
      const [firstName = '', ...lastParts] = booking.guestName?.split(' ') || [];
      const lastName = lastParts.join(' ');
      return {
        ...booking,
        firstName,
        lastName,
        companyName: booking.companyName || '',
        tinNumber: booking.tinNumber || '',
        adults: booking.adults || booking.numberOfGuests || 1,
        children: booking.children || 0,
        rooms: booking.rooms || (booking.roomId ? [{
          id: booking.roomId,
          roomNumber: booking.roomNumber || '',
          roomType: booking.roomType || '',
          price: booking.totalPrice || 0
        }] : []),
      };
    }
    return {
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
      firstName: '',
      lastName: '',
      specialRequests: '',
      companyName: '',
      tinNumber: '',
      adults: 1,
      children: 0,
      rooms: [],
    };
  });

  const [currentRoomNumber, setCurrentRoomNumber] = useState('');
  const [currentRoomType, setCurrentRoomType] = useState('');

  const availableRooms = useMemo(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      return getAvailableRooms(formData.checkInDate, formData.checkOutDate);
    }
    return [];
  }, [formData.checkInDate, formData.checkOutDate]);

  // Filter available rooms (not already selected)
  const availableRoomsFiltered = useMemo(() => {
    const selectedRoomIds = formData.rooms.map(r => r.id);
    return availableRooms.filter(room => !selectedRoomIds.includes(room.id));
  }, [availableRooms, formData.rooms]);

  // Filter room types for selected room number
  const roomTypesForSelectedNumber = useMemo(() => {
    if (!currentRoomNumber) return [];
    return availableRoomsFiltered.filter(room => room.roomNumber === currentRoomNumber);
  }, [availableRoomsFiltered, currentRoomNumber]);

  // Calculate total price for all selected rooms
  const calculateTotalPrice = useMemo(() => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    return formData.rooms.reduce((total, room) => {
      const roomData = availableRooms.find(r => r.id === room.id);
      return total + (roomData ? roomData.currentPrice * nights : room.price * nights);
    }, 0);
  }, [formData.rooms, formData.checkInDate, formData.checkOutDate, availableRooms]);

  // Add room to selection
  const addRoom = () => {
    if (!currentRoomNumber || !currentRoomType) return;

    const room = availableRoomsFiltered.find(r => r.roomNumber === currentRoomNumber && r.roomType === currentRoomType);
    if (!room) return;

    const bookingRoom: BookingRoom = {
      id: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.currentPrice,
    };

    setFormData({
      ...formData,
      rooms: [...formData.rooms, bookingRoom],
      roomId: formData.rooms.length === 0 ? room.id : formData.roomId, // Set primary room ID
      roomNumber: formData.rooms.length === 0 ? room.roomNumber : formData.roomNumber, // Set primary room number
      roomType: formData.rooms.length === 0 ? room.roomType : formData.roomType, // Set primary room type
    });

    setCurrentRoomNumber('');
    setCurrentRoomType('');
  };

  // Remove room from selection
  const removeRoom = (roomId: string) => {
    const updatedRooms = formData.rooms.filter(r => r.id !== roomId);
    setFormData({
      ...formData,
      rooms: updatedRooms,
      // Update primary room if the primary room was removed
      roomId: updatedRooms.length > 0 ? updatedRooms[0].id : '',
      roomNumber: updatedRooms.length > 0 ? updatedRooms[0].roomNumber : '',
      roomType: updatedRooms.length > 0 ? updatedRooms[0].roomType : '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rooms.length === 0) {
      alert('Please select at least one room');
      return;
    }

    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();

    const newBooking: Booking = {
      id: booking?.id || Math.random().toString(36).substr(2, 9),
      guestName: fullName,
      guestEmail: formData.guestEmail || '',
      guestPhone: formData.guestPhone || '',
      roomId: formData.roomId || formData.rooms[0].id,
      checkInDate: formData.checkInDate || '',
      checkOutDate: formData.checkOutDate || '',
      status: (formData.status as any) || 'pending',
      numberOfGuests: (formData.adults || 0) + (formData.children || 0),
      totalPrice: calculateTotalPrice,
      bookingType: (formData.bookingType as any) || 'manual',
      specialRequests: formData.specialRequests,
      paymentStatus: (formData.paymentStatus as any) || 'pending',
      companyName: formData.companyName,
      tinNumber: formData.tinNumber,
      adults: formData.adults,
      children: formData.children,
      roomNumber: formData.roomNumber || formData.rooms[0].roomNumber,
      roomType: formData.roomType || formData.rooms[0].roomType,
      rooms: formData.rooms,
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
          <p className="text-muted-foreground mt-1">{booking ? 'Update booking details' : 'Add a new guest booking or walk-in'}</p>
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
              {/* First & Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name *</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name *</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                  required
                  className="bg-input border-border"
                />
              </div>

              {/* Company & TIN */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="ABC Corp"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">TIN Number</label>
                <Input
                  value={formData.tinNumber}
                  onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                  placeholder="123-456-789"
                  className="bg-input border-border"
                />
              </div>

              {/* Email & Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.guestEmail}
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
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="bg-input border-border"
                />
              </div>

              {/* Adults & Children */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Adults *</label>
                <Input
                  type="number"
                  min={0}
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Children</label>
                <Input
                  type="number"
                  min={0}
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                  className="bg-input border-border"
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="border-t border-border pt-6 space-y-6">
              <h3 className="font-semibold text-foreground">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in Date *</label>
                  <Input
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out Date *</label>
                  <Input
                    type="date"
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    required
                    className="bg-input border-border"
                  />
                </div>
              </div>

              {/* Room Selection */}
<div className="space-y-6">
  <div className="flex items-center justify-between border-b border-border pb-2">
    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
      Room Inventory ({formData.rooms.length})
    </h4>
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className="text-muted-foreground font-normal">Subtotal:</span>
      <span className="text-foreground">${calculateTotalPrice.toFixed(2)}</span>
    </div>
  </div>

  {/* Selected Rooms Table-style List */}
  <div className="space-y-1">
    {formData.rooms.length > 0 ? (
      formData.rooms.map((room) => (
        <div 
          key={room.id} 
          className="group flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border hover:bg-secondary/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
              {room.roomNumber}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{room.roomType}</p>
              <p className="text-xs text-muted-foreground">${room.price.toFixed(2)} per night</p>
            </div>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeRoom(room.id)}
            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-border rounded-xl bg-secondary/10">
        <p className="text-sm text-muted-foreground">No rooms selected yet</p>
      </div>
    )}
  </div>

  {/* Add Room Section - Streamlined Bar */}
  <div className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
      <div className="md:col-span-5 space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase">Room Selection</label>
        <Select
          value={currentRoomNumber}
          onValueChange={(value) => {
            setCurrentRoomNumber(value);
            setCurrentRoomType('');
          }}
        >
          <SelectTrigger className="bg-background border-border h-11">
            <SelectValue placeholder="Pick a room..." />
          </SelectTrigger>
          <SelectContent>
            {availableRoomsFiltered.map(room => (
              <SelectItem key={room.id} value={room.roomNumber}>
                <span className="font-medium">{room.roomNumber}</span>
                <span className="ml-2 text-muted-foreground">({room.roomType})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-4 space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase">Rate Type</label>
        <Select
          value={currentRoomType}
          onValueChange={setCurrentRoomType}
          disabled={!currentRoomNumber}
        >
          <SelectTrigger className="bg-background border-border h-11">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {roomTypesForSelectedNumber.map(room => (
              <SelectItem key={room.id} value={room.roomType}>
                {room.roomType} — ${room.currentPrice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-3">
        <Button
          type="button"
          onClick={addRoom}
          disabled={!currentRoomNumber || !currentRoomType}
          className="w-full h-11 gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add to Booking
        </Button>
      </div>
    </div>
  </div>
</div>

              {/* Booking Type, Status & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Booking Type *</label>
                  <Select
                    value={formData.bookingType || 'manual'}
                    onValueChange={v => setFormData({ ...formData, bookingType: v as any })}
                  >
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status *</label>
                  <Select
                    value={formData.status || 'pending'}
                    onValueChange={v => setFormData({ ...formData, status: v as any })}
                  >
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
                  <Select
                    value={formData.paymentStatus || 'pending'}
                    onValueChange={v => setFormData({ ...formData, paymentStatus: v as any })}
                  >
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

              
                    {/* ✅ USER AMOUNT FIELD */}
            <div>
              <label className="text-sm font-medium">Custom Amount</label>
              <Input
                type="number"
                value={formData.userAmount || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    userAmount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Override total price"
              />
            </div>
              {/* Total Price */}
              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-3xl font-bold text-foreground">${calculateTotalPrice}</p>
              </div>
            </div>

            {/* Actions */}
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