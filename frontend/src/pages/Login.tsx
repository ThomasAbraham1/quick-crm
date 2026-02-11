
import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const Login = () => {
    const handleGoogleLogin = () => {
        // Redirect to backend OAuth endpoint
        // Using the user-specified URL: localhost:3002/auth/google
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
        window.location.href = `${backendUrl}/auth/google`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Welcome back to Quick CRM
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div>
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.64 2 12.2 2C6.42 2 2 6.5 2 12.27c0 5.77 4.42 10.27 10.2 10.27c5.85 0 9.72-4.29 9.72-10.2c0-.5-.1-1.1-.2-1.24z"
                                />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
