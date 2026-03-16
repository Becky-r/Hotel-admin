'use client';

import { useState } from 'react';
import { getAmenities, saveAmenity, deleteAmenity } from '@/lib/db';
import { Amenity } from '@/lib/types';
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
import AmenityForm from '@/components/forms/amenity-form';

export default function AmenitiesManagement() {
  const [amenities, setAmenities] = useState<Amenity[]>(getAmenities());
  const [showForm, setShowForm] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAmenities = amenities.filter((amenity) =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (amenity.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (amenity.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAmenity = () => {
    setEditingAmenity(null);
    setShowForm(true);
  };

  const handleEditAmenity = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setShowForm(true);
  };

  const handleSaveAmenity = (amenity: Amenity) => {
    saveAmenity(amenity);
    setAmenities(getAmenities());
    setShowForm(false);
    setEditingAmenity(null);
  };

  const handleDeleteAmenity = () => {
    if (!deleteId) return;
    deleteAmenity(deleteId);
    setAmenities(getAmenities());
    setDeleteId(null);
  };

  if (showForm) {
    return (
      <AmenityForm
        amenity={editingAmenity}
        onSave={handleSaveAmenity}
        onCancel={() => {
          setShowForm(false);
          setEditingAmenity(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Amenities</h1>
          <p className="text-muted-foreground mt-1">Manage amenities that can be assigned to rooms and services.</p>
        </div>
        <Button onClick={handleAddAmenity} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Amenity
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Input
              placeholder="Search by name, category or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          {filteredAmenities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No amenities found. Add one to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAmenities.map((amenity) => (
                <Card key={amenity.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold text-foreground">{amenity.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-semibold text-foreground">{amenity.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${
                            amenity.active
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {amenity.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAmenity(amenity)}
                          className="gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteId(amenity.id)}
                          className="gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    {amenity.description && (
                      <p className="text-sm text-muted-foreground mt-4">{amenity.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Amenity</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this amenity? This action cannot be undone.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAmenity}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Footer Branding Engine */}
      <div className="pt-20 pb-10 flex flex-col items-center gap-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="flex items-center gap-8">
          
          <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.8em] animate-pulse">
            @Sabih Software
          </p>
          
        </div>
      </div>
    </div>
  );
}
