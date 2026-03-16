'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Image as ImageIcon, Bell, History, Monitor, Mail, 
  Moon, Globe, Lock, LogOut, Settings, Trash2, Link as LinkIcon, 
  CheckCircle, XCircle, User, Eye, EyeOff, KeyRound, Smartphone,
  Facebook, Instagram, Github, AlertTriangle
} from 'lucide-react';

interface AccountProps {
  user: UserType;
}

export default function Account({ user }: AccountProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Password strength calculation
  const getStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length > 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Hero Header */}
      <div className="relative mb-8 p-8 rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 p-0.5 shadow-xl">
              <div className="h-full w-full rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="object-cover h-full w-full" />
                ) : (
                  <User className="h-10 w-10 text-slate-400" />
                )}
              </div>
            </div>
            <label className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl cursor-pointer hover:scale-110 transition-all shadow-lg border-2 border-slate-900">
              <ImageIcon className="h-4 w-4 text-white" />
              <input type="file" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setProfilePicture(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <Badge variant="secondary" className="bg-white/10 text-white border-none text-[10px] uppercase font-bold tracking-wider">
                {user.role}
              </Badge>
              <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] uppercase font-bold bg-green-500/10">
                Verified
              </Badge>
            </div>
            <p className="text-slate-400 flex items-center gap-2 text-sm italic">
              <Mail className="h-3 w-3" /> {user.email}
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <TabsList className="flex flex-col h-auto bg-transparent gap-1 w-full md:w-64">
          {[
            { id: 'general', label: 'Preferences', icon: Settings },
            { id: 'security', label: 'Security & Password', icon: Shield },
            { id: 'connected', label: 'Connected Apps', icon: LinkIcon },
            { id: 'danger', label: 'Privacy & Danger', icon: Trash2 },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="w-full justify-start gap-3 px-4 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 space-y-6">
          {/* GENERAL PREFERENCES TAB */}
          <TabsContent value="general" className="mt-0 space-y-6">
            <Card className="border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle>Appearance & Locale</CardTitle>
                <CardDescription>Customize how the platform looks and feels for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                  </div>
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={(checked) => setTheme?.(checked ? 'dark' : 'light')} 
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Language Selection</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle>Layout Preference</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-3 gap-4">
                    {['Default', 'Compact', 'Detailed'].map((layout) => (
                      <button key={layout} className="p-4 rounded-xl border-2 border-muted hover:border-primary transition-all text-center group">
                        <Monitor className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs font-medium">{layout}</span>
                      </button>
                    ))}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY & PASSWORD TAB */}
          <TabsContent value="security" className="mt-0 space-y-6">
            <Card className="border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <CardTitle>Change Password</CardTitle>
                </div>
                <CardDescription>Secure your account with a unique password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" placeholder="••••••••" className="max-w-md" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="new" 
                        type={showPassword ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 chars" 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-primary transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            getStrength(newPassword) >= i * 25 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" placeholder="Confirm new password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 flex justify-end">
                <Button size="sm" className="rounded-lg shadow-lg shadow-primary/20">Update Password</Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Security Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex gap-4 items-center">
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Verify via SMS or Authenticator App</p>
                    </div>
                  </div>
                  <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2 tracking-widest">
                    <History className="h-3 w-3" /> Recent Security Events
                  </h4>
                  <div className="rounded-xl border divide-y overflow-hidden">
                    {[
                      { event: 'Password Changed', date: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
                      { event: 'New Login: Chrome on Windows', date: 'Oct 24, 2025', icon: Monitor, color: 'text-blue-500' },
                      { event: 'Failed Login Attempt', date: 'Oct 20, 2025', icon: AlertTriangle, color: 'text-red-500' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-3 text-sm bg-white dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                          <log.icon className={`h-4 w-4 ${log.color}`} />
                          <span>{log.event}</span>
                        </div>
                        <span className="text-xs text-slate-400">{log.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                   <h4 className="text-sm font-medium">Logged in Devices</h4>
                   <div className="space-y-2">
                    {['MacBook Pro - New York, USA', 'iPhone 15 - London, UK'].map((device, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          {device}
                        </div>
                        {i === 0 && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Current</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 py-4">
                <Button variant="outline" className="w-full rounded-xl">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out of all other sessions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* CONNECTIONS TAB */}
          <TabsContent value="connected" className="mt-0">
            <Card className="border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
              <CardHeader>
                <CardTitle>Connected Social Accounts</CardTitle>
                <CardDescription>Speed up your login process by linking accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Github', icon: Github, color: 'group-hover:text-white group-hover:bg-slate-800', connected: true },
                  { name: 'Instagram', icon: Instagram, color: 'group-hover:text-white group-hover:bg-pink-600', connected: false },
                  { name: 'Facebook', icon: Facebook, color: 'group-hover:text-white group-hover:bg-blue-600', connected: false },
                ].map((social) => (
                  <div key={social.name} className="flex items-center justify-between p-4 border rounded-2xl hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${social.color} transition-all`}>
                        <social.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{social.name}</span>
                    </div>
                    <Button variant={social.connected ? "outline" : "default"} size="sm" className="rounded-xl">
                      {social.connected ? 'Disconnect' : 'Link Account'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DANGER ZONE TAB */}
          <TabsContent value="danger" className="mt-0">
            <Card className="border-red-200 bg-red-50/30 dark:bg-red-950/10 dark:border-red-900 shadow-md">
              <CardHeader>
                <CardTitle className="text-red-600">Account Destruction</CardTitle>
                <CardDescription>This will permanently erase all your data. This cannot be undone.</CardDescription>
              </CardHeader>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="rounded-xl">Delete Account Forever</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your profile and remove all your data from our servers. 
                        This action is irreversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-xl">Confirm Deletion</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
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