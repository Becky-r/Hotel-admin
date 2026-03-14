'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    }

    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      setIsInstallPromptVisible(true);
    });

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      console.log('Hotel Management app installed');
      setIsInstallPromptVisible(false);
    });
  }, []);

  return null;
}
