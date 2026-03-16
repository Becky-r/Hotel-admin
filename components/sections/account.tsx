'use client';

import { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Shield,
  Image,
  Bell,
  History,
  Monitor,
  Mail,
  Moon,
  Globe,
  Lock,
  LogOut,
  Settings,
  Trash2,
  Link,
  Upload,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';

interface AccountProps {
  user: UserType;
}

export default function Account({ user }: AccountProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // State for each feature
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [activityHistory, setActivityHistory] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>(['Current Device']);
  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [language, setLanguage] = useState('en');
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    dataSharing: false
  });
  const [sessions, setSessions] = useState<string[]>(['Current Session']);
  const [dashboardLayout, setDashboardLayout] = useState('default');
  const [socialAccounts, setSocialAccounts] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accountSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setTwoFAEnabled(settings.twoFAEnabled || false);
        setNotifications(settings.notifications || notifications);
        setLanguage(settings.language || 'en');
        setPrivacySettings(settings.privacySettings || privacySettings);
        setDashboardLayout(settings.dashboardLayout || 'default');
        setSocialAccounts(settings.socialAccounts || []);
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }
  }, []);

  // Save to localStorage
  const saveSettings = () => {
    const settings = {
      twoFAEnabled,
      notifications,
      language,
      privacySettings,
      dashboardLayout,
      socialAccounts
    };
    try {
      localStorage.setItem('accountSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  };

  useEffect(() => {
    if (mounted) {
      saveSettings();
    }
  }, [twoFAEnabled, notifications, language, privacySettings, dashboardLayout, socialAccounts, mounted]);

  // Handlers
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoutAll = () => {
    setSessions(['Current Session']);
    alert('Logged out from all devices');
  };

  const handleDeleteAccount = () => {
    alert('Account deletion initiated. This is a demo.');
  };

  const connectSocial = (platform: string) => {
    if (!socialAccounts.includes(platform)) {
      setSocialAccounts([...socialAccounts, platform]);
    }
  };

  const disconnectSocial = (platform: string) => {
    setSocialAccounts(socialAccounts.filter(acc => acc !== platform));
  };

  const features = [
    {
      icon: Shield,
      title: 'Two-Factor Authentication (2FA) security',
      description: 'Add an extra layer of security to your account with 2FA.',
      component: (
        <div className="flex items-center space-x-2">
          <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
          <span>{twoFAEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      )
    },
    {
      icon: Image,
      title: 'Profile picture customization',
      description: 'Upload and customize your profile picture.',
      component: (
        <div className="space-y-2">
          {profilePicture && <img src={profilePicture} alt="Profile" className="w-16 h-16 rounded-full" />}
          <Input type="file" accept="image/*" onChange={handleProfilePictureUpload} />
        </div>
      )
    },
    {
      icon: Bell,
      title: 'Advanced notification settings',
      description: 'Customize how and when you receive notifications.',
      component: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch checked={notifications.email} onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} />
            <Label>Email notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={notifications.push} onCheckedChange={(checked) => setNotifications({...notifications, push: checked})} />
            <Label>Push notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={notifications.sms} onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})} />
            <Label>SMS notifications</Label>
          </div>
        </div>
      )
    },
    {
      icon: History,
      title: 'Account activity history',
      description: 'View a log of your account activities and changes.',
      component: (
        <div>
          <p>Recent activities:</p>
          <ul className="list-disc list-inside">
            {activityHistory.length > 0 ? activityHistory.map((act, i) => <li key={i}>{act}</li>) : <li>No recent activity</li>}
          </ul>
        </div>
      )
    },
    {
      icon: Monitor,
      title: 'Login device management',
      description: 'Manage devices that are logged into your account.',
      component: (
        <div>
          <p>Logged in devices:</p>
          <ul className="list-disc list-inside">
            {devices.map((device, i) => <li key={i}>{device}</li>)}
          </ul>
        </div>
      )
    },
    {
      icon: Mail,
      title: 'Email and phone verification',
      description: 'Verify your email and phone number for security.',
      component: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {emailVerified ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
            <span>Email: {emailVerified ? 'Verified' : 'Not verified'}</span>
          </div>
          <div className="flex items-center space-x-2">
            {phoneVerified ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
            <span>Phone: {phoneVerified ? 'Verified' : 'Not verified'}</span>
          </div>
        </div>
      )
    },
    {
      icon: Moon,
      title: 'Dark mode preference',
      description: 'Switch between light and dark themes.',
      component: mounted ? (
        <div className="flex items-center space-x-2">
          <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme?.(checked ? 'dark' : 'light')} />
          <span>{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
        </div>
      ) : (
        <div>Loading theme...</div>
      )
    },
    {
      icon: Globe,
      title: 'Language selection',
      description: 'Choose your preferred language for the interface.',
      component: (
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    {
      icon: Lock,
      title: 'Privacy and security settings',
      description: 'Control your privacy and security preferences.',
      component: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch checked={privacySettings.profileVisible} onCheckedChange={(checked) => setPrivacySettings({...privacySettings, profileVisible: checked})} />
            <Label>Profile visible to others</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={privacySettings.dataSharing} onCheckedChange={(checked) => setPrivacySettings({...privacySettings, dataSharing: checked})} />
            <Label>Data sharing</Label>
          </div>
        </div>
      )
    },
    {
      icon: LogOut,
      title: 'Session management (logout from all devices)',
      description: 'Log out from all devices where you are signed in.',
      component: (
        <Button variant="destructive" onClick={handleLogoutAll}>
          Logout from all devices
        </Button>
      )
    },
    {
      icon: Settings,
      title: 'Personal dashboard customization',
      description: 'Customize your dashboard layout and widgets.',
      component: (
        <Select value={dashboardLayout} onValueChange={setDashboardLayout}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    {
      icon: Trash2,
      title: 'Account deletion or deactivation option',
      description: 'Permanently delete or temporarily deactivate your account.',
      component: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
    {
      icon: Link,
      title: 'Connected social accounts (Facebook, TikTok, Instagram)',
      description: 'Connect and manage your social media accounts.',
      component: (
        <div className="space-y-2">
          {['Facebook', 'TikTok', 'Instagram'].map(platform => (
            <div key={platform} className="flex items-center justify-between">
              <span>{platform}</span>
              {socialAccounts.includes(platform) ? (
                <Button variant="outline" onClick={() => disconnectSocial(platform)}>Disconnect</Button>
              ) : (
                <Button onClick={() => connectSocial(platform)}>Connect</Button>
              )}
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/20">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Account Settings</h2>
              <p className="text-muted-foreground mt-1">Manage your account preferences and security settings</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12"></div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border/30">
                  {feature.component}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Account Information</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User ID</p>
            <p className="text-sm font-mono break-all text-foreground">{user.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Account Created</p>
            <p className="text-sm text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</p>
            <p className="text-sm text-foreground capitalize">{user.role}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
            <p className="text-sm text-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
