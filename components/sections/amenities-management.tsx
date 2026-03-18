'use client';

import { useState } from 'react';
import { getAmenities, saveAmenity, deleteAmenity } from '@/lib/db';
import { Amenity } from '@/lib/types';

import { Card, CardContent } from '@/components/ui/card';
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
    (amenity.description || '').toLowerCase().includes(searchTerm.toLowerCase())
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
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Amenities</h1>
        <Button onClick={handleAddAmenity}>
          <Plus className="w-4 h-4 mr-1" /> Add Amenity
        </Button>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search amenities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* LIST */}
      {filteredAmenities.length === 0 ? (
        <div className="text-center text-muted-foreground p-6">
          No amenities found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredAmenities.map((amenity) => (
            <Card key={amenity.id} className="hover:border-primary/50 transition">
              <CardContent className="p-4 flex justify-between items-center">
                
                {/* LEFT - Text Content Only */}
                <div>
                  <p className="font-semibold text-lg">{amenity.name}</p>
                  {amenity.description && (
                    <p className="text-sm text-muted-foreground">
                      {amenity.description}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditAmenity(amenity)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => setDeleteId(amenity.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Amenity?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAmenity}>
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