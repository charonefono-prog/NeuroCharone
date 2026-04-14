import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Hook para registrar e gerenciar o Service Worker
 * Implementa cache, offline support e atualização de app
 *
 * Uso:
 * ```tsx
 * useServiceWorker();
 * ```
 */
export function useServiceWorker() {
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

      // Register service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });

        console.log('[PWA] Service Worker registered:', registration);

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

  }, []);
}
