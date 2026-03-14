'use client';

import { useState } from 'react';
import { Room } from '@/lib/types';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, X } from 'lucide-react';

interface RoomFormProps {
  room?: Room | null;
  onSave: (room: Room) => void;
  onCancel: () => void;
}

const availableAmenities = ['WiFi', 'AC', 'TV', 'Bathtub', 'Kitchen', 'Gym Access', 'Balcony', 'Safe', 'Mini Bar', 'Desk'];

export default function RoomForm({ room, onSave, onCancel }: RoomFormProps) {
  const [formData, setFormData] = useState<Partial<Room>>(
    room || {
      roomNumber: '',
      roomType: 'double',
      capacity: 1,
      basePrice: 0,
      currentPrice: 0,
      status: 'available',
      amenities: [],
      floor: 1,
    }
  );

  const handleAmenityToggle = (amenity: string) => {
    const amenities = formData.amenities || [];
    if (amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: amenities.filter(a => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...amenities, amenity],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRoom: Room = {
      id: room?.id || Math.random().toString(36).substr(2, 9),
      roomNumber: formData.roomNumber || '',
      roomType: (formData.roomType as any) || 'double',
      capacity: formData.capacity || 1,
      basePrice: formData.basePrice || 0,
      currentPrice: formData.currentPrice || formData.basePrice || 0,
      status: (formData.status as any) || 'available',
      amenities: formData.amenities || [],
      floor: formData.floor || 1,
      createdAt: room?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newRoom);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{room ? 'Edit Room' : 'Add New Room'}</h1>
          <p className="text-muted-foreground mt-1">
            {room ? 'Update room information' : 'Add a new room to your property'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
          <CardDescription>Enter room details and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Number *</label>
                <Input
                  value={formData.roomNumber || ''}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="101"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Type *</label>
                <Select value={formData.roomType || 'double'} onValueChange={(value) => setFormData({ ...formData, roomType: value as any })}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Floor Number *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.floor || 1}
                  onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                  className="bg-input border-border"
                />
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Guest Capacity *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity || 1}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Price per Night *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice || 0}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                  placeholder="120.00"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Price per Night *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.currentPrice || 0}
                  onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })}
                  placeholder="120.00"
                  className="bg-input border-border"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Status *</label>
              <Select value={formData.status || 'available'} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amenities */}
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-semibold text-foreground">Room Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableAmenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Checkbox
                      checked={(formData.amenities || []).includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                      id={amenity}
                    />
                    <label htmlFor={amenity} className="text-sm cursor-pointer">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 border-t border-border pt-6">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {room ? 'Update Room' : 'Add Room'}
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
