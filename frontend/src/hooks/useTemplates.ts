import { useQuery } from '@tanstack/react-query';
import api from '../api';

/**
 * Interface matching the Template data structure from backend
 */
export interface Template {
    _id: string;
    name: string;
    subject: string;
    body: string;
    userId: string;
    createdAt: string;
}

/**
 * Custom hook to fetch all templates.
 * 
 * How it works:
 * - queryKey: ['templates'] - Unique identifier for caching templates data
 * - queryFn: Fetches templates from the API
 * - staleTime: 10 minutes - Templates rarely change, so longest cache time
 * 
 * Returns: data, isLoading, error, refetch
 */
export const useTemplates = () => {
    return useQuery<Template[]>({
        queryKey: ['templates'],
        queryFn: async () => {
            const response = await api.get('templates');
            // Backend now returns { data: Template[], pagination: {...} }
            // Extract just the data array
            return response.data.data || [];
        },
        // Templates don't change often, keep fresh for 10 minutes
        staleTime: 10 * 60 * 1000,
    });
};
