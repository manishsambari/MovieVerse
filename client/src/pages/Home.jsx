import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box, Button, Chip, IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StarIcon from '@mui/icons-material/Star';

const Home = () => {
    const [heroMovies, setHeroMovies] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [comedyMovies, setComedyMovies] = useState([]);
    const [dramaMovies, setDramaMovies] = useState([]);
    const [topRated, setTopRated] = useState([]);

    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const heroRes = await api.get(`/movies?limit=5`);
                setHeroMovies(heroRes.data.movies);

                const actionRes = await api.get(`/movies?category=Action&limit=10`);
                setActionMovies(actionRes.data.movies);

                const comedyRes = await api.get(`/movies?category=Comedy&limit=10`);
                setComedyMovies(comedyRes.data.movies);

                const dramaRes = await api.get(`/movies?category=Drama&limit=10`);
                setDramaMovies(dramaRes.data.movies);

                const topRes = await api.get(`/movies/sorted?sort=rating`);
                setTopRated(topRes.data.slice(0, 5)); // Top 5
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    // Carousel Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % (heroMovies.length || 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [heroMovies]);

    const handleNextHero = () => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    };

    const handlePrevHero = () => {
        setCurrentHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
    };

    const MovieSection = ({ title, movies }) => (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderLeft: '4px solid #f5c518', pl: 2 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#f5c518' }}>
                    {title}
                </Typography>
                <Button endIcon={<ArrowForwardIosIcon fontSize="small" />} sx={{ color: '#f5c518', textTransform: 'none' }}>
                    See more
                </Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    pb: 2,
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-track': { background: '#333' },
                    '&::-webkit-scrollbar-thumb': { background: '#555', borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb:hover': { background: '#888' }
                }}
            >
                {movies.map((movie) => (
                    <Box key={movie._id} sx={{ minWidth: '200px', maxWidth: '200px', cursor: 'pointer' }} onClick={() => navigate(`/movie/${movie._id}`)}>
                        <Box sx={{ position: 'relative', height: '300px', borderRadius: '4px', overflow: 'hidden', mb: 1 }}>
                            <img
                                src={movie.posterPath
                                    ? (movie.posterPath.startsWith('/images')
                                        ? `${movie.posterPath}`
                                        : `https://image.tmdb.org/t/p/w300${movie.posterPath}`)
                                    : 'https://placehold.co/200x300'}
                                alt={movie.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: '#f5c518',
                                p: 0.5,
                                borderBottomLeftRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold'
                            }}>
                                <StarIcon sx={{ fontSize: '16px', mr: 0.5 }} /> {movie.rating?.toFixed(1)}
                            </Box>
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {movie.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>
                            {movie.releaseDate?.substring(0, 4)}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ pb: 8 }}>
            {/* Hero Carousel */}
            {heroMovies.length > 0 && (
                <Box
                    sx={{
                        position: 'relative',
                        height: '600px',
                        width: '100%',
                        backgroundImage: heroMovies[currentHeroIndex].backdropPath
                            ? `linear-gradient(to bottom, rgba(0,0,0,0) 50%, #141414 100%), linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%), url(${heroMovies[currentHeroIndex].backdropPath.startsWith('/images')
                                ? `${heroMovies[currentHeroIndex].backdropPath}`
                                : `https://image.tmdb.org/t/p/original${heroMovies[currentHeroIndex].backdropPath}`
                            })`
                            : `linear-gradient(to bottom, rgba(0,0,0,0) 0%, #141414 100%), url(${heroMovies[currentHeroIndex].posterPath && heroMovies[currentHeroIndex].posterPath.startsWith('/images')
                                ? `${heroMovies[currentHeroIndex].posterPath}`
                                : `https://image.tmdb.org/t/p/original${heroMovies[currentHeroIndex].posterPath}`
                            })`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        transition: 'background-image 0.5s ease-in-out',
                        mb: 6
                    }}
                >
                    <Container maxWidth="xl">
                        <Box sx={{ maxWidth: '600px', p: 4 }}>
                            <Chip label="Featured" color="primary" sx={{ mb: 2, fontWeight: 'bold', color: 'black' }} />
                            <Typography variant="h2" component="h1" sx={{ fontWeight: '900', mb: 2, textShadow: '2px 2px 4px black', lineHeight: 1 }}>
                                {heroMovies[currentHeroIndex].title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <StarIcon sx={{ color: '#f5c518', mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>{heroMovies[currentHeroIndex].rating?.toFixed(1)}</Typography>
                                <Typography variant="body1" sx={{ color: '#ccc' }}>{heroMovies[currentHeroIndex].releaseDate?.substring(0, 4)}</Typography>
                            </Box>
                            <Typography variant="body1" paragraph sx={{ mb: 4, textShadow: '1px 1px 2px black', fontSize: '1.1rem', color: '#ddd' }}>
                                {heroMovies[currentHeroIndex].description?.substring(0, 150)}...
                            </Typography>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => navigate(`/movie/${heroMovies[currentHeroIndex]._id}`)}
                                    sx={{ mr: 2, px: 4, py: 1.5, borderRadius: '50px', fontWeight: 'bold', color: 'black' }}
                                >
                                    View Details
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{ px: 4, py: 1.5, borderRadius: '50px', color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                >
                                    + Watchlist
                                </Button>
                            </Box>
                        </Box>
                    </Container>

                    {/* Carousel Controls */}
                    <IconButton
                        onClick={handlePrevHero}
                        sx={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: '#f5c518', color: 'black' } }}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleNextHero}
                        sx={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: '#f5c518', color: 'black' } }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            )}

            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Main Feed */}
                    <Grid item xs={12} lg={9}>
                        <MovieSection title="Action Hits" movies={actionMovies} />
                        <MovieSection title="Comedy Favorites" movies={comedyMovies} />
                        <MovieSection title="Drama & Romance" movies={dramaMovies} />
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} lg={3}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f5c518', mb: 3, borderLeft: '4px solid #f5c518', pl: 2 }}>
                                Top Rated
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {topRated.map((movie, index) => (
                                    <Paper
                                        key={movie._id}
                                        onClick={() => navigate(`/movie/${movie._id}`)}
                                        sx={{
                                            display: 'flex',
                                            p: 0,
                                            bgcolor: '#1a1a1a',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateX(5px)', bgcolor: '#222' }
                                        }}
                                    >
                                        <img
                                            src={movie.posterPath
                                                ? (movie.posterPath.startsWith('/images')
                                                    ? `${movie.posterPath}`
                                                    : `https://image.tmdb.org/t/p/w200${movie.posterPath}`)
                                                : 'https://placehold.co/100x150'}
                                            alt={movie.title}
                                            style={{ width: '80px', height: '120px', objectFit: 'cover' }}
                                        />
                                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, lineHeight: 1.2 }}>
                                                {index + 1}. {movie.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <StarIcon sx={{ fontSize: '14px', color: '#f5c518', mr: 0.5 }} />
                                                <Typography variant="caption" color="gray">
                                                    {movie.rating?.toFixed(1)}
                                                </Typography>
                                                <Typography variant="caption" color="gray" sx={{ mx: 1 }}>•</Typography>
                                                <Typography variant="caption" color="gray">
                                                    {movie.releaseDate?.substring(0, 4)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
