/// <reference types="vite/client" />
import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
    // Use the environment variable if available, otherwise fall back to '/api' (which triggers the Vite proxy)
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
