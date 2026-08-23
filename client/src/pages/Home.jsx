import React, { useState, useEffect, useRef } from 'react';
import api, { getPosterUrl, getBackdropUrl } from '../utils/api';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Skeleton,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WatchlistButton from '../components/WatchlistButton';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minWidth: { xs: '150px', sm: '180px', md: '200px' },
                maxWidth: { xs: '150px', sm: '180px', md: '200px' },
                cursor: 'pointer',
                transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    '& .movie-poster': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.8), 0 0 16px rgba(245, 197, 24, 0.25)',
                    }
                }
            }}
            onClick={() => navigate(`/movie/${movie._id}`)}
        >
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '220px', sm: '270px', md: '300px' },
                    borderRadius: '10px',
                    overflow: 'hidden',
                    mb: 1.2,
                    bgcolor: '#181a24',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
            >
                <Box
                    component="img"
                    className="movie-poster"
                    src={getPosterUrl(movie.posterPath, 'w342')}
                    alt={movie.title}
                    loading="lazy"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.35s ease',
                    }}
                />

                {/* Watchlist Quick Button */}
                <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
                    <WatchlistButton movie={movie} size="small" />
                </Box>

                {/* Rating Badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(6px)',
                        color: '#f5c518',
                        px: 1,
                        py: 0.4,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.4,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        border: '1px solid rgba(245, 197, 24, 0.3)'
                    }}
                >
                    <StarIcon sx={{ fontSize: '15px' }} />
                    {movie.rating ? movie.rating.toFixed(1) : 'NR'}
                </Box>

                {/* Runtime Badge on bottom if present */}
                {movie.duration > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(4px)',
                            color: 'rgba(255, 255, 255, 0.85)',
                            px: 0.8,
                            py: 0.2,
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                        }}
                    >
                        {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                    </Box>
                )}
            </Box>

            <Typography
                variant="subtitle2"
                sx={{
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: '#fff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.92rem'
                }}
            >
                {movie.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500 }}>
                    {movie.releaseDate ? movie.releaseDate.substring(0, 4) : 'N/A'}
                </Typography>
                {movie.genres && movie.genres[0] && (
                    <>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</Typography>
                        <Typography variant="caption" sx={{ color: '#f5c518', fontWeight: 600 }}>
                            {movie.genres[0]}
                        </Typography>
                    </>
                )}
            </Box>
        </Box>
    );
};

