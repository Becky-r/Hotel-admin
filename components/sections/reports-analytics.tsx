
'use client';

import { useMemo } from 'react';
import { getBookings, getRooms } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText } from 'lucide-react';
import { DollarSign, CalendarDays, TrendingUp, BedDouble, Clock } from "lucide-react";

export default function ReportsAnalytics() {
  const bookings = getBookings();
  const rooms = getRooms();

  const reportData = useMemo(() => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    // Monthly revenue data
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(thisYear, thisMonth - i, 1);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.checkInDate);
        return bookingDate.getMonth() === date.getMonth() && bookingDate.getFullYear() === date.getFullYear();
      });

      const revenue = monthBookings
        .filter(b => b.status !== 'cancelled' && b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      monthlyData.push({
        month: monthStr,
        revenue,
        bookings: monthBookings.length,
      });
    }

    // Room type distribution
    const roomTypeData = [
      { name: 'Single', value: rooms.filter(r => r.roomType === 'single').length },
      { name: 'Double', value: rooms.filter(r => r.roomType === 'double').length },
      { name: 'Suite', value: rooms.filter(r => r.roomType === 'suite').length },
      { name: 'Deluxe', value: rooms.filter(r => r.roomType === 'deluxe').length },
    ];

    // Booking source distribution
    const bookingSourceData = [
      { name: 'Online', value: bookings.filter(b => b.bookingType === 'online').length },
      { name: 'Manual', value: bookings.filter(b => b.bookingType === 'manual').length },
      { name: 'Walk-in', value: bookings.filter(b => b.bookingType === 'walkin').length },
    ];

    // Payment status
    const paymentData = [
      { name: 'Paid', value: bookings.filter(b => b.paymentStatus === 'paid').length },
      { name: 'Pending', value: bookings.filter(b => b.paymentStatus === 'pending').length },
      { name: 'Refunded', value: bookings.filter(b => b.paymentStatus === 'refunded').length },
    ];

    // Overall stats
    const totalRevenue = bookings
      .filter(b => b.status !== 'cancelled' && b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const averageBookingValue = bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : 0;

    const confirmedBookings = bookings.filter(b => b.status !== 'cancelled').length;
    const confirmationRate = bookings.length > 0 ? ((confirmedBookings / bookings.length) * 100).toFixed(1) : 0;

    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const occupancyRate = rooms.length > 0 ? ((occupiedRooms / rooms.length) * 100).toFixed(1) : 0;

    // Guest demographics
    const guestDemographics = [
      { name: '1 Guest', value: bookings.filter(b => b.numberOfGuests === 1).length },
      { name: '2 Guests', value: bookings.filter(b => b.numberOfGuests === 2).length },
      { name: '3 Guests', value: bookings.filter(b => b.numberOfGuests === 3).length },
      { name: '4+ Guests', value: bookings.filter(b => b.numberOfGuests >= 4).length },
    ];

    // Average length of stay
    const averageLengthOfStay = bookings.length > 0
      ? bookings.reduce((sum, b) => {
          const checkIn = new Date(b.checkInDate);
          const checkOut = new Date(b.checkOutDate);
          const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0) / bookings.length
      : 0;

    // Revenue per room type
    const revenueByRoomType = rooms.map(roomType => {
      const roomTypeBookings = bookings.filter(b => {
        const room = rooms.find(r => r.id === b.roomId);
        return room?.roomType === roomType.roomType;
      });
      const revenue = roomTypeBookings
        .filter(b => b.status !== 'cancelled' && b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);
      return {
        name: roomType.roomType.charAt(0).toUpperCase() + roomType.roomType.slice(1),
        revenue,
        bookings: roomTypeBookings.length,
      };
    }).filter(item => item.bookings > 0);

    // Seasonal trends (quarterly)
    const seasonalData = [];
    for (let quarter = 0; quarter < 4; quarter++) {
      const quarterBookings = bookings.filter(b => {
        const bookingDate = new Date(b.checkInDate);
        const bookingQuarter = Math.floor(bookingDate.getMonth() / 3);
        return bookingQuarter === quarter;
      });
      const revenue = quarterBookings
        .filter(b => b.status !== 'cancelled' && b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);
      seasonalData.push({
        quarter: `Q${quarter + 1}`,
        revenue,
        bookings: quarterBookings.length,
      });
    }

    // Cancellation analysis
    const cancellationRate = bookings.length > 0
      ? ((bookings.filter(b => b.status === 'cancelled').length / bookings.length) * 100).toFixed(1)
      : '0';

    // Room utilization by floor
    const floorUtilization = [];
    const floors = [...new Set(rooms.map(r => r.floor))].sort();
    floors.forEach(floor => {
      const floorRooms = rooms.filter(r => r.floor === floor);
      const occupiedRooms = floorRooms.filter(r => r.status === 'occupied').length;
      const utilizationRate = floorRooms.length > 0 ? ((occupiedRooms / floorRooms.length) * 100).toFixed(1) : '0';
      floorUtilization.push({
        floor: `Floor ${floor}`,
        totalRooms: floorRooms.length,
        occupiedRooms,
        utilizationRate: parseFloat(utilizationRate),
      });
    });

    return {
      monthlyData,
      roomTypeData,
      bookingSourceData,
      paymentData,
      guestDemographics,
      revenueByRoomType,
      seasonalData,
      floorUtilization,
      totalRevenue,
      averageBookingValue,
      averageLengthOfStay: averageLengthOfStay.toFixed(1),
      cancellationRate,
      confirmationRate,
      occupancyRate,
      totalBookings: bookings.length,
    };
  }, [bookings, rooms]);

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

  const handleExportPDF = () => {
    alert('PDF export feature coming soon!');
  };

  const handleExportExcel = () => {
    alert('Excel export feature coming soon!');
  };

  return (
    <div>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View comprehensive business reports and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Export PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

  {/* Revenue */}
  <Card className="border-none shadow-md hover:shadow-xl transition-all bg-gradient-to-r from-emerald-500/10 to-emerald-500/5">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-muted-foreground">Total Revenue</p>
        <p className="text-3xl font-bold mt-1 text-emerald-600">
          ${reportData.totalRevenue.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">All paid bookings</p>
      </div>
      <DollarSign className="h-10 w-10 text-emerald-500 opacity-80" />
    </CardContent>
  </Card>

  {/* Bookings */}
  <Card className="border-none shadow-md hover:shadow-xl transition-all bg-gradient-to-r from-blue-500/10 to-blue-500/5">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-muted-foreground">Total Bookings</p>
        <p className="text-3xl font-bold mt-1 text-blue-600">
          {reportData.totalBookings}
        </p>
        <p className="text-xs text-muted-foreground mt-1">All time</p>
      </div>
      <CalendarDays className="h-10 w-10 text-blue-500 opacity-80" />
    </CardContent>
  </Card>

  {/* Avg Booking */}
  <Card className="border-none shadow-md hover:shadow-xl transition-all bg-gradient-to-r from-purple-500/10 to-purple-500/5">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-muted-foreground">Avg Booking Value</p>
        <p className="text-3xl font-bold mt-1 text-purple-600">
          ${reportData.averageBookingValue}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Per reservation</p>
      </div>
      <TrendingUp className="h-10 w-10 text-purple-500 opacity-80" />
    </CardContent>
  </Card>

  {/* Top Room */}
  <Card className="border-none shadow-md hover:shadow-xl transition-all bg-gradient-to-r from-orange-500/10 to-orange-500/5">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-muted-foreground">Top Room Type</p>
        <p className="text-2xl font-bold mt-1 text-orange-600">
          {reportData.revenueByRoomType.length > 0
            ? reportData.revenueByRoomType.reduce((max, item) =>
                item.revenue > max.revenue ? item : max
              ).name
            : "N/A"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">By revenue</p>
      </div>
      <BedDouble className="h-10 w-10 text-orange-500 opacity-80" />
    </CardContent>
  </Card>

  {/* Avg Stay */}
  <Card className="border-none shadow-md hover:shadow-xl transition-all bg-gradient-to-r from-pink-500/10 to-pink-500/5">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-muted-foreground">Avg Length of Stay</p>
        <p className="text-3xl font-bold mt-1 text-pink-600">
          {reportData.averageLengthOfStay} days
        </p>
        <p className="text-xs text-muted-foreground mt-1">Per booking</p>
      </div>
      <Clock className="h-10 w-10 text-pink-500 opacity-80" />
    </CardContent>
  </Card>

</div>


{/* Summary */}


     
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend (Last 12 Months)</CardTitle>
          <CardDescription>Monthly revenue and booking count</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="var(--color-primary)" name="Revenue ($)" />
              <Bar dataKey="bookings" fill="var(--color-accent)" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      

      

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Guest Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Guest Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={reportData.guestDemographics} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value">
                  {reportData.guestDemographics.map((entry, index) => (
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
            <div className="mt-2 space-y-1 text-xs">
              {reportData.guestDemographics.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    {item.name}
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Room Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Room Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={reportData.revenueByRoomType} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" />
                <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Floor Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Floor Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.floorUtilization.map((floor, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{floor.floor}</span>
                    <span className="font-semibold">{floor.utilizationRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${floor.utilizationRate}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {floor.occupiedRooms}/{floor.totalRooms} rooms occupied
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              <p className="text-2xl font-bold text-green-600">{reportData.occupancyRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmation Rate</p>
              <p className="text-2xl font-bold text-blue-600">{reportData.confirmationRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancellation Rate</p>
              <p className="text-2xl font-bold text-red-600">{reportData.cancellationRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Stay Duration</p>
              <p className="text-2xl font-bold text-purple-600">{reportData.averageLengthOfStay}d</p>
            </div>
          </CardContent>
        </Card>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

{/* Room Type Distribution */}
<Card className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
  <CardHeader className="bg-gray-50 rounded-t-xl p-4">
    <CardTitle className="text-lg font-semibold text-gray-800">Room Type Distribution</CardTitle>
  </CardHeader>
  <CardContent className="p-4 flex flex-col items-center">
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={reportData.roomTypeData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={40}
          paddingAngle={3}
          dataKey="value"
        >
          {reportData.roomTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          }}
        />
      </PieChart>
    </ResponsiveContainer>

    {/* Legend */}
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      {reportData.roomTypeData.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 shadow-sm"
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          ></span>
          <span className="text-gray-700 font-medium">{item.name}: {item.value}</span>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

{/* Booking Source */}
<Card className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
  <CardHeader className="bg-gray-50 rounded-t-xl p-4">
    <CardTitle className="text-lg font-semibold text-gray-800">Booking Source</CardTitle>
  </CardHeader>
  <CardContent className="p-4 flex flex-col items-center">
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={reportData.bookingSourceData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={40}
          paddingAngle={3}
          dataKey="value"
        >
          {reportData.bookingSourceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          }}
        />
      </PieChart>
    </ResponsiveContainer>

    {/* Legend */}
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      {reportData.bookingSourceData.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 shadow-sm"
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          ></span>
          <span className="text-gray-700 font-medium">{item.name}: {item.value}</span>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

{/* Payment Status */}
<Card className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
  <CardHeader className="bg-gray-50 rounded-t-xl p-4">
    <CardTitle className="text-lg font-semibold text-gray-800">Payment Status</CardTitle>
  </CardHeader>
  <CardContent className="p-4 flex flex-col items-center">
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={reportData.paymentData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={40}
          paddingAngle={3}
          dataKey="value"
        >
          {reportData.paymentData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          }}
        />
      </PieChart>
    </ResponsiveContainer>

    {/* Legend */}
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      {reportData.paymentData.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 shadow-sm"
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          ></span>
          <span className="text-gray-700 font-medium">{item.name}: {item.value}</span>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
        </div>


        
      </div>

      
    </div>
  );
}
