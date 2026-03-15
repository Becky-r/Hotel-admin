'use client';

import { useState } from 'react';
import { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

interface ServiceFormProps {
  service?: Service | null;
  onSave: (service: Service) => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState<Partial<Service>>(
    service || {
      name: '',
      description: '',
      category: 'General',
      price: 0,
      durationMinutes: 30,
      active: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newService: Service = {
      id: service?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      description: formData.description || '',
      category: formData.category || 'General',
      price: formData.price ?? 0,
      durationMinutes: formData.durationMinutes ?? 0,
      active: formData.active ?? true,
      createdAt: service?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newService);
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
            {service ? 'Edit Service' : 'Add New Service'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {service ? 'Update service details' : 'Create a new service offering'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Define the service and pricing information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Laundry Service"
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Housekeeping, Transportation..."
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price ?? 0}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.durationMinutes ?? 0}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                  placeholder="30"
                  className="bg-input border-border"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Active</label>
                  <p className="text-xs text-muted-foreground">Toggle availability for this service.</p>
                </div>
                <Switch
                  checked={formData.active ?? true}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this service includes"
                className="bg-input border-border"
                rows={4}
              />
            </div>

            <div className="flex gap-3 border-t border-border pt-6">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {service ? 'Save Changes' : 'Add Service'}
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
