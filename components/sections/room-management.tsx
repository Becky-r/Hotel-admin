'use client';

import { useState, useEffect } from 'react';
import { getRooms, saveRoom, getRoomTypes, saveRoomType } from '@/lib/db';
import { Room, RoomType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Image as ImageIcon } from 'lucide-react';
import RoomForm from '@/components/forms/room-form';
import RoomTypeForm from '@/components/forms/room-type-form';
import SimpleRoomForm from '@/components/forms/simple-room-form';

const roomStatusColors = {
  available: 'bg-green-100 text-green-800 border-green-300',
  occupied: 'bg-blue-100 text-blue-800 border-blue-300',
  maintenance: 'bg-orange-100 text-orange-800 border-orange-300',
  outofservice: 'bg-red-100 text-red-800 border-red-300',
};

export default function RoomManagement() {
  const [rooms, setRooms] = useState(getRooms());
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // === Room Type States ===
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  // Load room types on component mount
  useEffect(() => {
    setRoomTypes(getRoomTypes());
  }, []);

  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);

  const filteredRooms = rooms.filter((room: Room) => {
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesType = filterType === 'all' || room.roomType === filterType;
    return matchesStatus && matchesType;
  });

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowForm(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleSaveRoom = (room: Room) => {
    saveRoom(room);
    setRooms(getRooms());
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleStatusChange = (roomId: string, newStatus: Room['status']) => {
    const room = rooms.find((r: Room) => r.id === roomId);
    if (room) {
      room.status = newStatus;
      saveRoom(room);
      setRooms(getRooms());
    }
  };

  // === Room Type Handlers ===
  const handleAddRoomType = () => {
    setEditingRoomType(null);
    setShowTypeForm(true);
  };

  const handleEditRoomType = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setShowTypeForm(true);
  };

  const handleSaveRoomType = (roomType: RoomType) => {
    // Check for duplicate names (excluding the current room type being edited)
    const existingRoomTypes = getRoomTypes();
    const duplicate = existingRoomTypes.find(rt =>
      rt.name.toLowerCase() === roomType.name.toLowerCase() &&
      rt.id !== roomType.id
    );

    if (duplicate) {
      alert(`A room type with the name "${roomType.name}" already exists. Please choose a different name.`);
      return;
    }

    saveRoomType(roomType);
    setRoomTypes(getRoomTypes());
    setShowTypeForm(false);
    setEditingRoomType(null);
  };

  const roomStats = {
    total: rooms.length,
    available: rooms.filter((r: Room) => r.status === 'available').length,
    occupied: rooms.filter((r: Room) => r.status === 'occupied').length,
    maintenance: rooms.filter((r: Room) => r.status === 'maintenance').length,
  };

  if (showTypeForm) {
    return (
      <RoomTypeForm
        roomType={editingRoomType}
        onSave={handleSaveRoomType}
        onCancel={() => {
          setShowTypeForm(false);
          setEditingRoomType(null);
        }}
      />
    );
  }

  if (showForm) {
    return (
      editingRoom ? (
        <RoomForm
          room={editingRoom}
          roomTypes={roomTypes.map(rt => rt.name)}
          onSave={handleSaveRoom}
          onCancel={() => {
            setShowForm(false);
            setEditingRoom(null);
          }}
        />
      ) : (
        <SimpleRoomForm
          roomTypes={roomTypes}
          onSave={handleSaveRoom}
          onCancel={() => {
            setShowForm(false);
            setEditingRoom(null);
          }}
        />
      )
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with buttons */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground mt-1">Manage rooms, pricing, and availability</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAddRoom}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </Button>

          <Button
            onClick={handleAddRoomType}
            variant="outline"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
             Room Type
          </Button>
        </div>
      </div>

      {/* Room Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{roomStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{roomStats.available}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{roomStats.occupied}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{roomStats.maintenance}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {roomTypes.map((type: RoomType) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="Outofservice">Out of service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No rooms found. Add a new room to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRooms.map((room: Room) => (
            <Card key={room.id} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Room {room.roomNumber}</CardTitle>
                    <CardDescription className="capitalize mt-1">{room.roomType}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${roomStatusColors[room.status]}`}>
                    {room.status}
                  </span>
                </div>
              </CardHeader>

              {/* Room Image */}
              {room.image ? (
                <div className="px-6 pb-3">
                  <div className="w-full h-32 rounded-lg overflow-hidden border border-border">
                    <img
                      src={room.image}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="px-6 pb-3">
                  <div className="w-full h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
              )}

              <CardContent className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price per Night</p>
                  <p className="text-xl font-bold">${room.currentPrice}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-secondary text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Change Status</label>
                  <Select value={room.status} onValueChange={(status) => handleStatusChange(room.id, status as any)}>
                    <SelectTrigger className="bg-input border-border text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="Outofservice">Out of service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditRoom(room)}
                    className="flex-1 gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
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