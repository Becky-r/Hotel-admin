# Hotel Management System

A comprehensive, professional hotel booking and management dashboard built with Next.js, React, and TypeScript.

## Features

### Booking Management
- View all bookings with advanced filtering
- Create manual bookings
- Support for walk-in bookings
- Modify existing reservations
- Cancel bookings with ease
- Overbooking prevention
- Payment status tracking (Pending, Paid, Refunded)

### Room & Pricing Control
- Add and edit room information
- Manage room types (Single, Double, Suite, Deluxe)
- Update room pricing dynamically
- Block rooms for maintenance
- Track maintenance status
- Manage room amenities
- Occupancy tracking

### Staff & Role Management
- Admin roles: Owner, Manager, Receptionist, Housekeeping
- Staff login system with secure authentication
- Permission-based access control
- Shift scheduling
- Check-in/Check-out tracking
- Role-based feature visibility

### Reports & Analytics
- Daily, weekly, and monthly booking reports
- Revenue analysis and trends
- Occupancy rate calculations
- Popular room types analysis
- Cancellation tracking
- Payment reports
- Export capabilities (PDF/Excel coming soon)

### Mobile & Smart Features
- Fully responsive mobile-friendly interface
- Progressive Web App (PWA) support
- Mobile-optimized admin access
- Offline functionality with service worker
- Quick action buttons for mobile users
- Installable on mobile devices

## Demo Credentials

The system comes with pre-configured demo accounts:

### Owner Account
- **Email:** owner@hotel.com
- **Password:** owner123
- **Access:** Full system access

### Manager Account
- **Email:** manager@hotel.com
- **Password:** manager123
- **Access:** Bookings, rooms, staff, and reports

### Receptionist Account
- **Email:** receptionist@hotel.com
- **Password:** receptionist123
- **Access:** Booking management and check-in/out only

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hotel-management
```

2. Install dependencies
```bash
pnpm install
# or
npm install
```

3. Run the development server
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with PWA support
│   ├── page.tsx            # Main authentication & routing
│   ├── globals.css         # Global styles and design tokens
│   └── api/               # API routes (extensible)
│
├── components/
│   ├── dashboard.tsx       # Main dashboard component
│   ├── header.tsx          # Top navigation header
│   ├── sidebar.tsx         # Navigation sidebar
│   ├── login-page.tsx      # Login interface
│   ├── sections/           # Feature sections
│   │   ├── dashboard-overview.tsx
│   │   ├── booking-management.tsx
│   │   ├── room-management.tsx
│   │   ├── staff-management.tsx
│   │   └── reports-analytics.tsx
│   ├── forms/              # Reusable form components
│   │   ├── booking-form.tsx
│   │   ├── room-form.tsx
│   │   └── staff-form.tsx
│   └── ui/                 # Shadcn/ui components
│
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── db.ts               # Database utilities (localStorage)
│   └── utils.ts            # Utility functions
│
└── public/
    ├── manifest.json       # PWA manifest
    └── sw.js              # Service worker
```

## Technology Stack

- **Framework:** Next.js 16 with App Router
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **Charts:** Recharts
- **State Management:** React hooks + localStorage
- **Authentication:** Built-in role-based system
- **Icons:** Lucide React

## Key Features Explained

### Role-Based Access Control
Different user roles have different permissions:
- **Owner:** Full access to all features
- **Manager:** Bookings, rooms, staff management, and reports
- **Receptionist:** Limited to check-in/out and booking management
- **Housekeeping:** Room status and maintenance only

### Booking Management
- Create bookings from online, manual entry, or walk-ins
- Automatic availability checking prevents double-booking
- Payment tracking and status management
- Special requests and notes for guests

### Room Management
- Real-time occupancy tracking
- Dynamic pricing capabilities
- Amenity management
- Maintenance status blocking

### Analytics & Reports
- Interactive charts and graphs
- Revenue trends and forecasting data
- Occupancy rate calculations
- Booking source analysis
- Payment status distribution

### PWA Features
- Install as mobile app
- Works offline with service worker
- Quick access shortcuts
- Mobile-optimized interface
- Responsive design for all devices

## Data Storage

The system uses browser localStorage for demonstration purposes. For production deployment, integrate with:
- Supabase
- PostgreSQL
- MongoDB
- Firebase

## Customization

### Changing Colors
Edit the design tokens in `app/globals.css`:
```css
:root {
  --primary: oklch(...);
  --secondary: oklch(...);
  /* ... other tokens ... */
}
```

### Adding New Roles
Update the roles in `lib/types.ts` and add permission checks in relevant components.

### Extending Features
1. Create new section components in `components/sections/`
2. Add routes in `components/dashboard.tsx`
3. Create corresponding forms in `components/forms/`

## Future Enhancements

- SMS/WhatsApp notifications
- QR code generation for check-in
- Payment gateway integration (Stripe)
- PDF/Excel export functionality
- Real-time booking notifications
- Guest portal integration
- Housekeeping management dashboard
- Advanced dynamic pricing rules
- Inventory management
- Multi-property support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized for fast load times
- Service worker caching strategy
- Lazy loading for reports and charts
- Responsive images and assets
- Minimal bundle size

## Security Considerations

For production use:
- Implement proper backend authentication
- Use secure session management
- Enable HTTPS
- Implement Row Level Security (RLS)
- Add rate limiting
- Validate all inputs server-side
- Use environment variables for sensitive data

## Support & Feedback

For issues, feature requests, or questions, please open an issue on the repository.

## License

MIT License - feel free to use this project for commercial and personal use.

---

**Built with ❤️ using modern web technologies**
