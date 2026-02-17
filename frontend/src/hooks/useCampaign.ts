import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Campaign } from './useCampaigns';

/**
 * Custom hook to fetch a single campaign by ID with automatic polling.
 * 
 * This is perfect for the CampaignDetail page where you need real-time updates.
 * 
 * How it works:
 * - queryKey: ['campaign', id] - Unique key that includes the campaign ID
 * - queryFn: Fetches the specific campaign from the API
 * - refetchInterval: 3000ms (3 seconds) - Automatically refetches every 3 seconds
 * - enabled: Only runs the query if an ID is provided
 * 
 * The refetchInterval replaces your manual setInterval logic!
 * 
 * @param id - The campaign ID to fetch
 */
export const useCampaign = (id: string | undefined) => {
    return useQuery<Campaign>({
        queryKey: ['campaign', id],
        queryFn: async () => {
            const response = await api.get(`campaigns/${id}`);
            return response.data;
        },
        // Poll every 3 seconds for live updates (replaces your manual setInterval)
        refetchInterval: 3000,
        // Only run the query if we have an ID
        enabled: !!id,
        // Keep data fresh for a short time since we're polling
        staleTime: 2000,
    });
};
