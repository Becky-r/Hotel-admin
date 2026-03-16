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
