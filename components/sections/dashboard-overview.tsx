'use client';

import { useMemo } from 'react';
import { getBookings, getRooms } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { Users, Home, Calendar, TrendingUp, Plus, Search, CheckCircle, Settings } from 'lucide-react';
const COLORS = ['#3b82f6', '#f59e0b', '#ef4444'];


export default function DashboardOverview() {
  const bookings = getBookings();
  const rooms = getRooms();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => {
      const checkInDate = b.checkInDate;
      const checkOutDate = b.checkOutDate;
      return checkInDate <= today && checkOutDate > today;
    });

    const totalRevenue = bookings.reduce((sum, b) => {
      if (b.status !== 'cancelled' && b.paymentStatus === 'paid') {
        return sum + b.totalPrice;
      }
      return sum;
    }, 0);

    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const occupancyRate = ((occupiedRooms / rooms.length) * 100).toFixed(1);

    const confirmationRate = bookings.length > 0
      ? ((bookings.filter(b => b.status !== 'cancelled').length / bookings.length) * 100).toFixed(1)
      : '0';

    return {
      totalBookings: bookings.length,
      todayCheckIns: todayBookings.filter(b => b.status === 'checked-in').length,
      totalRevenue,
      occupancyRate: parseFloat(occupancyRate),
      occupiedRooms,
      availableRooms,
      confirmationRate: parseFloat(confirmationRate),
    };
  }, [bookings, rooms]);

  const revenueData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayBookings = bookings.filter(
        b =>
          b.checkInDate === dateStr ||
          (new Date(b.checkInDate) <= new Date(dateStr) && new Date(b.checkOutDate) > new Date(dateStr))
      );
      const revenue = dayBookings
        .filter(b => b.status !== 'cancelled' && b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
      });
    }
    return data;
  }, [bookings]);

  const bookingStatusData = useMemo(() => {
    return [
      {
        name: 'Confirmed',
        value: bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length,
      },
      { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
      { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
    ];
  }, [bookings]);

  const recentBookings = useMemo(() => {
    try {
      return bookings
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
        .slice(0, 5)
        .map(booking => {
          const room = rooms.find(r => r.id === booking.roomId);
          return { ...booking, roomNumber: room?.roomNumber || booking.roomId };
        });
    } catch (error) {
      console.error('Error processing recent bookings:', error);
      return [];
    }
  }, [bookings, rooms]);

  const todaysSchedule = useMemo(() => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const checkIns = bookings.filter(b =>
        b.checkInDate === today &&
        b.status !== 'cancelled'
      ).slice(0, 3);

      const checkOuts = bookings.filter(b =>
        b.checkOutDate === today &&
        b.status === 'checked-in'
      ).slice(0, 3);

      return { checkIns, checkOuts };
    } catch (error) {
      console.error('Error processing todays schedule:', error);
      return { checkIns: [], checkOuts: [] };
    }
  }, [bookings]);

  const todaysRevenue = useMemo(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return bookings
        .filter(b => b.checkInDate === today && b.status !== 'cancelled' && b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);
    } catch (error) {
      console.error('Error calculating todays revenue:', error);
      return 0;
    }
  }, [bookings]);

  const roomStatusOverview = useMemo(() => {
    try {
      const available = rooms.filter(r => r.status === 'available').length;
      const occupied = rooms.filter(r => r.status === 'occupied').length;
      const maintenance = rooms.filter(r => r.status === 'maintenance').length;
      const blocked = rooms.filter(r => r.status === 'blocked').length;

      return { available, occupied, maintenance, blocked, total: rooms.length };
    } catch (error) {
      console.error('Error processing room status:', error);
      return { available: 0, occupied: 0, maintenance: 0, blocked: 0, total: 0 };
    }
  }, [rooms]);
