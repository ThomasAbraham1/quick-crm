import { QueryClient } from '@tanstack/react-query';

/**
 * Create and configure the QueryClient for TanStack Query.
 * 
 * Configuration explained:
 * - defaultOptions: Settings that apply to ALL queries unless overridden
 * - staleTime: How long data is considered "fresh" (won't refetch during this time)
 * - cacheTime: How long inactive data stays in cache before garbage collection
 * - retry: Number of automatic retry attempts on failure
 * - refetchOnWindowFocus: Whether to refetch when user returns to the tab
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is fresh for 1 minute (won't refetch if accessed within this time)
            staleTime: 60 * 1000, // 60 seconds

            // Keep unused data in cache for 5 minutes before removing
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly called 'cacheTime')

            // Retry failed requests once (useful for network hiccups)
            retry: 1,

            // Refetch when user focuses the window (e.g., returns to tab)
            refetchOnWindowFocus: true,

            // Don't refetch on component mount if data is already cached
            refetchOnMount: false,
        },
    },
});
