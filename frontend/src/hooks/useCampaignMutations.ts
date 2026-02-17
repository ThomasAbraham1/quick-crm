import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Campaign } from './useCampaigns';

/**
 * Mutation hook to create a new campaign.
 * 
 * How it works:
 * - mutationFn: Function that posts the new campaign to the API
 * - onSuccess: Invalidates the 'campaigns' query to trigger a refetch
 * 
 * Usage:
 * const { mutate, isPending, error } = useCreateCampaign();
 * mutate({ name: 'My Campaign', templateId: '123', totalContacts: 100 });
 */
export const useCreateCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (campaignData: { name: string; templateId: string; totalContacts: number }) => {
            const response = await api.post('campaigns', campaignData);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate campaigns list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });
};

/**
 * Mutation hook to update an existing campaign.
 * 
 * Usage:
 * const { mutate } = useUpdateCampaign();
 * mutate({ id: '123', updates: { name: 'Updated Name' } });
 */
export const useUpdateCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
            const response = await api.put(`campaigns/${id}`, updates);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate both the list and the specific campaign
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] });
        },
    });
};

/**
 * Mutation hook to delete a campaign.
 * 
 * Usage:
 * const { mutate } = useDeleteCampaign();
 * mutate('campaign-id-123');
 */
export const useDeleteCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`campaigns/${id}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate campaigns list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });
};
