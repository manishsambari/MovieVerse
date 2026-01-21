import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, Avatar, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import WatchlistButton from '../components/WatchlistButton';

const Profile = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWatchlist();
    }, [user, navigate]);

    const fetchWatchlist = async () => {
        try {
            const res = await api.get('/watchlist');
            setWatchlist(res.data);
        } catch (err) {
            console.error('Error fetching watchlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = (id) => {
        navigate(`/movie/${id}`);
    };

    if (!user) return null;

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#ffc107', mr: 3 }}>
                    <PersonIcon sx={{ fontSize: 50 }} />
                </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {user.username}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {user.email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                        Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />

            <Typography variant="h5" sx={{ mb: 3, color: 'white', fontWeight: 'bold' }}>
                My Watchlist ({watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'})
            </Typography>

            {loading ? (
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Loading...</Typography>
            ) : watchlist.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Your watchlist is empty
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.3)', mt: 1 }}>
                        Start adding movies to your watchlist!
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {watchlist.map((movie) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'scale(1.05)' },
                                    bgcolor: '#1a1a1a',
                                    position: 'relative'
                                }}
                                onClick={() => handleMovieClick(movie._id)}
                            >
                                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                                    <WatchlistButton
                                        movieId={movie._id}
                                        size="small"
                                    />
                                </Box>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={
                                        movie.posterPath?.startsWith('http')
                                            ? movie.posterPath
                                            : movie.posterPath?.startsWith('/images')
                                                ? `${import.meta.env.VITE_API_URL || ''}${movie.posterPath}`
                                                : `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                                    }
                                    alt={movie.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                        {movie.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        ⭐ {movie.rating?.toFixed(1) || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Profile;
