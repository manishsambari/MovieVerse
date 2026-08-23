import React, { useContext } from 'react';
import { IconButton, Tooltip, Button } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { WatchlistContext } from '../context/WatchlistContext';
import { AuthContext } from '../context/AuthContext';

const WatchlistButton = ({ movie, movieId, size = "medium", variant = "icon", fullWidth = false }) => {
    const { user } = useContext(AuthContext);
    const { isInWatchlist, toggleWatchlist } = useContext(WatchlistContext);

    const id = movieId || movie?._id;
    const inWatchlist = isInWatchlist(id);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(movie || { _id: id });
    };

    if (variant === "button") {
        return (
            <Button
                variant={inWatchlist ? "outlined" : "contained"}
                color={inWatchlist ? "primary" : "primary"}
                startIcon={inWatchlist ? <CheckIcon /> : <AddIcon />}
                onClick={handleClick}
                fullWidth={fullWidth}
                size={size}
                sx={{
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: '50px',
                    borderColor: inWatchlist ? '#f5c518' : undefined,
                    bgcolor: inWatchlist ? 'rgba(245, 197, 24, 0.1)' : '#f5c518',
                    color: inWatchlist ? '#f5c518' : '#000',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        bgcolor: inWatchlist ? 'rgba(245, 197, 24, 0.2)' : '#e0b315',
                        borderColor: '#f5c518',
                        transform: 'translateY(-2px)',
                    }
                }}
            >
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
        );
    }

    return (
        <Tooltip title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}>
            <IconButton
                onClick={handleClick}
                size={size}
                sx={{
                    bgcolor: inWatchlist ? 'rgba(245, 197, 24, 0.95)' : 'rgba(0, 0, 0, 0.65)',
                    color: inWatchlist ? '#000' : '#fff',
                    backdropFilter: 'blur(4px)',
                    border: inWatchlist ? '1px solid #f5c518' : '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    '&:hover': {
                        bgcolor: inWatchlist ? '#f5c518' : 'rgba(0, 0, 0, 0.9)',
                        color: inWatchlist ? '#000' : '#f5c518',
                        borderColor: '#f5c518',
                        transform: 'scale(1.15)',
                    }
                }}
            >
                {inWatchlist ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
        </Tooltip>
    );
};

export default WatchlistButton;