const MovieSection = ({ title, movies, category, loading }) => {
    const scrollContainerRef = useRef(null);

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -600 : 600;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <Box sx={{ mb: 6, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 4, height: 24, bgcolor: '#f5c518', borderRadius: '2px', boxShadow: '0 0 10px #f5c518' }} />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                        {title}
                    </Typography>
                </Box>
                {category && (
                    <Button
                        component={Link}
                        to={`/search?category=${encodeURIComponent(category)}`}
                        endIcon={<ArrowForwardIosIcon sx={{ fontSize: '12px !important' }} />}
                        sx={{
                            color: '#f5c518',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.1)' }
                        }}
                    >
                        Explore All
                    </Button>
                )}
            </Box>

            {/* Carousel Container with side scroll controls */}
            <Box sx={{ position: 'relative', '&:hover .scroll-arrow': { opacity: 1 } }}>
                <IconButton
                    className="scroll-arrow"
                    onClick={() => handleScroll('left')}
                    sx={{
                        position: 'absolute',
                        left: -16,
                        top: '40%',
                        transform: 'translateY(-50%)',
                        zIndex: 3,
                        bgcolor: 'rgba(12, 13, 18, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        opacity: 0,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                        '&:hover': { bgcolor: '#f5c518', color: '#000' }
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>

                <IconButton
                    className="scroll-arrow"
                    onClick={() => handleScroll('right')}
                    sx={{
                        position: 'absolute',
                        right: -16,
                        top: '40%',
                        transform: 'translateY(-50%)',
                        zIndex: 3,
                        bgcolor: 'rgba(12, 13, 18, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        opacity: 0,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                        '&:hover': { bgcolor: '#f5c518', color: '#000' }
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>

                <Box
                    ref={scrollContainerRef}
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: { xs: 1.5, sm: 2.5 },
                        pb: 2,
                        pt: 0.5,
                        px: 0.5,
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': { height: '6px' },
                        '&::-webkit-scrollbar-track': { background: 'rgba(255, 255, 255, 0.03)', borderRadius: '3px' },
                        '&::-webkit-scrollbar-thumb': { background: '#252836', borderRadius: '3px' },
                        '&::-webkit-scrollbar-thumb:hover': { background: '#f5c518' }
                    }}
                >
                    {loading ? (
                        Array.from(new Array(6)).map((_, i) => (
                            <Box key={i} sx={{ minWidth: 180, maxWidth: 180 }}>
                                <Skeleton variant="rounded" width="100%" height={270} sx={{ bgcolor: '#181a24', borderRadius: 2 }} />
                                <Skeleton width="80%" height={24} sx={{ bgcolor: '#1f2230', mt: 1 }} />
                                <Skeleton width="40%" height={18} sx={{ bgcolor: '#1f2230' }} />
                            </Box>
                        ))
                    ) : movies.length > 0 ? (
                        movies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))
                    ) : (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', py: 4 }}>
                            No movies available in this category.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const Home = () => {
    const [heroMovies, setHeroMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [comedyMovies, setComedyMovies] = useState([]);
    const [dramaMovies, setDramaMovies] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [trailerModal, setTrailerModal] = useState({ open: false, trailerKey: null, title: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch featured hero movies
                const heroRes = await api.get(`/movies?limit=6`);
                const heroes = heroRes.data.movies || [];
                setHeroMovies(heroes);

                // Fetch popular categories
                const [actionRes, comedyRes, dramaRes, topRes] = await Promise.all([
                    api.get(`/movies?category=Action&limit=12`),
                    api.get(`/movies?category=Comedy&limit=12`),
                    api.get(`/movies?category=Drama&limit=12`),
                    api.get(`/movies/sorted?sort=rating`),
                ]);

                setActionMovies(actionRes.data.movies || []);
                setComedyMovies(comedyRes.data.movies || []);
                setDramaMovies(dramaRes.data.movies || []);
                const sorted = Array.isArray(topRes.data) ? topRes.data : [];
                setTopRated(sorted.slice(0, 10));
                setTrendingMovies(sorted.slice(0, 12));
            } catch (err) {
                console.error('Error fetching home movies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Carousel auto-advance
    useEffect(() => {
        if (!heroMovies.length) return;
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
        }, 6500);
        return () => clearInterval(interval);
    }, [heroMovies]);

    const handleNextHero = () => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    };

    const handlePrevHero = () => {
        setCurrentHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
    };

    const currentHero = heroMovies[currentHeroIndex];

    const openTrailer = (movie) => {
        if (movie?.trailerKey) {
            setTrailerModal({ open: true, trailerKey: movie.trailerKey, title: movie.title });
        } else {
            navigate(`/movie/${movie._id}`);
        }
    };

    return (
        <Box sx={{ pb: 10 }}>
            {/* Hero Section */}
            {loading ? (
                <Box sx={{ height: { xs: 450, md: 620 }, width: '100%', bgcolor: '#12141c', mb: 6 }}>
                    <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ maxWidth: 650, width: '100%' }}>
                            <Skeleton width={120} height={32} sx={{ bgcolor: '#1a1d29', mb: 2, borderRadius: 1 }} />
                            <Skeleton width="90%" height={60} sx={{ bgcolor: '#1a1d29', mb: 2 }} />
                            <Skeleton width="40%" height={28} sx={{ bgcolor: '#1a1d29', mb: 3 }} />
                            <Skeleton width="100%" height={80} sx={{ bgcolor: '#1a1d29', mb: 4 }} />
                            <Stack direction="row" spacing={2}>
                                <Skeleton width={150} height={48} sx={{ bgcolor: '#1a1d29', borderRadius: 6 }} />
                                <Skeleton width={150} height={48} sx={{ bgcolor: '#1a1d29', borderRadius: 6 }} />
                            </Stack>
                        </Box>
                    </Container>
                </Box>
            ) : currentHero ? (
                <Box
                    sx={{
                        position: 'relative',
                        height: { xs: '520px', sm: '580px', md: '640px' },
                        width: '100%',
                        backgroundImage: `linear-gradient(to top, #0c0d12 0%, rgba(12, 13, 18, 0.4) 40%, rgba(12, 13, 18, 0.8) 100%), linear-gradient(to right, #0c0d12 0%, rgba(12, 13, 18, 0.85) 35%, rgba(12, 13, 18, 0.1) 75%), url(${getBackdropUrl(currentHero.backdropPath, currentHero.posterPath)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 20%',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background-image 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        mb: 6,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                >
                    <Container maxWidth="xl">
                        <Box sx={{ maxWidth: { xs: '100%', md: '650px' }, p: { xs: 2, md: 4 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Chip
                                    icon={<LocalFireDepartmentIcon sx={{ fontSize: '18px !important', color: '#000' }} />}
                                    label="Featured Spotlight"
                                    sx={{
                                        fontWeight: 800,
                                        bgcolor: '#f5c518',
                                        color: '#000',
                                        fontSize: '0.82rem',
                                        boxShadow: '0 0 16px rgba(245, 197, 24, 0.4)'
                                    }}
                                />
                                {currentHero.genres?.slice(0, 2).map((g) => (
                                    <Chip
                                        key={g}
                                        label={g}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(8px)',
                                            color: '#fff',
                                            fontWeight: 600,
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                    />
                                ))}
                            </Box>

                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontFamily: '"Outfit", sans-serif',
                                    fontWeight: 900,
                                    fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
                                    lineHeight: 1.08,
                                    mb: 2,
                                    color: '#fff',
                                    textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                                }}
                            >
                                {currentHero.title}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(0,0,0,0.6)', px: 1.2, py: 0.4, borderRadius: 1.5, border: '1px solid rgba(245, 197, 24, 0.4)' }}>
                                    <StarIcon sx={{ color: '#f5c518', fontSize: 18 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#f5c518' }}>
                                        {currentHero.rating ? currentHero.rating.toFixed(1) : 'NR'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>/10</Typography>
                                </Box>

                                {currentHero.releaseDate && (
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                                        {currentHero.releaseDate.substring(0, 4)}
                                    </Typography>
                                )}

                                {currentHero.duration > 0 && (
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        {Math.floor(currentHero.duration / 60)}h {currentHero.duration % 60}m
                                    </Typography>
                                )}
                            </Box>

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 3.5,
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    lineHeight: 1.65,
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                                }}
                            >
                                {currentHero.description}
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ maxWidth: 450 }}>
                                {currentHero.trailerKey ? (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => openTrailer(currentHero)}
                                        sx={{
                                            bgcolor: '#f5c518',
                                            color: '#000',
                                            fontWeight: 800,
                                            px: 3.5,
                                            py: 1.4,
                                            borderRadius: '50px',
                                            fontSize: '1rem',
                                            boxShadow: '0 0 24px rgba(245, 197, 24, 0.4)',
                                            '&:hover': { bgcolor: '#ffd700', transform: 'scale(1.03)' }
                                        }}
                                    >
                                        Watch Trailer
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<InfoOutlinedIcon />}
                                        onClick={() => navigate(`/movie/${currentHero._id}`)}
                                        sx={{
                                            bgcolor: '#f5c518',
                                            color: '#000',
                                            fontWeight: 800,
                                            px: 3.5,
                                            py: 1.4,
                                            borderRadius: '50px',
                                            fontSize: '1rem',
                                            boxShadow: '0 0 24px rgba(245, 197, 24, 0.4)',
                                            '&:hover': { bgcolor: '#ffd700', transform: 'scale(1.03)' }
                                        }}
                                    >
                                        View Details
                                    </Button>
                                )}

                                <WatchlistButton movie={currentHero} variant="button" size="large" />

                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate(`/movie/${currentHero._id}`)}
                                    sx={{
                                        color: '#fff',
                                        borderColor: 'rgba(255, 255, 255, 0.25)',
                                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: '50px',
                                        px: 3,
                                        fontWeight: 600,
                                        '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255, 255, 255, 0.1)' }
                                    }}
                                >
                                    Details
                                </Button>
                            </Stack>

                            {/* Carousel Indicator Thumbnails */}
                            <Box sx={{ display: 'flex', gap: 1.2, mt: 4, alignItems: 'center' }}>
                                {heroMovies.map((m, idx) => (
                                    <Box
                                        key={m._id}
                                        onClick={() => setCurrentHeroIndex(idx)}
                                        sx={{
                                            width: currentHeroIndex === idx ? 32 : 10,
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: currentHeroIndex === idx ? '#f5c518' : 'rgba(255, 255, 255, 0.25)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: currentHeroIndex === idx ? '0 0 10px #f5c518' : 'none'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Container>

                    {/* Carousel Navigation Arrows */}
                    <IconButton
                        onClick={handlePrevHero}
                        sx={{
                            position: 'absolute',
                            left: { xs: 8, md: 24 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(12, 13, 18, 0.65)',
                            backdropFilter: 'blur(8px)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': { bgcolor: '#f5c518', color: '#000' }
                        }}
                    >
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        onClick={handleNextHero}
                        sx={{
                            position: 'absolute',
                            right: { xs: 8, md: 24 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(12, 13, 18, 0.65)',
                            backdropFilter: 'blur(8px)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': { bgcolor: '#f5c518', color: '#000' }
                        }}
                    >
                        <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                </Box>
            ) : null}

            {/* Main Content Area with Rails & Sidebar */}
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Main Movie Rails */}
                    <Grid item xs={12} lg={8.8}>
                        <MovieSection
                            title="🔥 Trending Now"
                            movies={trendingMovies}
                            category="All"
                            loading={loading}
                        />

                        <MovieSection
                            title="⚡ Action & Adrenaline"
                            movies={actionMovies}
                            category="Action"
                            loading={loading}
                        />

                        <MovieSection
                            title="🎭 Drama & Emotion"
                            movies={dramaMovies}
                            category="Drama"
                            loading={loading}
                        />

                        <MovieSection
                            title="🍿 Comedy Favorites"
                            movies={comedyMovies}
                            category="Comedy"
                            loading={loading}
                        />
                    </Grid>

                    {/* Top Rated Spotlight Sidebar */}
                    <Grid item xs={12} lg={3.2}>
                        <Box
                            sx={{
                                bgcolor: '#12141e',
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                position: { lg: 'sticky' },
                                top: 90
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <StarIcon sx={{ color: '#f5c518', fontSize: 24 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                                        Top 10 Ranked
                                    </Typography>
                                </Box>
                                <Button
                                    component={Link}
                                    to="/search?sort=rating"
                                    sx={{ color: '#f5c518', fontSize: '0.8rem', fontWeight: 600 }}
                                >
                                    See All
                                </Button>
                            </Box>

                            <Stack spacing={1.5}>
                                {loading ? (
                                    Array.from(new Array(5)).map((_, i) => (
                                        <Skeleton key={i} variant="rounded" height={70} sx={{ bgcolor: '#191c28', borderRadius: 2 }} />
                                    ))
                                ) : (
                                    topRated.map((movie, index) => (
                                        <Paper
                                            key={movie._id}
                                            onClick={() => navigate(`/movie/${movie._id}`)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: 'rgba(245, 197, 24, 0.1)',
                                                    borderColor: 'rgba(245, 197, 24, 0.3)',
                                                    transform: 'translateX(4px)'
                                                }
                                            }}
                                        >
                                            {/* Rank Badge */}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    width: 28,
                                                    fontWeight: 900,
                                                    color: index === 0 ? '#f5c518' : index === 1 ? '#e0e0e0' : index === 2 ? '#cd7f32' : 'rgba(255,255,255,0.4)',
                                                    textAlign: 'center',
                                                    fontFamily: '"Outfit", sans-serif'
                                                }}
                                            >
                                                {index + 1}
                                            </Typography>

                                            <Box
                                                component="img"
                                                src={getPosterUrl(movie.posterPath, 'w92')}
                                                alt={movie.title}
                                                sx={{
                                                    width: 44,
                                                    height: 60,
                                                    borderRadius: 1,
                                                    objectFit: 'cover',
                                                    mx: 1.5,
                                                    bgcolor: '#191c28'
                                                }}
                                            />

                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#fff',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {movie.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#f5c518' }}>
                                                        <StarIcon sx={{ fontSize: 13, mr: 0.3 }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#f5c518' }}>
                                                            {movie.rating ? movie.rating.toFixed(1) : 'NR'}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>•</Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                        {movie.releaseDate ? movie.releaseDate.substring(0, 4) : ''}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    ))
                                )}
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* In-App YouTube Trailer Dialog Player */}
            <Dialog
                open={trailerModal.open}
                onClose={() => setTrailerModal({ open: false, trailerKey: null, title: '' })}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#000',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', py: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {trailerModal.title} - Official Trailer
                    </Typography>
                    <IconButton
                        onClick={() => setTrailerModal({ open: false, trailerKey: null, title: '' })}
                        sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, height: { xs: '260px', sm: '420px', md: '480px' } }}>
                    {trailerModal.trailerKey && (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube-nocookie.com/embed/${trailerModal.trailerKey}?autoplay=1&rel=0`}
                            title={trailerModal.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: 0 }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Home;
