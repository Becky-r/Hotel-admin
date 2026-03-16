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
import { ArrowLeft, X, Upload, Image as ImageIcon } from 'lucide-react';

interface RoomFormProps {
  room?: Room | null;
  roomTypes?: string[];
  onSave: (room: Room) => void;
  onCancel: () => void;
}

const availableAmenities = ['WiFi', 'AC', 'TV', 'Bathtub', 'Kitchen', 'Gym Access', 'Balcony', 'Safe', 'Mini Bar', 'Desk'];

export default function RoomForm({ room, roomTypes, onSave, onCancel }: RoomFormProps) {
  const [formData, setFormData] = useState<Partial<Room>>(
    room || {
      roomNumber: '',
      roomType: 'double',
      capacity: {
        adults: 1,
        children: 0,
      },
      basePrice: 0,
      currentPrice: 0,
      status: 'available',
      amenities: [],
      floor: 1,
      image: '',
    }
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRoom: Room = {
      id: room?.id || Math.random().toString(36).substr(2, 9),
      roomNumber: formData.roomNumber || '',
      roomType: (formData.roomType as any) || 'double',
      capacity: formData.capacity || { adults: 1, children: 0 },
      basePrice: formData.basePrice || 0,
      currentPrice: formData.currentPrice || formData.basePrice || 0,
      status: (formData.status as any) || 'available',
      amenities: formData.amenities || [],
      floor: formData.floor || 1,
      image: formData.image || '',
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
                <Select value={formData.roomType || (roomTypes?.[0] ?? 'double')} onValueChange={(value) => setFormData({ ...formData, roomType: value as any })}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(roomTypes ?? ['single', 'double', 'suite', 'deluxe']).map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
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

            {/* Room Image */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Room Image</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {imagePreview || formData.image ? (
                    <div className="relative w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden">
                      <img
                        src={imagePreview || formData.image}
                        alt="Room preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={removeImage}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="room-image"
                  />
                  <label htmlFor="room-image">
                    <Button type="button" variant="outline" className="gap-2" asChild>
                      <span>
                        <Upload className="w-4 h-4" />
                        {imagePreview || formData.image ? 'Change Image' : 'Upload Image'}
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a high-quality image of the room (JPG, PNG, max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Adult Capacity *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity?.adults || 1}
                  onChange={(e) => setFormData({
                    ...formData,
                    capacity: {
                      ...formData.capacity!,
                      adults: parseInt(e.target.value)
                    }
                  })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Children Capacity</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.capacity?.children || 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    capacity: {
                      ...formData.capacity!,
                      children: parseInt(e.target.value)
                    }
                  })}
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
