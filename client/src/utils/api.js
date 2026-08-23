import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if (!token) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                token = user?.accessToken;
            } catch {
                token = null;
            }
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect on 401 if not already on auth pages
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getPosterUrl = (posterPath, size = 'w500') => {
    if (!posterPath) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
    if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) return posterPath;
    if (posterPath.startsWith('/images')) {
        const base = import.meta.env.VITE_API_URL || '';
        return `${base}${posterPath}`;
    }
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

export const getBackdropUrl = (backdropPath, posterPath, size = 'original') => {
    const path = backdropPath || posterPath;
    if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/images')) {
        const base = import.meta.env.VITE_API_URL || '';
        return `${base}${path}`;
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default api;

