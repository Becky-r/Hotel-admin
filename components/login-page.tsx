'use client';

import { useState } from 'react';
import { getUserByEmail } from '@/lib/db';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = getUserByEmail(email);
      
      if (!user || user.password !== password) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      onLogin(user);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Hotel Management</h1>
          <p className="text-muted-foreground">Professional booking & management system</p>
        </div>

        <Card className="border border-border shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-input border-border"
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Demo Credentials</p>
              <div className="space-y-2 text-xs">
                <div className="bg-secondary/50 p-2 rounded border border-border">
                  <p className="font-medium">Owner Account</p>
                  <p className="text-muted-foreground">owner@hotel.com / owner123</p>
                </div>
                <div className="bg-secondary/50 p-2 rounded border border-border">
                  <p className="font-medium">Manager Account</p>
                  <p className="text-muted-foreground">manager@hotel.com / manager123</p>
                </div>
                <div className="bg-secondary/50 p-2 rounded border border-border">
                  <p className="font-medium">Receptionist Account</p>
                  <p className="text-muted-foreground">receptionist@hotel.com / receptionist123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
