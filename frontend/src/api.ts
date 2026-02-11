/// <reference types="vite/client" />
import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
    // Use the environment variable if available, otherwise fall back to 'http://localhost:3002' if not proxied
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true, // Important: Send cookies with every request
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle auth errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If the server returns 401 Unauthorized, redirect to login
            // Only redirect if we are not already on the login page to avoid loops
            // if (window.location.pathname !== '/login') {
            //     window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    }
);

export default api;
