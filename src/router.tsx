import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexProvider } from 'convex/react'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const envUrl = import.meta.env.VITE_CONVEX_URL
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('CONVEX_OVERRIDE_URL') : null
  const finalUrl = localUrl || envUrl || 'https://anonymous-agent-3210.convex.cloud'
  
  if (!envUrl && !localUrl) {
    console.warn('Using fallback database. Setup your VITE_CONVEX_URL for production.')
  }

  const convexQueryClient = new ConvexQueryClient(finalUrl)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        gcTime: 5000,
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: 'intent',
      context: { queryClient },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      defaultErrorComponent: ({ error }) => (
        <div className="p-8 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-slate-900">Something went wrong</h2>
          <p className="text-slate-500 mb-8 max-w-md">{error.message || "We're having trouble connecting to the database."}</p>
          <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Return Home</a>
        </div>
      ),
      defaultNotFoundComponent: () => (
        <div className="p-8 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Page Not Found</h2>
          <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Return Home</a>
        </div>
      ),
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      ),
    }),
    queryClient,
  )

  return router
}
