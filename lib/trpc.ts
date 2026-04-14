import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/routers";
import superjson from "superjson";

const getBaseUrl = () => {
  // Em produção, usar a URL do servidor
  if (typeof window === "undefined") {
    return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  }
  // No navegador, usar a URL do servidor
  return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      fetch: async (input, init?) => {
        const fetch = (await import("cross-fetch")).default;
        return fetch(input, {
          ...init,
          credentials: "include",
        });
      },
      transformer: superjson,
    }),
  ],
});
