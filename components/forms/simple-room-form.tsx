'use client';

import { useState, useEffect } from 'react';
import { Room, RoomType } from '@/lib/types';
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

interface SimpleRoomFormProps {
  roomTypes?: RoomType[];
  onSave: (room: Room) => void;
  onCancel: () => void;
}

export default function SimpleRoomForm({ roomTypes, onSave, onCancel }: SimpleRoomFormProps) {
  const [formData, setFormData] = useState<Partial<Room>>({
    roomNumber: '',
    roomType: roomTypes && roomTypes.length > 0 ? roomTypes[0].name : 'single',
    capacity: roomTypes && roomTypes.length > 0 ? roomTypes[0].capacity : {
      adults: 1,
      children: 0,
    },
    basePrice: roomTypes && roomTypes.length > 0 ? roomTypes[0].basePrice : 0,
    currentPrice: roomTypes && roomTypes.length > 0 ? roomTypes[0].basePrice : 0,
    status: 'available',
    amenities: roomTypes && roomTypes.length > 0 ? roomTypes[0].amenities : [],
    floor: 1,
    image: '',
  });

  // Update formData when roomTypes changes
  useEffect(() => {
    if (roomTypes && roomTypes.length > 0) {
      const defaultRoomType = roomTypes[0];
      setFormData(prev => ({
        ...prev,
        roomType: defaultRoomType.name,
        capacity: defaultRoomType.capacity,
        basePrice: defaultRoomType.basePrice,
        currentPrice: defaultRoomType.basePrice,
        amenities: defaultRoomType.amenities,
      }));
    }
  }, [roomTypes]);

  const handleRoomTypeChange = (roomTypeName: string) => {
    const selectedRoomType = roomTypes?.find(rt => rt.name === roomTypeName);
    if (selectedRoomType) {
      setFormData({
        ...formData,
        roomType: roomTypeName,
        capacity: selectedRoomType.capacity,
        basePrice: selectedRoomType.basePrice,
        currentPrice: selectedRoomType.basePrice,
        amenities: selectedRoomType.amenities,
      });
    } else {
      setFormData({
        ...formData,
        roomType: roomTypeName,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      roomNumber: formData.roomNumber || '',
      roomType: formData.roomType || 'single',
      capacity: formData.capacity || { adults: 1, children: 0 },
      basePrice: formData.basePrice || 0,
      currentPrice: formData.currentPrice || 0,
      status: 'available',
      amenities: formData.amenities || [],
      floor: formData.floor || 1,
      image: '',
      createdAt: new Date().toISOString(),
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
          <h1 className="text-3xl font-bold text-foreground">Add New Room</h1>
          <p className="text-muted-foreground mt-1">
            Add a new room to your property
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
          <CardDescription>Enter basic room details</CardDescription>
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
                <Select value={formData.roomType || (roomTypes && roomTypes.length > 0 ? roomTypes[0].name : 'single')} onValueChange={handleRoomTypeChange}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(roomTypes && roomTypes.length > 0 ? roomTypes : []).map((type: RoomType) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                      </SelectItem>
                    ))}
                    {(!roomTypes || roomTypes.length === 0) && (
                      <SelectItem value="single" disabled>
                        No room types available
                      </SelectItem>
                    )}
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
                  required
                  className="bg-input border-border"
                />
              </div>
            </div>

            {/* Status - Read Only */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="px-3 py-2 bg-muted border border-border rounded-md text-sm">
                Available
              </div>
            </div>

            <div className="flex gap-3 border-t border-border pt-6">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add Room
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