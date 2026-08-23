import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    Button,
    Chip,
    IconButton,
    CircularProgress,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CasinoIcon from '@mui/icons-material/Casino';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import api, { getPosterUrl, getBackdropUrl } from '../utils/api';
import WatchlistButton from './WatchlistButton';

const SurpriseMeModal = ({ open, onClose }) => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchRandomMovie = async () => {
        setLoading(true);
        try {
            const res = await api.get('/movies/random');
            setMovie(res.data);
        } catch (err) {
            console.error('Surprise movie error:', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (open) {
            fetchRandomMovie();
        }
    }, [open]);

    const handleViewDetails = () => {
        if (movie) {
            onClose();
            navigate(`/movie/${movie._id}`);
        }
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
                    borderRadius: 3.5,
                    border: '1px solid rgba(245, 197, 24, 0.3)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.9), 0 0 30px rgba(245, 197, 24, 0.2)',
                    overflow: 'hidden',
                    position: 'relative'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', py: 2, px: 3, bgcolor: 'rgba(0,0,0,0.5)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CasinoIcon sx={{ color: '#f5c518', fontSize: 26 }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: '"Outfit", sans-serif' }}>
                        Surprise Me!
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress sx={{ color: '#f5c518' }} size={48} />
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                            Rolling the movie dice... 🎲
                        </Typography>
                    </Box>
                ) : movie ? (
                    <Box>
                        {/* Backdrop with overlay */}
                        <Box
                            sx={{
                                height: 200,
                                width: '100%',
                                backgroundImage: `linear-gradient(to top, #13151f 0%, rgba(19, 21, 31, 0.3) 60%, rgba(0,0,0,0.8) 100%), url(${getBackdropUrl(movie.backdropPath, movie.posterPath)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative'
                            }}
                        />

                        {/* Content */}
                        <Box sx={{ px: 3, pb: 3, mt: -8, position: 'relative' }}>
                            <Box sx={{ display: 'flex', gap: 2.5, mb: 2 }}>
                                <Box
                                    component="img"
                                    src={getPosterUrl(movie.posterPath, 'w185')}
                                    alt={movie.title}
                                    sx={{
                                        width: 100,
                                        height: 145,
                                        borderRadius: 2,
                                        objectFit: 'cover',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                />
                                <Box sx={{ flexGrow: 1, pt: 8 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1.2, mb: 0.5, fontFamily: '"Outfit", sans-serif' }}>
                                        {movie.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#f5c518', fontWeight: 800 }}>
                                            <StarIcon sx={{ fontSize: 16, mr: 0.3 }} />
                                            {movie.rating ? movie.rating.toFixed(1) : 'NR'}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>•</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                                            {movie.releaseDate ? movie.releaseDate.substring(0, 4) : ''}
                                        </Typography>
                                        {movie.duration > 0 && (
                                            <>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>•</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            {/* Genres */}
                            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 2 }}>
                                {movie.genres?.map(g => (
                                    <Chip key={g} label={g} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }} />
                                ))}
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255,255,255,0.75)',
                                    lineHeight: 1.6,
                                    mb: 3,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {movie.description}
                            </Typography>

                            {/* Action Buttons */}
                            <Stack direction="row" spacing={1.5}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<InfoOutlinedIcon />}
                                    onClick={handleViewDetails}
                                    sx={{ fontWeight: 800, py: 1.2, borderRadius: '50px' }}
                                >
                                    View Movie
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<CasinoIcon />}
                                    onClick={fetchRandomMovie}
                                    sx={{
                                        borderColor: 'rgba(245, 197, 24, 0.4)',
                                        color: '#f5c518',
                                        fontWeight: 700,
                                        borderRadius: '50px',
                                        px: 2.5,
                                        whiteSpace: 'nowrap',
                                        '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.1)', borderColor: '#f5c518' }
                                    }}
                                >
                                    Roll Again 🎲
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            No movie found to surprise you with.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SurpriseMeModal;
