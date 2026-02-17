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

interface PaginatedResponse {
    data: Contact[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Custom hook to fetch contacts with pagination.
 * 
 * @param page - Current page number (1-indexed)
 * @param limit - Number of items per page
 * 
 * How it works:
 * - queryKey: ['contacts', page, limit] - Unique cache key per page/limit combo
 * - queryFn: Fetches contacts with pagination params from the API
 * - staleTime: 5 minutes - Contacts don't change as frequently, so longer cache time
 * 
 * Returns: { data: Contact[], pagination, isLoading, error, refetch }
 */
export const useContacts = (page: number = 1, limit: number = 20) => {
    return useQuery<PaginatedResponse>({
        queryKey: ['contacts', page, limit],
        queryFn: async () => {
            const response = await api.get('contacts', {
                params: { page, limit }
            });
            return response.data;
        },
        // Contacts change less frequently, keep data fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Keep previous data while fetching new page (prevents flash)
        placeholderData: (previousData) => previousData,
    });
};
