'use client';

export default function Settings() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage application-wide settings for your account.</p>
      </header>

      <div className="rounded-lg border border-border bg-background p-6">
        <p className="text-sm text-muted-foreground">
          This section is under construction. In the future, you will be able to update notification preferences, theme settings,
          and other account options here.
        </p>
      </div>
    </div>
  );
}