const COLORS = ['#3b82f6', '#f59e0b', '#ef4444'];
  const pendingTasks = useMemo(() => {
    try {
      const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;
      const unconfirmedBookings = bookings.filter(b => b.status === 'pending').length;
      const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;

      return { pendingPayments, unconfirmedBookings, maintenanceRooms };
    } catch (error) {
      console.error('Error processing pending tasks:', error);
      return { pendingPayments: 0, unconfirmedBookings: 0, maintenanceRooms: 0 };
    }
  }, [bookings, rooms]);
  return (
    <div>
    <div className="space-y-6">
      

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Check-ins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCheckIns}</div>
            <p className="text-xs text-muted-foreground mt-1">Guests arriving today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.occupiedRooms} of {stats.occupiedRooms + stats.availableRooms} rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From paid bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 7 days revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Distribution of bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={bookingStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {bookingStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    {item.name}
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">New Booking</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <Search className="w-6 h-6" />
              <span className="text-sm font-medium">Check-in Guest</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <CheckCircle className="w-6 h-6" />
              <span className="text-sm font-medium">Check-out Guest</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <Settings className="w-6 h-6" />
              <span className="text-sm font-medium">Room Maintenance</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Revenue</CardTitle>
            <CardDescription>Revenue from today's check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${todaysRevenue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-2">
              From {bookings.filter(b => b.checkInDate === new Date().toISOString().split('T')[0] && b.status !== 'cancelled' && b.paymentStatus === 'paid').length} bookings
            </p>
          </CardContent>
        </Card>

        {/* Room Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Room Status</CardTitle>
            <CardDescription>Current room availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Available
                </span>
                <span className="font-semibold">{roomStatusOverview.available}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Occupied
                </span>
                <span className="font-semibold">{roomStatusOverview.occupied}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Maintenance
                </span>
                <span className="font-semibold">{roomStatusOverview.maintenance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Blocked
                </span>
                <span className="font-semibold">{roomStatusOverview.blocked}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Payments</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  pendingTasks.pendingPayments > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {pendingTasks.pendingPayments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Unconfirmed Bookings</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  pendingTasks.unconfirmedBookings > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {pendingTasks.unconfirmedBookings}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rooms in Maintenance</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  pendingTasks.maintenanceRooms > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                }`}>
                  {pendingTasks.maintenanceRooms}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Check-ins</CardTitle>
            <CardDescription>Guests arriving today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysSchedule.checkIns.length > 0 ? (
                todaysSchedule.checkIns.map((booking) => {
                  const room = rooms.find(r => r.id === booking.roomId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{booking.guestName}</div>
                        <div className="text-sm text-muted-foreground">
                          Room {room?.roomNumber || booking.roomId} • {booking.numberOfGuests} guests
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{booking.checkOutDate}</div>
                        <div className="text-xs text-muted-foreground">Check-out</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No check-ins today
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Check-outs */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Check-outs</CardTitle>
            <CardDescription>Guests departing today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysSchedule.checkOuts.length > 0 ? (
                todaysSchedule.checkOuts.map((booking) => {
                  const room = rooms.find(r => r.id === booking.roomId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{booking.guestName}</div>
                        <div className="text-sm text-muted-foreground">
                          Room {room?.roomNumber || booking.roomId} • {booking.numberOfGuests} guests
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Ready to check-out</div>
                        <div className="text-xs text-muted-foreground">${booking.totalPrice}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No check-outs today
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Work History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Work History</CardTitle>
          <CardDescription>Latest booking activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{booking.guestName}</div>
                  <div className="text-sm text-muted-foreground">
                    Room {booking.roomNumber} • {booking.checkInDate} to {booking.checkOutDate}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                    booking.status === 'checked-out' ? 'bg-gray-100 text-gray-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                  <div className="text-sm text-muted-foreground">
                    {new Date(booking.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No recent activities
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    {/* Footer Branding Engine */}
      <div className="pt-20 pb-10 flex flex-col items-center gap-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="flex items-center gap-8">
          
          <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.8em] animate-pulse">
            @Sabih Software
          </p>
          
        </div>
      </div>
</div>
);
}