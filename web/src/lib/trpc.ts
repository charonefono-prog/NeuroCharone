import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/routers';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      async headers() {
        const token = localStorage.getItem('token');
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});
