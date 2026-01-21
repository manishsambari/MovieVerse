import React, { useState, useEffect, useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const WatchlistButton = ({ movieId, size = "medium" }) => {
    const [inWatchlist, setInWatchlist] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            checkWatchlistStatus();
        }
    }, [movieId, user]);

    const checkWatchlistStatus = async () => {
        try {
            const res = await api.get('/watchlist');
            const isInList = res.data.some(movie => movie._id === movieId);
            setInWatchlist(isInList);
        } catch (err) {
            console.error('Error checking watchlist:', err);
        }
    };

    const toggleWatchlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Please login to add movies to your watchlist');
            return;
        }

        setLoading(true);
        try {
            if (inWatchlist) {
                await api.delete(`/watchlist/${movieId}`);
                setInWatchlist(false);
            } else {
                await api.post(`/watchlist/${movieId}`);
                setInWatchlist(true);
            }
        } catch (err) {
            console.error('Error toggling watchlist:', err);
            alert(err.response?.data?.message || 'Error updating watchlist');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Tooltip title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}>
            <IconButton
                onClick={toggleWatchlist}
                disabled={loading}
                size={size}
                sx={{
                    color: inWatchlist ? '#ffc107' : 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                        color: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)'
                    }
                }}
            >
                {inWatchlist ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default WatchlistButton;
