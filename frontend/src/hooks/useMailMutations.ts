import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

/**
 * Mutation hook to check campaign viability before launching.
 * 
 * This is a special mutation that doesn't modify data but performs a check.
 * 
 * Usage:
 * const { mutate, data } = useCheckCampaign();
 * mutate({ templateId: '123', force: false }, {
 *   onSuccess: (result) => console.log(result.candidates)
 * });
 */
export const useCheckCampaign = () => {
    return useMutation({
        mutationFn: async (data: { templateId: string; contacts: any[]; force: boolean }) => {
            const response = await api.post('mail/check-campaign', data);
            return response.data;
        },
        // No cache invalidation needed since this is just a check
    });
};

/**
 * Mutation hook to launch a campaign.
 * 
 * Usage:
 * const { mutate, isPending } = useLaunchCampaign();
 * mutate({ 
 *   campaignName: 'Summer Sale', 
 *   templateId: '123', 
 *   selectedContacts: ['id1', 'id2'], 
 *   force: false 
 * });
 */
export const useLaunchCampaign = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            campaignName: string;
            templateId: string;
            selectedContacts: any[]; // Changed to any[] to match full contact object
            force: boolean;
        }) => {
            // Map selectedContacts to 'contacts' as expected by backend
            const payload = {
                name: data.campaignName,
                templateId: data.templateId,
                contacts: data.selectedContacts,
                force: data.force
            };
            const response = await api.post('mail/launch', payload);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate campaigns and contacts to reflect updated data
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

/**
 * Mutation hook to create a template quickly (used for testing/launch).
 */
export const useCreateQuickTemplate = () => {
    return useMutation({
        mutationFn: async (data: { subject: string; body: string }) => {
            const response = await api.post('mail/template', data);
            return response.data;
        },
    });
};
