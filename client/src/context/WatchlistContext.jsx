import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';
import { Snackbar, Alert } from '@mui/material';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const [watchlistIds, setWatchlistIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    const fetchWatchlist = useCallback(async () => {
        if (!user) {
            setWatchlist([]);
            setWatchlistIds(new Set());
            return;
        }

        setLoading(true);
        try {
            const res = await api.get('/watchlist');
            const list = Array.isArray(res.data) ? res.data : [];
            setWatchlist(list);
            setWatchlistIds(new Set(list.map((m) => (m._id ? m._id.toString() : m.toString()))));
        } catch (err) {
            console.error('Error fetching watchlist:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]);

    const isInWatchlist = useCallback((movieId) => {
        if (!movieId) return false;
        return watchlistIds.has(movieId.toString());
    }, [watchlistIds]);

    const toggleWatchlist = async (movie) => {
        if (!user) {
            setToast({
                open: true,
                message: 'Please sign in to save movies to your watchlist',
                severity: 'info',
            });
            return false;
        }

        const movieId = typeof movie === 'string' ? movie : movie?._id;
        if (!movieId) return false;
        const idStr = movieId.toString();
        const currentlyIn = watchlistIds.has(idStr);

        // Optimistic update
        const nextIds = new Set(watchlistIds);
        if (currentlyIn) {
            nextIds.delete(idStr);
            setWatchlistIds(nextIds);
            setWatchlist(prev => prev.filter(m => (m._id || m).toString() !== idStr));
            setToast({
                open: true,
                message: `Removed "${movie?.title || 'Movie'}" from your Watchlist`,
                severity: 'info'
            });
        } else {
            nextIds.add(idStr);
            setWatchlistIds(nextIds);
            if (typeof movie === 'object' && movie?._id) {
                setWatchlist(prev => [movie, ...prev]);
            }
            setToast({
                open: true,
                message: `Added "${movie?.title || 'Movie'}" to your Watchlist!`,
                severity: 'success'
            });
        }

        try {
            if (currentlyIn) {
                await api.delete(`/watchlist/${idStr}`);
            } else {
                await api.post(`/watchlist/${idStr}`);
            }
            return true;
        } catch (err) {
            console.error('Error updating watchlist:', err);
            fetchWatchlist();
            setToast({
                open: true,
                message: err.response?.data?.message || 'Failed to update watchlist',
                severity: 'error'
            });
            return false;
        }
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') return;
        setToast(prev => ({ ...prev, open: false }));
    };

    return (
        <WatchlistContext.Provider
            value={{
                watchlist,
                watchlistIds,
                loading,
                fetchWatchlist,
                isInWatchlist,
                toggleWatchlist,
            }}
        >
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseToast}
                    severity={toast.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        bgcolor: toast.severity === 'success' ? '#f5c518' : undefined,
                        color: toast.severity === 'success' ? '#000' : undefined,
                        fontWeight: 600,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        '& .MuiAlert-icon': {
                            color: toast.severity === 'success' ? '#000' : undefined
                        }
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </WatchlistContext.Provider>
    );
};
