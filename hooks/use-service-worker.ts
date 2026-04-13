import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}

export interface UseServiceWorkerReturn extends ServiceWorkerStatus {
  promptUpdate: () => void;
}

/**
 * Hook para registrar e gerenciar o Service Worker
 * Implementa cache, offline support e atualização de app
 *
 * Uso:
 * ```tsx
 * const { isRegistered, isOnline, updateAvailable, promptUpdate } = useServiceWorker();
 * ```
 */
export function useServiceWorker(): UseServiceWorkerReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Only register on web platform
    if (Platform.OS !== 'web') {
      return;
    }

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Workers not supported');
      return;
    }

    setIsSupported(true);

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });

        console.log('[PWA] Service Worker registered:', registration);
        setIsRegistered(true);

        // Check for updates periodically (every 1 hour)
        const updateCheckInterval = setInterval(() => {
          registration.update().catch((error) => {
            console.warn('[PWA] Erro ao verificar atualizações:', error);
          });
        }, 3600000);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] Update available');
                setUpdateAvailable(true);
              }
            });
          }
        });

        return () => clearInterval(updateCheckInterval);
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptUpdate = () => {
    if (updateAvailable) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            setTimeout(() => window.location.reload(), 500);
          }
        });
      });
    }
  };

  return {
    isSupported,
    isRegistered,
    isOnline,
    updateAvailable,
    promptUpdate,
  };
}
