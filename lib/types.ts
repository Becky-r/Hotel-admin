// User and authentication types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'owner' | 'manager' | 'receptionist' | 'housekeeping';
  createdAt: string;
}

// Booking types
export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  numberOfGuests: number;
  totalPrice: number;
  bookingType: 'online' | 'manual' | 'walkin';
  specialRequests?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

// Room types
export interface Room {
  id: string;
  roomNumber: string;
  roomType: 'single' | 'double' | 'suite' | 'deluxe';
  capacity: number;
  basePrice: number;
  currentPrice: number;
  status: 'available' | 'occupied' | 'maintenance' | 'blocked';
  amenities: string[];
  floor: number;
  createdAt: string;
  updatedAt: string;
}

// Pricing rule types
export interface PricingRule {
  id: string;
  roomType: string;
  name: string;
  basePrice: number;
  weekendMultiplier: number;
  seasonMultiplier: number;
  minStayDiscount?: number;
  earlyBookingDiscount?: number;
  createdAt: string;
}

// Staff shift types
export interface Shift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Report analytics types
export interface DailyReport {
  date: string;
  totalBookings: number;
  confirmedBookings: number;
  checkIns: number;
  checkOuts: number;
  revenue: number;
  occupancyRate: number;
  cancellations: number;
}

export interface RevenueReport {
  period: 'daily' | 'weekly' | 'monthly';
  totalRevenue: number;
  averageRoomRate: number;
  occupancyRate: number;
  bookingsByType: {
    online: number;
    manual: number;
    walkin: number;
  };
  paymentStatus: {
    paid: number;
    pending: number;
    refunded: number;
  };
}
