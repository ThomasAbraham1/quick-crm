
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LayoutDashboard } from 'lucide-react';

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
