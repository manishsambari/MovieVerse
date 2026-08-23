import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    TextField,
    InputAdornment,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Chip,
    IconButton,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import api, { getPosterUrl } from '../utils/api';

const SearchDialog = ({ open, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Listen for Ctrl+K / Cmd+K global shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (open) {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            setQuery('');
            setResults([]);
            return;
        }

        if (!query.trim()) {
            // Load top 5 popular movies as suggestions
            api.get('/movies?limit=5').then(res => {
                setResults(res.data.movies || []);
            }).catch(() => setResults([]));
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await api.get(`/movies/search?q=${encodeURIComponent(query)}&limit=8`);
                setResults(Array.isArray(res.data) ? res.data.slice(0, 8) : []);
            } catch (err) {
                console.error('Quick search error:', err);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [query, open]);

    const handleSelectMovie = (id) => {
        onClose();
        navigate(`/movie/${id}`);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#13151f',
                    borderRadius: 3,
                    border: '1px solid rgba(245, 197, 24, 0.3)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.9), 0 0 30px rgba(245, 197, 24, 0.2)',
                    overflow: 'hidden',
                    top: { xs: 0, sm: -80 },
                    position: 'relative'
                }
            }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                <TextField
                    fullWidth
                    autoFocus
                    placeholder="Type to search movies, directors, genres..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#f5c518', fontSize: 24 }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {loading && <CircularProgress size={20} sx={{ color: '#f5c518', mr: 1 }} />}
                                <Chip
                                    label="ESC"
                                    size="small"
                                    onClick={onClose}
                                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem', height: 22 }}
                                />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                            fontSize: '1rem',
                            color: '#fff',
                        }
                    }}
                />
            </Box>

            <DialogContent sx={{ p: 0, maxHeight: 420, overflowY: 'auto' }}>
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontWeight: 700, px: 1 }}>
                        {query ? 'Search Results' : 'Suggested Movies'}
                    </Typography>
                </Box>

                <List sx={{ px: 1, pb: 1 }}>
                    {results.length > 0 ? (
                        results.map((movie) => (
                            <ListItem key={movie._id} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => handleSelectMovie(movie._id)}
                                    sx={{
                                        borderRadius: 2,
                                        p: 1,
                                        transition: 'all 0.15s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(245, 197, 24, 0.12)',
                                            '& .movie-title': { color: '#f5c518' }
                                        }
                                    }}
                                >
                                    <ListItemAvatar sx={{ minWidth: 52 }}>
                                        <Avatar
                                            variant="rounded"
                                            src={getPosterUrl(movie.posterPath, 'w92')}
                                            alt={movie.title}
                                            sx={{ width: 40, height: 56, bgcolor: '#1a1d2e', borderRadius: 1 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography className="movie-title" variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', transition: 'color 0.2s' }}>
                                                {movie.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: '#f5c518' }}>
                                                    <StarIcon sx={{ fontSize: 13, mr: 0.3 }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#f5c518' }}>
                                                        {movie.rating ? movie.rating.toFixed(1) : 'NR'}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>•</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                    {movie.releaseDate ? movie.releaseDate.substring(0, 4) : ''}
                                                </Typography>
                                                {movie.genres && movie.genres[0] && (
                                                    <>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>•</Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                            {movie.genres[0]}
                                                        </Typography>
                                                    </>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                {query ? `No movies found matching "${query}"` : 'Type a movie title to search'}
                            </Typography>
                        </Box>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default SearchDialog;
