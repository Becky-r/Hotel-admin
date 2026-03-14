'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface StaffFormProps {
  staff?: User | null;
  onSave: (staff: User) => void;
  onCancel: () => void;
}

export default function StaffForm({ staff, onSave, onCancel }: StaffFormProps) {
  const [formData, setFormData] = useState<Partial<User>>(
    staff || {
      name: '',
      email: '',
      password: '',
      role: 'receptionist',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStaff: User = {
      id: staff?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      email: formData.email || '',
      password: formData.password || '',
      role: (formData.role as any) || 'receptionist',
      createdAt: staff?.createdAt || new Date().toISOString(),
    };

    onSave(newStaff);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</h1>
          <p className="text-muted-foreground mt-1">
            {staff ? 'Update staff information' : 'Add a new team member to your hotel'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Information</CardTitle>
          <CardDescription>Enter staff member details and assign role</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@hotel.com"
                  required
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password *</label>
              <Input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required={!staff}
                className="bg-input border-border"
              />
              {staff && (
                <p className="text-xs text-muted-foreground">Leave blank to keep current password</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role *</label>
              <Select value={formData.role || 'receptionist'} onValueChange={(value) => setFormData({ ...formData, role: value as any })}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner - Full access to all features</SelectItem>
                  <SelectItem value="manager">Manager - Bookings, rooms, and reports</SelectItem>
                  <SelectItem value="receptionist">Receptionist - Check-in/out and bookings</SelectItem>
                  <SelectItem value="housekeeping">Housekeeping - Room status only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg border border-border space-y-2">
              <p className="text-sm font-semibold text-foreground">Permissions for Selected Role</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {formData.role === 'owner' && (
                  <>
                    <li>✓ All bookings management</li>
                    <li>✓ Room management</li>
                    <li>✓ Staff management</li>
                    <li>✓ Reports and analytics</li>
                    <li>✓ System settings</li>
                  </>
                )}
                {formData.role === 'manager' && (
                  <>
                    <li>✓ View/manage bookings</li>
                    <li>✓ Room management</li>
                    <li>✓ Staff shifts</li>
                    <li>✓ Reports</li>
                  </>
                )}
                {formData.role === 'receptionist' && (
                  <>
                    <li>✓ Check-in/check-out</li>
                    <li>✓ Create bookings</li>
                    <li>✓ Modify bookings</li>
                  </>
                )}
                {formData.role === 'housekeeping' && (
                  <>
                    <li>✓ View room status</li>
                    <li>✓ Update room status</li>
                    <li>✓ Maintenance reports</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex gap-3 border-t border-border pt-6">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {staff ? 'Update Staff Member' : 'Add Staff Member'}
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
