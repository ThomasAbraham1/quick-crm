import { useQuery } from '@tanstack/react-query';
import api from '../api';

/**
 * Interface matching the Campaign data structure from backend
 */
export interface Campaign {
    _id: string;
    name: string;
    templateId: string;
    totalContacts: number;
    sentCount: number;
    openedCount: number;
    failedCount: number;
    status: string;
    createdAt: string;
}

/**
 * Custom hook to fetch all campaigns.
 * 
 * How it works:
 * - queryKey: ['campaigns'] - Unique identifier for this query (used for caching)
 * - queryFn: Function that actually fetches the data from the API
 * - staleTime: 30 seconds - Data is considered fresh for 30s (campaigns update frequently)
 * 
 * Returns:
 * - data: Array of campaigns (undefined while loading)
 * - isLoading: true during initial fetch
 * - error: Any error that occurred
 * - refetch: Function to manually refetch campaigns
 */
export const useCampaigns = () => {
    return useQuery<Campaign[]>({
        queryKey: ['campaigns'],
        queryFn: async () => {
            const response = await api.get('campaigns');
            // Backend now returns { data: Campaign[], pagination: {...} }
            // Extract just the data array
            return response.data.data || [];
        },
        // Campaigns list changes when new campaigns are created
        // Keep fresh for 30 seconds
        staleTime: 30 * 1000,
    });
};
