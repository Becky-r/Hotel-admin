'use client';

import { useState } from 'react';
import { getBookings, saveBooking, deleteBooking, getAvailableRooms } from '@/lib/db';
import { Booking } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus, Check, Clock, XCircle, Edit2 } from 'lucide-react';
import BookingForm from '@/components/forms/booking-form';

export default function BookingManagement() {
  const [bookings, setBookings] = useState(getBookings());
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleAddBooking = () => {
    setEditingBooking(null);
    setShowForm(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleSaveBooking = (booking: Booking) => {
    saveBooking(booking);
    setBookings(getBookings());
    setShowForm(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(id);
      setBookings(getBookings());
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = newStatus;
      saveBooking(booking);
      setBookings(getBookings());
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'checked-in':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (showForm) {
    return (
      <BookingForm
        booking={editingBooking}
        onSave={handleSaveBooking}
        onCancel={() => {
          setShowForm(false);
          setEditingBooking(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings Management</h1>
          <p className="text-muted-foreground mt-1">Manage all guest bookings and reservations</p>
        </div>
        <Button onClick={handleAddBooking} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by name, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No bookings found. Create a new booking to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map(booking => (
            <Card key={booking.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Name</p>
                    <p className="font-semibold text-foreground">{booking.guestName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{booking.guestEmail}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Dates</p>
                    <p className="font-semibold text-foreground">{booking.checkInDate}</p>
                    <p className="text-xs text-muted-foreground">to {booking.checkOutDate}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(booking.status)}
                      <span className="font-semibold text-foreground capitalize">{booking.status}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-semibold text-foreground">${booking.totalPrice}</p>
                    <p className="text-xs text-muted-foreground capitalize">{booking.bookingType}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBooking(booking)}
                      className="gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
