'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { Plus, Check, Clock, XCircle, Edit2, Search, AlertTriangle } from 'lucide-react'
import BookingForm from '@/components/forms/booking-form'

/* ---------------- MOCK DB FUNCTIONS ---------------- */
export const getBookings = (): Booking[] => {
  if (typeof window === 'undefined') return []
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
  const [bookings, setBookings] = useState<Booking[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [historyBooking, setHistoryBooking] = useState<Booking | null>(null)

  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    setBookings(getBookings())
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const noShowCount = useMemo(() => {
    return bookings.filter(b => {
      const isLate = new Date(b.checkInDate) <= today
      return b.status === 'confirmed' && isLate
    }).length
  }, [bookings, today])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus

    const checkIn = new Date(booking.checkInDate)
    const checkOut = new Date(booking.checkOutDate)
    checkIn.setHours(0, 0, 0, 0)
    checkOut.setHours(0, 0, 0, 0)

    let matchesDate = true
    if (dateFilter === 'checkin-today') {
      matchesDate = checkIn.getTime() === today.getTime() && booking.status === 'confirmed'
    } else if (dateFilter === 'checkout-today') {
      matchesDate = checkOut.getTime() === today.getTime() && booking.status === 'checked-in'
    } else if (dateFilter === 'active-guests') {
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
    const updateBy = newStatus === 'no-show' ? 'System (No Show)' : 'Admin'
    const updated = { ...booking, status: newStatus }
    saveBooking(updated, updateBy)
    setBookings(getBookings())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'checked-in':
        return <Check className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'no-show':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
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
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Reservations</h1>
            {noShowCount > 0 && (
              <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-orange-200 animate-in fade-in zoom-in">
                <AlertTriangle className="w-3 h-3" />
                {noShowCount} PENDING NO-SHOWS
              </div>
            )}
          </div>
          <p className="text-muted-foreground">Manage guest lifecycle and state logs.</p>
        </div>
        <Button onClick={handleAddBooking} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
      </div>

      {/* FILTERS */}
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4 grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Quick Filters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="checkin-today">Check-In Today</SelectItem>
              <SelectItem value="checkout-today">Check-Out Today</SelectItem>
              <SelectItem value="active-guests">Currently In Hotel</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* BOOKINGS LIST */}
      <div className="grid gap-3">
        {filteredBookings.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-16 text-center text-muted-foreground">
              <Search className="w-10 h-10 mx-auto opacity-10 mb-2" />
              <p className="font-medium">No results found for your selection.</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => {
            const isLate = new Date(booking.checkInDate) <= today && booking.status === 'confirmed';

            return (
              <Card key={booking.id} className={`transition-all ${isLate ? 'border-orange-200 bg-orange-50/20' : 'hover:border-primary/40'}`}>
                <CardContent className="p-5">
                  <div className="grid md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">Guest Info</p>
                      <p className="font-bold text-slate-900 leading-none">{booking.guestName}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 truncate">{booking.guestEmail}</p>
                    </div>
                    <div className="md:col-span-2 text-sm">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Stay Period</p>
                      <p className="font-medium">{booking.checkInDate}</p>
                      <p className="text-[11px] text-muted-foreground">to {booking.checkOutDate}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Status</p>
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(booking.status)}
                        <span className={`text-xs font-black uppercase ${
                          booking.status === 'no-show' ? 'text-orange-600' : 
                          booking.status === 'checked-in' ? 'text-green-600' : 'text-slate-600'
                        }`}>
                          {booking.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Assets</p>
                      <p className="text-sm font-bold truncate">
                        {booking.rooms?.[0]?.roomNumber || booking.roomNumber || 'N/A'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Unit Assignment</p>
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="h-8" onClick={() => handleEditBooking(booking)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8" onClick={() => setHistoryBooking(booking)}>
                        <Clock className="w-3.5 h-3.5" />
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 px-4" onClick={() => handleStatusChange(booking.id, 'checked-in')}>
                          Check In
                        </Button>
                      )}
                      {isLate && (
                        <Button size="sm" variant="destructive" className="h-8 bg-orange-600 hover:bg-orange-700 border-none px-4" onClick={() => handleStatusChange(booking.id, 'no-show')}>
                          No Show
                        </Button>
                      )}
                      {booking.status === 'checked-in' && (
                        <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 px-4" onClick={() => handleStatusChange(booking.id, 'checked-out')}>
                          Check Out
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* HISTORY MODAL */}
      <AlertDialog open={!!historyBooking} onOpenChange={() => setHistoryBooking(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>System Log History</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="max-h-[450px] overflow-y-auto pr-2 space-y-3">
            {historyBooking?.history?.length ? (
              [...historyBooking.history].reverse().map((log, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-slate-50 relative overflow-hidden shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                  <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                      Modified By: {log.updatedBy}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{log.changes}"                 

                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">No recorded changes found in the system log.</p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setHistoryBooking(null)} className="bg-slate-900">
              Close Log
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer Branding */}
      <div className="pt-24 pb-8 flex flex-col items-center gap-4">
        <div className="h-px w-full max-w-sm bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <p className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.8em]">
          @Sabih Software
        </p>
      </div>
    </div>
  )
}