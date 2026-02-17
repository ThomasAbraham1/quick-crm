import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Template } from './useTemplates';

/**
 * Mutation hook to create a new template.
 * 
 * Usage:
 * const { mutate, isPending, error } = useCreateTemplate();
 * mutate({ name: 'Welcome Email', subject: 'Welcome!', body: '<p>Hello {{name}}</p>' });
 */
export const useCreateTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (templateData: { name: string; subject: string; body: string }) => {
            const response = await api.post('templates', templateData);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate templates list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        },
    });
};

/**
 * Mutation hook to update an existing template.
 * 
 * Usage:
 * const { mutate } = useUpdateTemplate();
 * mutate({ id: '123', updates: { name: 'Updated Template Name' } });
 */
export const useUpdateTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Template> }) => {
            const response = await api.put(`templates/${id}`, updates);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate templates list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        },
    });
};

/**
 * Mutation hook to delete a template.
 * 
 * Usage:
 * const { mutate } = useDeleteTemplate();
 * mutate('template-id-123');
 */
export const useDeleteTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`templates/${id}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate templates list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        },
    });
};
