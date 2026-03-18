'use client';

import { useState } from 'react';
import { RoomType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, X, Upload, Image as ImageIcon } from 'lucide-react';

interface RoomTypeFormProps {
  roomType?: RoomType | null;
  onSave: (roomType: RoomType) => void;
  onCancel: () => void;
}

const availableAmenities = ['WiFi', 'AC', 'TV', 'Bathtub', 'Kitchen', 'Gym Access', 'Balcony', 'Safe', 'Mini Bar', 'Desk', 'Coffee Maker', 'Hair Dryer', 'Iron', 'Laundry Service', 'Room Service'];

export default function RoomTypeForm({ roomType, onSave, onCancel }: RoomTypeFormProps) {
  const [formData, setFormData] = useState<Partial<RoomType & { floor?: string }>>(
    roomType || {
      name: '',
      description: '',
      basePrice: 0,
      floor: '', // Added floor to initial state
      capacity: {
        adults: 1,
        children: 0,
      },
      amenities: [],
      images: [],
    }
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(roomType?.images || []);

  const handleAmenityToggle = (amenity: string) => {
    const amenities = formData.amenities || [];
    const newAmenities = amenities.includes(amenity)
      ? amenities.filter(a => a !== amenity)
      : [...amenities, amenity];
    
    setFormData({ ...formData, amenities: newAmenities });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews: string[] = [];
      const newFiles: File[] = [];

      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          newFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            newPreviews.push(result);
            if (newPreviews.length === files.length) {
              setImagePreviews(prev => [...prev, ...newPreviews]);
              setImageFiles(prev => [...prev, ...newFiles]);
              setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...newPreviews]
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = (formData.images || []).filter((_, i) => i !== index);

    setImagePreviews(newPreviews);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert('Room type name is required');
      return;
    }

    const newRoomType: RoomType = {
      id: roomType?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name.trim(),
      description: formData.description || '',
      basePrice: formData.basePrice || 0,
      capacity: formData.capacity || { adults: 1, children: 0 },
      amenities: formData.amenities || [],
      images: formData.images || [],
      // @ts-ignore - Assuming floor might be a new field in your backend
      floor: formData.floor || '',
      createdAt: roomType?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newRoomType);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{roomType ? 'Edit Room Type' : 'Add New Room Type'}</h1>
          <p className="text-muted-foreground mt-1">
            {roomType ? 'Update room type information' : 'Create a new room type for your property'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Type Information</CardTitle>
          <CardDescription>Enter room type details and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Row: Name, Price, Capacity, Floor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Deluxe Suite"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Price *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice || 0}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                  placeholder="120.00"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Capacity *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity?.adults || 1}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    capacity: { adults: parseInt(e.target.value) || 1, children: 0 } 
                  })}
                  placeholder="4"
                  required
                  className="bg-input border-border"
                />
              </div>
              {/* Floor Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Floor</label>
                <Input
                  value={formData.floor || ''}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  placeholder="e.g. 2nd Floor"
                  className="bg-input border-border"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the room features, view, and unique selling points..."
                className="bg-input border-border min-h-[100px]"
              />
            </div>

            {/* Room Images */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Room Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 border-2 border-border rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="w-full h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="room-type-images"
                    />
                    <label htmlFor="room-type-images">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Add Images
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
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
                {roomType ? 'Update Room Type' : 'Create Room Type'}
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