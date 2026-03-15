'use client';

import { useState } from 'react';
import { Amenity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

interface AmenityFormProps {
  amenity?: Amenity | null;
  onSave: (amenity: Amenity) => void;
  onCancel: () => void;
}

export default function AmenityForm({ amenity, onSave, onCancel }: AmenityFormProps) {
  const [formData, setFormData] = useState<Partial<Amenity>>(
    amenity || {
      name: '',
      description: '',
      category: 'General',
      active: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAmenity: Amenity = {
      id: amenity?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      description: formData.description || '',
      category: formData.category || 'General',
      active: formData.active ?? true,
      createdAt: amenity?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newAmenity);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {amenity ? 'Edit Amenity' : 'Add New Amenity'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {amenity ? 'Update amenity details' : 'Create a new amenity option for rooms and services'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Amenity Details</CardTitle>
          <CardDescription>Give your amenity a name and description.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="WiFi"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Room, Food, Service..."
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional details for the amenity"
                className="bg-input border-border"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">Toggle whether this amenity can be assigned to rooms.</p>
              </div>
              <Switch
                checked={formData.active ?? true}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>

            <div className="flex gap-3 border-t border-border pt-6">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {amenity ? 'Save Changes' : 'Add Amenity'}
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
