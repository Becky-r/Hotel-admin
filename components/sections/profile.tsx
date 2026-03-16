'use client';

import { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Settings, Sparkles, User } from 'lucide-react';

interface ProfileProps {
  user: UserType;
  onNavigate: (section: 'settings' | 'overview' | 'bookings' | 'rooms' | 'amenities' | 'services' | 'staff' | 'reports' | 'profile') => void;
}

export default function Profile({ user, onNavigate }: ProfileProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 text-primary p-3">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Role: <span className="capitalize">{user.role}</span>
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-6">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-sm text-muted-foreground">Update your preferences and account settings.</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => onNavigate('settings')}>
              Go to Settings
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Future Features</h3>
              <p className="text-sm text-muted-foreground">Coming soon: more tools to help you run your hotel.</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" disabled>
              Coming soon
            </Button>
          </div>
        </div>
      </section>

      <div className="rounded-lg border border-border bg-background p-6">
        <h3 className="text-lg font-semibold">Account Info</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">User ID</p>
            <p className="text-sm font-medium break-all">{user.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account created</p>
            <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
