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
        mutationFn: async (data: { templateId: string; force: boolean }) => {
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
            selectedContacts: string[];
            force: boolean;
        }) => {
            const response = await api.post('mail/launch', data);
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
 * Mutation hook to send a test email.
 * 
 * Usage:
 * const { mutate } = useSendTestEmail();
 * mutate({ 
 *   templateId: '123', 
 *   recipientEmail: 'test@example.com', 
 *   recipientName: 'Test User' 
 * });
 */
export const useSendTestEmail = () => {
    return useMutation({
        mutationFn: async (data: { templateId: string; recipientEmail: string; recipientName: string }) => {
            const response = await api.post('mail/template', data);
            return response.data;
        },
        // No cache invalidation needed for test emails
    });
};
