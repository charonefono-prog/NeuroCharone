import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

export const trpc = createTRPCClient<any>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
})
