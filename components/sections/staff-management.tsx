'use client';

import { useState } from 'react';
import { getUsers, saveUser } from '@/lib/db';
import { User } from '@/lib/types';
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
import { Plus, Edit2, Key, Shield, Users as UsersIcon } from 'lucide-react';
import StaffForm from '@/components/forms/staff-form';

const roleInfo = {
  owner: { label: 'Owner', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Shield },
  manager: { label: 'Manager', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: UsersIcon },
  receptionist: { label: 'Receptionist', color: 'bg-green-100 text-green-800 border-green-300', icon: Key },
  
};

export default function StaffManagement() {
  const [staff, setStaff] = useState(getUsers());
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staff.filter(s => {
    const matchesRole = filterRole === 'all' || s.role === filterRole;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  const handleEditStaff = (staffMember: User) => {
    setEditingStaff(staffMember);
    setShowForm(true);
  };

  const handleSaveStaff = (staffMember: User) => {
    saveUser(staffMember);
    setStaff(getUsers());
    setShowForm(false);
    setEditingStaff(null);
  };

  const staffStats = {
    total: staff.length,
    owners: staff.filter(s => s.role === 'owner').length,
    managers: staff.filter(s => s.role === 'manager').length,
    receptionists: staff.filter(s => s.role === 'receptionist').length,
  };

  if (showForm) {
    return (
      <StaffForm
        staff={editingStaff}
        onSave={handleSaveStaff}
        onCancel={() => {
          setShowForm(false);
          setEditingStaff(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-1">Manage team members and their roles</p>
        </div>
        <Button onClick={handleAddStaff} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{staffStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{staffStats.owners}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{staffStats.managers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receptionists</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{staffStats.receptionists}</p>
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
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                 
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <div className="space-y-3">
        {filteredStaff.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No staff members found. Add a team member to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredStaff.map(staffMember => {
            const roleData = roleInfo[staffMember.role as keyof typeof roleInfo];
            return (
              <Card key={staffMember.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold text-foreground">{staffMember.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-foreground text-sm">{staffMember.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${roleData.color}`}>
                        {roleData.label}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300 mt-1">
                        Active
                      </span>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStaff(staffMember)}
                        className="gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Permissions</CardTitle>
          <CardDescription>Overview of what each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-foreground mb-2">Owner</p>
              <p className="text-sm text-muted-foreground">Full access to all features, staff management, reports, and settings</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">Manager</p>
              <p className="text-sm text-muted-foreground">Access to bookings, rooms, staff shifts, and basic reports</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">Receptionist</p>
              <p className="text-sm text-muted-foreground">Access to booking management and check-in/check-out only</p>
            </div>
          
          </div>
        </CardContent>
      </Card>
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
