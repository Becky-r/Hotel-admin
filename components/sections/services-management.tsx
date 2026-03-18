'use client';

import { useState } from 'react';
import { getServices, saveService, deleteService } from '@/lib/db';
import { Service } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ServiceForm from '@/components/forms/service-form';

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>(getServices());
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleSaveService = (service: Service) => {
    saveService(service);
    setServices(getServices());
    setShowForm(false);
    setEditingService(null);
  };

  const handleDeleteService = () => {
    if (!deleteId) return;
    deleteService(deleteId);
    setServices(getServices());
    setDeleteId(null);
  };

  if (showForm) {
    return (
      <ServiceForm
        service={editingService}
        onSave={handleSaveService}
        onCancel={() => {
          setShowForm(false);
          setEditingService(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage hotel services offered to guests.
          </p>
        </div>
        <Button onClick={handleAddService} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* SEARCH */}
          <Input
            placeholder="Search by name, category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input border-border"
          />

          {/* EMPTY STATE */}
          {filteredServices.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No services found. Add a service to get started.
            </div>
          ) : (

            <div className="space-y-3">

              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">

                    {/* ✅ UPDATED GRID (NO DURATION) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">

                      {/* NAME */}
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold text-foreground">{service.name}</p>
                      </div>

                      {/* CATEGORY */}
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-semibold text-foreground">{service.category}</p>
                      </div>

                      {/* PRICE */}
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold text-foreground">
                          ${service.price.toFixed(2)}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteId(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>

                    </div>

                    {/* DESCRIPTION */}
                    {service.description && (
                      <p className="text-sm text-muted-foreground mt-4">
                        {service.description}
                      </p>
                    )}

                  </CardContent>
                </Card>
              ))}

            </div>
          )}
        </CardContent>
      </Card>

      {/* DELETE MODAL */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this service? This action cannot be undone.
          </p>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* FOOTER */}
      <div className="pt-20 pb-10 flex flex-col items-center gap-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.8em] animate-pulse">
          @Sabih Software
        </p>
      </div>

    </div>
  );
}