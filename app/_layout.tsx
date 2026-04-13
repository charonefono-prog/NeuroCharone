import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform, View, Text } from "react-native";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";


import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { AuthProvider, useAuth } from "@/lib/auth-context";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Guard: Redirecionar para login quando logout
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && segments?.[0] !== "(auth)") {
        console.log('Guard: Nao autenticado, redirecionando para login');
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
  }, []);

  // Register Service Worker for PWA (only on web)
  if (Platform.OS === "web") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useServiceWorker();
  }

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Create clients once and reuse them
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus for mobile
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
            // Stale time: 5 minutes
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    createTRPCClient({
      url: Platform.OS === "web"
        ? `${window.location.origin}/api/trpc`
        : "http://localhost:3000/api/trpc",
    })
  );

  const trpcUtils = useMemo(
    () => trpc.createClient({ links: [] }),
    []
  );

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaFrameContext.Provider value={frame}>
        <SafeAreaInsetsContext.Provider value={insets}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
              <QueryClientProvider client={queryClient}>
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                  <StatusBar barStyle="light-content" />
                  <Stack
                    key={isAuthenticated ? "authenticated" : "unauthenticated"}
                    screenOptions={{
                      headerShown: false,
                      animationEnabled: true,
                    }}
                  >
                    {isAuthenticated ? (
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    ) : (
                      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    )}
                  </Stack>
                </trpc.Provider>
              </QueryClientProvider>
            </ThemeProvider>
          </GestureHandlerRootView>
        </SafeAreaInsetsContext.Provider>
      </SafeAreaFrameContext.Provider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
