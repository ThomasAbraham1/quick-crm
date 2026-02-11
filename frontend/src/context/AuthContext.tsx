
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';

interface User {
    _id: string;
    email: string;
    name: string;
    picture?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            // Call backend to get current user (uses httpOnly cookie)
            const response = await api.get('/auth/me');
            setUser(response.data);

            // If we are on the login page and authentication succeeds, redirect to dashboard
            // if (window.location.pathname === '/login') {
            //     window.location.replace('/');
            // }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = () => {
        // Redirect to backend OAuth endpoint
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
        window.location.href = `${backendUrl}/auth/google`;
    };

    const logout = async () => {
        try {
            // Call backend logout endpoint to clear cookie
            await api.post('/auth/logout');
            setUser(null);
            window.location.replace('/login');
        } catch (error) {
            console.error('Logout failed', error);
            // Force client-side logout anyway
            setUser(null);
            window.location.replace('/login');
        }
    };

    // Check auth on mount
    useEffect(() => {
        checkAuth();
    }, []);


    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
