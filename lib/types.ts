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
  roomId: string; // Primary room ID for backward compatibility
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  numberOfGuests: number;
  totalPrice: number;
  bookingType: 'online' | 'manual' | 'walkin';
  specialRequests?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  companyName?: string;
  tinNumber?: string;
  adults?: number;
  children?: number;
  roomNumber?: string; // Primary room number for backward compatibility
  roomType?: string; // Primary room type for backward compatibility
  rooms?: BookingRoom[]; // Array of rooms for multiple room bookings
  history?: BookingHistory[]; // Booking history
  createdAt: string;
  updatedAt: string;
}

export interface BookingHistory {
  updatedBy: string;
  timestamp: string;
  changes: string;
}

export interface BookingRoom {
  id: string;
  roomNumber: string;
  roomType: string;
  price: number;
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
  image?: string; // Room image URL/path
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

// Amenity management types
export interface Amenity {
  id: string;
  name: string;
  description?: string;
  category?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Service management types
export interface Service {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  durationMinutes?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
