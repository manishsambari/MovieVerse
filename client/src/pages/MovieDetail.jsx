import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Typography, Box, Chip, Button, Avatar, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // The route in backend is /api/movies/find/:id
                // But the ID passed in URL might be the MongoDB _id.
                const res = await axios.get(`http://localhost:5000/api/movies/find/${id}`);
                setMovie(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMovie();
    }, [id]);

    if (!movie) return <Box sx={{ color: 'white', textAlign: 'center', mt: 10 }}>Loading...</Box>;

    return (
        <Box sx={{ bgcolor: '#1a1a1a', minHeight: '100vh', color: 'white', pb: 8 }}>
            {/* Backdrop Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: '50vh',
                    width: '100%',
                    backgroundImage: movie.backdropPath
                        ? `linear-gradient(to bottom, rgba(0,0,0,0) 0%, #1a1a1a 100%), url(${movie.backdropPath.startsWith('/images')
                            ? `http://localhost:5000${movie.backdropPath}`
                            : `https://image.tmdb.org/t/p/original${movie.backdropPath}`
                        })`
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <Container maxWidth="lg" sx={{ mt: -20, position: 'relative', zIndex: 2 }}>
                <Grid container spacing={4}>
                    {/* Poster Column */}
                    <Grid item xs={12} md={3}>
                        <Box
                            component="img"
                            src={movie.posterPath
                                ? (movie.posterPath.startsWith('/images')
                                    ? `http://localhost:5000${movie.posterPath}`
                                    : `https://image.tmdb.org/t/p/w500${movie.posterPath}`)
                                : 'https://placehold.co/300x450'}
                            alt={movie.title}
                            sx={{
                                width: '100%',
                                borderRadius: '4px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}
                        />
                    </Grid>

                    {/* Details Column */}
                    <Grid item xs={12} md={9}>
                        <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 1, textShadow: '2px 2px 4px black' }}>
                            {movie.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#f5c518' }}>
                                <Typography variant="h6" fontWeight="bold">★ {movie.rating?.toFixed(1)}</Typography>
                                <Typography variant="body2" sx={{ color: '#aaa', ml: 0.5 }}>/10</Typography>
                            </Box>
                            <Typography variant="body1" sx={{ color: '#aaa' }}>{movie.releaseDate?.substring(0, 4)}</Typography>
                            <Typography variant="body1" sx={{ color: '#aaa' }}>
                                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                            </Typography>
                        </Box>

                        {/* Genres */}
                        <Box sx={{ mb: 4 }}>
                            {movie.genres?.map((genre) => (
                                <Chip
                                    key={genre}
                                    label={genre}
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: '#aaa',
                                        mr: 1, mb: 1,
                                        '&:hover': { borderColor: '#f5c518', color: '#f5c518' }
                                    }}
                                />
                            ))}
                        </Box>

                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '800px' }}>
                            {movie.description}
                        </Typography>

                        <Box sx={{ my: 3, borderTop: '1px solid #333', borderBottom: '1px solid #333', py: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <span style={{ fontWeight: 'bold' }}>Director:</span> <span style={{ color: '#4da6ff' }}>{movie.director || 'N/A'}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <span style={{ fontWeight: 'bold' }}>Writers:</span> <span style={{ color: '#4da6ff' }}>{movie.writers?.join(', ') || 'N/A'}</span>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Top Cast */}
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderLeft: '4px solid #f5c518', pl: 2, mb: 2 }}>
                            Top Cast
                        </Typography>
                        <Grid container spacing={2}>
                            {movie.cast?.map((actor) => (
                                <Grid item xs={6} sm={4} md={3} lg={2} key={actor.name}>
                                    <Paper sx={{ bgcolor: 'transparent', textAlign: 'center', boxShadow: 'none' }}>
                                        <Avatar
                                            src={actor.image ? `https://image.tmdb.org/t/p/w185${actor.image}` : ''}
                                            sx={{ width: 80, height: 80, margin: '0 auto', mb: 1, border: '2px solid #333' }}
                                        />
                                        <Typography variant="body2" fontWeight="bold">{actor.name}</Typography>
                                        <Typography variant="caption" sx={{ color: '#aaa' }}>{actor.role}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Trailer Button / Section */}
                        {movie.trailerKey && (
                            <Box sx={{ mt: 5 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<PlayArrowIcon />}
                                    href={`https://www.youtube.com/watch?v=${movie.trailerKey}`}
                                    target="_blank"
                                    sx={{ fontWeight: 'bold', px: 4, py: 1.5, borderRadius: '24px', color: 'black' }}
                                >
                                    Watch Trailer
                                </Button>
                            </Box>
                        )}

                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default MovieDetail;
