import { useQuery } from '@tanstack/react-query';
import api from '../api';

/**
 * Interface matching the Contact data structure from backend
 */
export interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    dateAdded?: string;
    assignee?: string;
    callbackDate?: string;
    notes?: string;
    misc?: Record<string, any>;
    status: 'pending' | 'sent' | 'failed';
    history?: string[];
    userId: string;
    createdAt: string;
}

/**
 * Custom hook to fetch all contacts.
 * 
 * How it works:
 * - queryKey: ['contacts'] - Unique identifier for caching contacts data
 * - queryFn: Fetches contacts from the API
 * - staleTime: 5 minutes - Contacts don't change as frequently, so longer cache time
 * 
 * Returns: data, isLoading, error, refetch
 */
export const useContacts = () => {
    return useQuery<Contact[]>({
        queryKey: ['contacts'],
        queryFn: async () => {
            const response = await api.get('contacts');
            // Backend now returns { data: Contact[], pagination: {...} }
            // Extract just the data array
            return response.data.data || [];
        },
        // Contacts change less frequently, keep data fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
    });
};
