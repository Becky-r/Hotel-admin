'use client';

import { useEffect, useState } from 'react';
import { initializeDatabase, getCurrentUser, setCurrentUser } from '@/lib/db';
import LoginPage from '@/components/login-page';
import Dashboard from '@/components/dashboard';
import { User } from '@/lib/types';

export default function Home() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize database on first load
    initializeDatabase();
    const user = getCurrentUser();
    setCurrentUserState(user);
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? (
    <Dashboard user={currentUser} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}
