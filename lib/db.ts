import { Booking, Room, User, PricingRule, Shift, DailyReport, Amenity, Service, RoomType } from './types';

// LocalStorage utility functions
const DB_KEYS = {
  USERS: 'hotel_users',
  BOOKINGS: 'hotel_bookings',
  ROOMS: 'hotel_rooms',
  ROOM_TYPES: 'hotel_room_types',
  AMENITIES: 'hotel_amenities',
  SERVICES: 'hotel_services',
  PRICING_RULES: 'hotel_pricing_rules',
  SHIFTS: 'hotel_shifts',
  CURRENT_USER: 'hotel_current_user',
};

// Initialize database with sample data
export function initializeDatabase() {
  if (typeof window === 'undefined') return;

  // Sample room types (defined at the top for use in checks)
  const roomTypes: RoomType[] = [
    {
      id: '1',
      name: 'single',
      description: 'Cozy room for one guest',
      basePrice: 80,
      capacity: { adults: 1, children: 0 },
      amenities: ['WiFi', 'AC', 'TV'],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'double',
      description: 'Comfortable room for two guests',
      basePrice: 120,
      capacity: { adults: 2, children: 1 },
      amenities: ['WiFi', 'AC', 'TV', 'Bathtub'],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'suite',
      description: 'Luxurious suite with separate living area',
      basePrice: 200,
      capacity: { adults: 2, children: 2 },
      amenities: ['WiFi', 'AC', 'TV', 'Bathtub', 'Kitchen', 'Balcony'],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'deluxe',
      description: 'Premium room with enhanced amenities',
      basePrice: 160,
      capacity: { adults: 2, children: 1 },
      amenities: ['WiFi', 'AC', 'TV', 'Bathtub', 'Mini Bar', 'Safe'],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Check if already initialized
  if (localStorage.getItem(DB_KEYS.USERS)) {
    // Check if room types exist, if not, add them
    if (!localStorage.getItem(DB_KEYS.ROOM_TYPES)) {
      localStorage.setItem(DB_KEYS.ROOM_TYPES, JSON.stringify(roomTypes));
    }
    return;
  }

  // Sample users
  const users: User[] = [
    {
      id: '1',
      email: 'owner@hotel.com',
      password: 'owner123',
      name: 'John Owner',
      role: 'owner',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'manager@hotel.com',
      password: 'manager123',
      name: 'Jane Manager',
      role: 'manager',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'receptionist@hotel.com',
      password: 'receptionist123',
      name: 'Bob Receptionist',
      role: 'receptionist',
      createdAt: new Date().toISOString(),
    },
  ];

  // Sample rooms
  const rooms: Room[] = [
    {
      id: '1',
      roomNumber: '101',
      roomType: 'single',
      capacity: { adults: 1, children: 0 },
      basePrice: 80,
      currentPrice: 80,
      status: 'available',
      amenities: ['WiFi', 'AC', 'TV'],
      floor: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      roomNumber: '102',
      roomType: 'double',
      capacity: { adults: 2, children: 1 },
      basePrice: 120,
      currentPrice: 120,
      status: 'occupied',
      amenities: ['WiFi', 'AC', 'TV', 'Bathtub'],
      floor: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      roomNumber: '201',
      roomType: 'suite',
      capacity: { adults: 2, children: 2 },
      basePrice: 200,
      currentPrice: 200,
      status: 'available',
      amenities: ['WiFi', 'AC', 'TV', 'Bathtub', 'Kitchen'],
      floor: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      roomNumber: '202',
      roomType: 'deluxe',
      capacity: { adults: 2, children: 1 },
      basePrice: 180,
      currentPrice: 180,
      status: 'maintenance',
      amenities: ['WiFi', 'AC', 'TV', 'Bathtub', 'Gym Access'],
      floor: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Remove the duplicate roomTypes definition
  // Sample room types (already defined above)

  // Sample bookings
  const bookings: Booking[] = [
    {
      id: '1',
      guestName: 'Alice Johnson',
      guestEmail: 'alice@example.com',
      guestPhone: '+1234567890',
      roomId: '2',
      checkInDate: new Date().toISOString().split('T')[0],
      checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'checked-in',
      numberOfGuests: 2,
      totalPrice: 240,
      bookingType: 'online',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      guestName: 'Charlie Brown',
      guestEmail: 'charlie@example.com',
      guestPhone: '+1987654321',
      roomId: '1',
      checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkOutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'confirmed',
      numberOfGuests: 1,
      totalPrice: 160,
      bookingType: 'online',
      paymentStatus: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const amenities: Amenity[] = [
    {
      id: '1',
      name: 'WiFi',
      description: 'High speed wireless internet throughout the property',
      
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Breakfast Buffet',
      description: 'Complimentary breakfast served daily',
     
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Parking',
      description: 'Free on-site parking for guests',
     
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const services: Service[] = [
    {
      id: '1',
      name: 'Laundry Service',
      description: 'Same-day laundry pickup and delivery',
      category: 'Housekeeping',
      price: 15,
      durationMinutes: 120,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Airport Shuttle',
      description: 'Scheduled airport pickup and drop-off',
      category: 'Transport',
      price: 25,
      durationMinutes: 60,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
  localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(rooms));
  localStorage.setItem(DB_KEYS.ROOM_TYPES, JSON.stringify(roomTypes));
  localStorage.setItem(DB_KEYS.AMENITIES, JSON.stringify(amenities));
  localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
  localStorage.setItem(DB_KEYS.PRICING_RULES, JSON.stringify([]));
  localStorage.setItem(DB_KEYS.SHIFTS, JSON.stringify([]));
}

// User operations
export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
}

// Booking operations
export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(DB_KEYS.BOOKINGS) || '[]');
}

export function getBookingById(id: string): Booking | null {
  const bookings = getBookings();
  return bookings.find(b => b.id === id) || null;
}

export function saveBooking(booking: Booking): void {
  if (typeof window === 'undefined') return;
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === booking.id);
  if (index >= 0) {
    bookings[index] = booking;
  } else {
    bookings.push(booking);
  }
  localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
}

export function deleteBooking(id: string): void {
  if (typeof window === 'undefined') return;
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
}

// Room operations
export function getRooms(): Room[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(DB_KEYS.ROOMS) || '[]');
}

export function getRoomById(id: string): Room | null {
  const rooms = getRooms();
  return rooms.find(r => r.id === id) || null;
}

export function saveRoom(room: Room): void {
  if (typeof window === 'undefined') return;
  const rooms = getRooms();
  const index = rooms.findIndex(r => r.id === room.id);
  if (index >= 0) {
    rooms[index] = room;
  } else {
    rooms.push(room);
  }
  localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(rooms));
}

export function getAvailableRooms(checkInDate: string, checkOutDate: string): Room[] {
  const rooms = getRooms();
  const bookings = getBookings();

  return rooms.filter(room => {
    if (room.status !== 'available') return false;

    const roomBookings = bookings.filter(
      b => b.roomId === room.id && (b.status === 'confirmed' || b.status === 'checked-in')
    );

    return !roomBookings.some(
      b =>
        (new Date(checkInDate) < new Date(b.checkOutDate) &&
          new Date(checkOutDate) > new Date(b.checkInDate))
    );
  });
}

// Amenity operations
export function getAmenities(): Amenity[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(DB_KEYS.AMENITIES) || '[]');
}

export function getAmenityById(id: string): Amenity | null {
  const amenities = getAmenities();
  return amenities.find(a => a.id === id) || null;
}

export function saveAmenity(amenity: Amenity): void {
  if (typeof window === 'undefined') return;
  const amenities = getAmenities();
  const index = amenities.findIndex(a => a.id === amenity.id);
  if (index >= 0) {
    amenities[index] = amenity;
  } else {
    amenities.push(amenity);
  }
  localStorage.setItem(DB_KEYS.AMENITIES, JSON.stringify(amenities));
}

export function deleteAmenity(id: string): void {
  if (typeof window === 'undefined') return;
  const amenities = getAmenities().filter(a => a.id !== id);
  localStorage.setItem(DB_KEYS.AMENITIES, JSON.stringify(amenities));
}

// Service operations
export function getServices(): Service[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(DB_KEYS.SERVICES) || '[]');
}

export function getServiceById(id: string): Service | null {
  const services = getServices();
  return services.find(s => s.id === id) || null;
}

export function saveService(service: Service): void {
  if (typeof window === 'undefined') return;
  const services = getServices();
  const index = services.findIndex(s => s.id === service.id);
  if (index >= 0) {
    services[index] = service;
  } else {
    services.push(service);
  }
  localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
}

export function deleteService(id: string): void {
  if (typeof window === 'undefined') return;
  const services = getServices().filter(s => s.id !== id);
  localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
}

// Room Type operations
export function getRoomTypes(): RoomType[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(DB_KEYS.ROOM_TYPES) || '[]');
}

export function getRoomTypeById(id: string): RoomType | null {
  const roomTypes = getRoomTypes();
  return roomTypes.find(rt => rt.id === id) || null;
}

export function saveRoomType(roomType: RoomType): void {
  if (typeof window === 'undefined') return;
  const roomTypes = getRoomTypes();
  const index = roomTypes.findIndex(rt => rt.id === roomType.id);
  if (index >= 0) {
    roomTypes[index] = roomType;
  } else {
    roomTypes.push(roomType);
  }
  localStorage.setItem(DB_KEYS.ROOM_TYPES, JSON.stringify(roomTypes));
}

export function deleteRoomType(id: string): void {
  if (typeof window === 'undefined') return;
  const roomTypes = getRoomTypes().filter(rt => rt.id !== id);
  localStorage.setItem(DB_KEYS.ROOM_TYPES, JSON.stringify(roomTypes));
}

// Session operations
export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(DB_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
}
