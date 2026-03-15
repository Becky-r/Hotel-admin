'use client'

import { useState } from 'react'
import { Booking, BookingHistory } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Plus, Check, Clock, XCircle, Edit2 } from 'lucide-react'
import BookingForm from '@/components/forms/booking-form'

/* ---------------- TYPES ---------------- */

/* ---------------- MOCK DB FUNCTIONS ---------------- */
export const getBookings = (): Booking[] => {
  const data = localStorage.getItem('bookings')
  return data ? JSON.parse(data) : []
}

export const saveBooking = (booking: Booking, updatedBy: string = 'Admin') => {
  const allBookings = getBookings()
  const index = allBookings.findIndex(b => b.id === booking.id)

  const changes =
    index !== -1
      ? Object.keys(booking)
          .filter(
            key => booking[key as keyof Booking] !== allBookings[index][key as keyof Booking]
          )
          .map(
            key =>
              `${key} changed from "${allBookings[index][key as keyof Booking]}" to "${booking[key as keyof Booking]}"`
          )
          .join('; ')
      : 'New booking created'

  const historyEntry: BookingHistory = {
    updatedBy,
    timestamp: new Date().toISOString(),
    changes,
  }

  if (index !== -1) {
    booking.history = [...(allBookings[index].history || []), historyEntry]
    allBookings[index] = booking
  } else {
    booking.history = [historyEntry]
    allBookings.push(booking)
  }

  localStorage.setItem('bookings', JSON.stringify(allBookings))
}

/* ---------------- COMPONENT ---------------- */
export default function BookingManagement() {
  const [bookings, setBookings] = useState(getBookings())
  const [showForm, setShowForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [historyBooking, setHistoryBooking] = useState<Booking | null>(null)

  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus

    const checkIn = new Date(booking.checkInDate)
    const checkOut = new Date(booking.checkOutDate)
    checkIn.setHours(0, 0, 0, 0)
    checkOut.setHours(0, 0, 0, 0)

    let matchesDate = true

    if (dateFilter === 'checkin-today') {
      matchesDate = checkIn.getTime() === today.getTime() && booking.status === 'confirmed'
    }

    if (dateFilter === 'checkout-today') {
      matchesDate = checkOut.getTime() === today.getTime() && booking.status === 'checked-in'
    }

    if (dateFilter === 'active-guests') {
      matchesDate = checkIn <= today && checkOut > today && booking.status === 'checked-in'
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  /* ---------------- CRUD ---------------- */
  const handleAddBooking = () => {
    setEditingBooking(null)
    setShowForm(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setShowForm(true)
  }

  const handleSaveBooking = (booking: Booking) => {
    saveBooking(booking, 'Admin')
    setBookings(getBookings())
    setShowForm(false)
    setEditingBooking(null)
  }

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return
    const updated = { ...booking, status: newStatus }
    saveBooking(updated, 'Admin')
    setBookings(getBookings())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'checked-in':
        return <Check className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  if (showForm) {
    return (
      <BookingForm
        booking={editingBooking}
        onSave={handleSaveBooking}
        onCancel={() => {
          setShowForm(false)
          setEditingBooking(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bookings Management</h1>
          <p className="text-muted-foreground">Manage guest reservations</p>
        </div>
        <Button onClick={handleAddBooking} className="gap-2">
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
      </div>

      {/* FILTERS */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <Input
            placeholder="Search name, email, phone, booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Date Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="checkin-today">Check-In Today</SelectItem>
              <SelectItem value="checkout-today">Check-Out Today</SelectItem>
              <SelectItem value="active-guests">Active Guests</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* BOOKINGS LIST */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No bookings found</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-6 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Guest</p>
                    <p className="font-semibold">{booking.guestName}</p>
                    <p className="text-xs">{booking.guestEmail}</p>
                    <p className="text-xs">{booking.guestPhone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Dates</p>
                    <p>{booking.checkInDate}</p>
                    <p className="text-xs">to {booking.checkOutDate}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Room(s)</p>
                    {booking.rooms && booking.rooms.length > 0 ? (
                      <div>
                        <p className="font-semibold">{booking.rooms.length} room{booking.rooms.length > 1 ? 's' : ''}</p>
                        <p className="text-xs">{booking.rooms[0].roomNumber} ({booking.rooms[0].roomType})</p>
                        {booking.rooms.length > 1 && (
                          <p className="text-xs text-muted-foreground">
                            +{booking.rooms.length - 1} more
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold">{booking.roomNumber}</p>
                        <p className="text-xs">{booking.roomType}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap col-span-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditBooking(booking)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => setHistoryBooking(booking)}>
                      <Clock className="w-4 h-4" />
                    </Button>

                    {booking.status === 'confirmed' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange(booking.id, 'checked-in')}
                      >
                        Check In
                      </Button>
                    )}

                    {booking.status === 'checked-in' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStatusChange(booking.id, 'checked-out')}
                      >
                        Check Out
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* HISTORY MODAL */}
      <AlertDialog open={!!historyBooking} onOpenChange={() => setHistoryBooking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Booking History</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="p-4 max-h-96 overflow-y-auto">
            {historyBooking?.history?.length ? (
              historyBooking.history.map((h, idx) => (
                <div key={idx} className="mb-2 p-2 border rounded">
                  <p className="text-xs text-gray-500">
                    {new Date(h.timestamp).toLocaleString()} by {h.updatedBy}
                  </p>
                  <p className="text-sm">{h.changes}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No history available</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setHistoryBooking(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}