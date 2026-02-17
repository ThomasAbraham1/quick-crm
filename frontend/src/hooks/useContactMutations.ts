import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Contact } from './useContacts';

/**
 * Mutation hook to create a new contact.
 * 
 * Usage:
 * const { mutate, isPending, error } = useCreateContact();
 * mutate({ name: 'John Doe', email: 'john@example.com', phone: '1234567890' });
 */
export const useCreateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (contactData: { name: string; email?: string; phone?: string }) => {
            const response = await api.post('contacts', contactData);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate contacts list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

/**
 * Mutation hook to bulk import contacts.
 * 
 * Usage:
 * const { mutate } = useImportContacts();
 * mutate({ contacts: [{ name: 'John', email: 'john@example.com' }, ...] });
 */
export const useImportContacts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { contacts: Array<{ name: string; email?: string; phone?: string;[key: string]: any }> }) => {
            const response = await api.post('contacts/import', data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate contacts list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

/**
 * Mutation hook to update an existing contact.
 * 
 * Usage:
 * const { mutate } = useUpdateContact();
 * mutate({ id: '123', updates: { name: 'Jane Doe' } });
 */
export const useUpdateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Contact> }) => {
            const response = await api.put(`contacts/${id}`, updates);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate contacts list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

/**
 * Mutation hook to delete a contact.
 * 
 * Usage:
 * const { mutate } = useDeleteContact();
 * mutate('contact-id-123');
 */
export const useDeleteContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`contacts/${id}`);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate contacts list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};
