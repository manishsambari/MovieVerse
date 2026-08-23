import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getPosterUrl, getBackdropUrl } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    Grid,
    Typography,
    Box,
    Chip,
    Button,
    Avatar,
    Paper,
    Skeleton,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Alert,
    Stack,
    Divider,
    TextField,
    Rating
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import MovieIcon from '@mui/icons-material/Movie';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WatchlistButton from '../components/WatchlistButton';

const MovieDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trailerOpen, setTrailerOpen] = useState(false);
    const [shareToast, setShareToast] = useState(false);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(8);
    const [userComment, setUserComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewToast, setReviewToast] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/movies/find/${id}`);
                const movieData = res.data;
                setMovie(movieData);
                setReviews(movieData.reviews || []);

                // Save to recently viewed
                if (movieData) {
                    try {
                        const history = JSON.parse(localStorage.getItem('recently_viewed')) || [];
                        const filtered = history.filter(m => m._id !== movieData._id);
                        const updated = [
                            {
                                _id: movieData._id,
                                title: movieData.title,
                                posterPath: movieData.posterPath,
                                rating: movieData.rating,
                                releaseDate: movieData.releaseDate,
                                duration: movieData.duration
                            },
                            ...filtered
                        ].slice(0, 10);
                        localStorage.setItem('recently_viewed', JSON.stringify(updated));
                    } catch {
                        // ignore storage errors
                    }
                }

                // Fetch similar movies based on primary genre
                if (movieData?.genres && movieData.genres.length > 0) {
                    const primaryGenre = movieData.genres[0];
                    const similarRes = await api.get(`/movies?category=${encodeURIComponent(primaryGenre)}&limit=8`);
                    const list = similarRes.data.movies || [];
                    setSimilarMovies(list.filter(m => m._id !== id));
                }
            } catch (err) {
                console.error('Error fetching movie:', err);
            } finally {
                setLoading(false);
            }
        };

        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchMovie();
    }, [id]);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setShareToast(true);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setReviewToast({ open: true, message: 'Please login to submit a review', severity: 'info' });
            return;
        }

        if (!userComment.trim()) {
            setReviewToast({ open: true, message: 'Please write a review comment', severity: 'warning' });
            return;
        }

        setSubmittingReview(true);
        try {
            const res = await api.post(`/movies/${id}/reviews`, {
                rating: userRating,
                comment: userComment,
                username: user.username
            });
            setReviews(res.data.reviews || []);
            setUserComment('');
            setReviewToast({ open: true, message: 'Your review was published!', severity: 'success' });
        } catch (err) {
            console.error('Review submit error:', err);
            setReviewToast({ open: true, message: err.response?.data?.message || 'Failed to submit review', severity: 'error' });
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const res = await api.delete(`/movies/${id}/reviews/${reviewId}`);
            setReviews(res.data.reviews || []);
            setReviewToast({ open: true, message: 'Review removed', severity: 'info' });
        } catch (err) {
            console.error('Delete review error:', err);
            setReviewToast({ open: true, message: 'Failed to delete review', severity: 'error' });
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#0c0d12' }}>
                <Box sx={{ height: '40vh', width: '100%', bgcolor: '#141622' }} />
                <Container maxWidth="lg" sx={{ mt: -12 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={3.5}>
                            <Skeleton variant="rounded" height={450} sx={{ bgcolor: '#1a1d2e', borderRadius: 3 }} />
                        </Grid>
                        <Grid item xs={12} md={8.5}>
                            <Skeleton width="60%" height={50} sx={{ bgcolor: '#1a1d2e', mb: 2 }} />
                            <Skeleton width="40%" height={30} sx={{ bgcolor: '#1a1d2e', mb: 3 }} />
                            <Skeleton width="100%" height={100} sx={{ bgcolor: '#1a1d2e', mb: 4 }} />
                            <Skeleton width="50%" height={50} sx={{ bgcolor: '#1a1d2e', borderRadius: 4 }} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        );
    }

    if (!movie) {
        return (
            <Container sx={{ py: 12, textAlign: 'center' }}>
                <MovieIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                    Movie Not Found
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#0c0d12', minHeight: '100vh', color: 'white', pb: 10 }}>
            {/* Backdrop Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '35vh', sm: '45vh', md: '55vh' },
                    width: '100%',
                    backgroundImage: `linear-gradient(to top, #0c0d12 0%, rgba(12, 13, 18, 0.6) 50%, rgba(12, 13, 18, 0.85) 100%), url(${getBackdropUrl(movie.backdropPath, movie.posterPath)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 25%',
                }}
            >
                {/* Back Button */}
                <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            bgcolor: 'rgba(12, 13, 18, 0.75)',
                            backdropFilter: 'blur(8px)',
                            color: '#fff',
                            px: 2,
                            py: 0.8,
                            borderRadius: '50px',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.2)', borderColor: '#f5c518' }
                        }}
                    >
                        Back
                    </Button>
                </Box>
            </Box>

            <Container maxWidth="lg" sx={{ mt: { xs: -14, sm: -20, md: -24 }, position: 'relative', zIndex: 2 }}>
                <Grid container spacing={4}>
                    {/* Poster Column */}
                    <Grid item xs={12} sm={4} md={3.5}>
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                component="img"
                                src={getPosterUrl(movie.posterPath, 'w500')}
                                alt={movie.title}
                                sx={{
                                    width: '100%',
                                    borderRadius: 3,
                                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8), 0 0 20px rgba(245, 197, 24, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    display: 'block'
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Movie Information Column */}
                    <Grid item xs={12} sm={8} md={8.5}>
                        {/* Title */}
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 900,
                                fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                                lineHeight: 1.12,
                                mb: 2,
                                textShadow: '0 4px 16px rgba(0,0,0,0.8)'
                            }}
                        >
                            {movie.title}
                        </Typography>

                        {/* Metadata Row */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                            {/* Rating */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.6,
                                    bgcolor: 'rgba(245, 197, 24, 0.15)',
                                    border: '1px solid rgba(245, 197, 24, 0.4)',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 2
                                }}
                            >
                                <StarIcon sx={{ color: '#f5c518', fontSize: 20 }} />
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#f5c518', lineHeight: 1 }}>
                                    {movie.rating ? movie.rating.toFixed(1) : 'NR'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>/10</Typography>
                            </Box>

                            {/* Release Year */}
                            {movie.releaseDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'rgba(255, 255, 255, 0.7)' }}>
                                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {movie.releaseDate.substring(0, 4)}
                                    </Typography>
                                </Box>
                            )}

                            {/* Duration */}
                            {movie.duration > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'rgba(255, 255, 255, 0.7)' }}>
                                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {Math.floor(movie.duration / 60)}h {movie.duration % 60}m ({movie.duration} min)
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Genres */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {movie.genres?.map((genre) => (
                                <Chip
                                    key={genre}
                                    label={genre}
                                    component={Link}
                                    to={`/search?category=${encodeURIComponent(genre)}`}
                                    clickable
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.07)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        '&:hover': {
                                            bgcolor: 'rgba(245, 197, 24, 0.2)',
                                            borderColor: '#f5c518',
                                            color: '#f5c518'
                                        }
                                    }}
                                />
                            ))}
                        </Box>

                        {/* Action Buttons */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                            {movie.trailerKey && (
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PlayArrowIcon />}
                                    onClick={() => setTrailerOpen(true)}
                                    sx={{
                                        bgcolor: '#f5c518',
                                        color: '#000',
                                        fontWeight: 800,
                                        px: 3.5,
                                        py: 1.3,
                                        borderRadius: '50px',
                                        boxShadow: '0 0 20px rgba(245, 197, 24, 0.4)',
                                        '&:hover': { bgcolor: '#ffd700', transform: 'scale(1.02)' }
                                    }}
                                >
                                    Watch Trailer
                                </Button>
                            )}

                            <WatchlistButton movie={movie} variant="button" size="large" />

                            <IconButton
                                onClick={handleShare}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    p: 1.4,
                                    '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.2)', color: '#f5c518' }
                                }}
                            >
                                <ShareIcon />
                            </IconButton>
                        </Stack>

                        {/* Synopsis */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f5c518', mb: 1, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                                Storyline
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.85)' }}>
                                {movie.description || 'No overview provided.'}
                            </Typography>
                        </Box>

                        {/* Crew Details: Director & Writers */}
                        <Paper sx={{ p: 2.5, bgcolor: '#13151f', borderRadius: 2.5, border: '1px solid rgba(255, 255, 255, 0.07)', mb: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontWeight: 700 }}>
                                        Director
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#fff', mt: 0.3 }}>
                                        {movie.director || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', fontWeight: 700 }}>
                                        Writers
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#fff', mt: 0.3 }}>
                                        {movie.writers?.join(', ') || 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Cast Section */}
                        {movie.cast && movie.cast.length > 0 && (
                            <Box sx={{ mb: 6 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5, color: '#fff', borderLeft: '4px solid #f5c518', pl: 1.5 }}>
                                    Top Cast
                                </Typography>
                                <Grid container spacing={2}>
                                    {movie.cast.map((actor) => (
                                        <Grid item xs={6} sm={4} md={3} key={actor.name}>
                                            <Paper
                                                sx={{
                                                    p: 1.5,
                                                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                                                    borderRadius: 2,
                                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(245, 197, 24, 0.08)',
                                                        borderColor: 'rgba(245, 197, 24, 0.3)'
                                                    }
                                                }}
                                            >
                                                <Avatar
                                                    src={actor.image ? `https://image.tmdb.org/t/p/w185${actor.image}` : ''}
                                                    alt={actor.name}
                                                    sx={{ width: 46, height: 46, border: '1px solid rgba(255, 255, 255, 0.2)' }}
                                                />
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {actor.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                                                        {actor.role}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Grid>
                </Grid>

                {/* Community Reviews Section */}
                <Box sx={{ mt: 6 }}>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 4 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 4, height: 24, bgcolor: '#f5c518', borderRadius: '2px', boxShadow: '0 0 10px #f5c518' }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
                                Community Reviews ({reviews.length})
                            </Typography>
                        </Box>
                    </Box>

                    {/* Review Write Form */}
                    <Paper
                        sx={{
                            p: 3,
                            mb: 4,
                            bgcolor: '#13151f',
                            borderRadius: 3,
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
                            {user ? 'Leave Your Review & Rating' : 'Sign In to Review This Movie'}
                        </Typography>

                        {user ? (
                            <Box component="form" onSubmit={handleReviewSubmit}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                                        Your Rating:
                                    </Typography>
                                    <Rating
                                        value={userRating / 2}
                                        precision={0.5}
                                        onChange={(e, val) => setUserRating((val || 1) * 2)}
                                        sx={{ color: '#f5c518' }}
                                    />
                                    <Typography variant="body2" sx={{ color: '#f5c518', fontWeight: 800 }}>
                                        {userRating} / 10
                                    </Typography>
                                </Box>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="What did you think of the acting, direction, and plot?"
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: 2
                                        }
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={submittingReview}
                                    startIcon={<RateReviewIcon />}
                                    sx={{ fontWeight: 800, px: 3, py: 1, borderRadius: '50px' }}
                                >
                                    {submittingReview ? 'Posting...' : 'Submit Review'}
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Join the discussion and share your thoughts with fellow movie lovers.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to="/login"
                                    sx={{ color: '#f5c518', borderColor: 'rgba(245,197,24,0.4)', borderRadius: '50px' }}
                                >
                                    Sign In
                                </Button>
                            </Box>
                        )}
                    </Paper>

                    {/* Reviews List */}
                    <Stack spacing={2}>
                        {reviews.length > 0 ? (
                            reviews.map((rev) => (
                                <Paper
                                    key={rev._id || Math.random()}
                                    sx={{
                                        p: 2.5,
                                        bgcolor: '#13151f',
                                        borderRadius: 2.5,
                                        border: '1px solid rgba(255, 255, 255, 0.06)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ bgcolor: '#f5c518', color: '#000', fontWeight: 800, width: 36, height: 36 }}>
                                                {rev.username?.charAt(0).toUpperCase() || 'U'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>
                                                    {rev.username}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                                                    {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(245, 197, 24, 0.12)', px: 1, py: 0.3, borderRadius: 1.5 }}>
                                                <StarIcon sx={{ color: '#f5c518', fontSize: 16 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#f5c518' }}>
                                                    {rev.rating} / 10
                                                </Typography>
                                            </Box>

                                            {(user?._id === rev.user || user?.id === rev.user || user?.role === 'admin') && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteReview(rev._id)}
                                                    sx={{ color: 'rgba(255, 68, 68, 0.7)', '&:hover': { color: '#ff4444' } }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                                        {rev.comment}
                                    </Typography>
                                </Paper>
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', py: 2 }}>
                                No reviews yet. Be the first to review this movie!
                            </Typography>
                        )}
                    </Stack>
                </Box>

                {/* Similar / Recommended Movies */}
                {similarMovies.length > 0 && (
                    <Box sx={{ mt: 8 }}>
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 4 }} />
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#fff', borderLeft: '4px solid #f5c518', pl: 1.5 }}>
                            More Like This
                        </Typography>
                        <Grid container spacing={2.5}>
                            {similarMovies.slice(0, 6).map((item) => (
                                <Grid item xs={6} sm={4} md={2} key={item._id}>
                                    <Box
                                        onClick={() => navigate(`/movie/${item._id}`)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': { transform: 'translateY(-4px)' }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={getPosterUrl(item.posterPath, 'w342')}
                                            alt={item.title}
                                            sx={{
                                                width: '100%',
                                                height: '220px',
                                                objectFit: 'cover',
                                                borderRadius: 2,
                                                bgcolor: '#191c28',
                                                mb: 1
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <StarIcon sx={{ color: '#f5c518', fontSize: 13 }} />
                                            <Typography variant="caption" sx={{ color: '#f5c518', fontWeight: 700 }}>
                                                {item.rating?.toFixed(1)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>•</Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                {item.releaseDate?.substring(0, 4)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>

            {/* In-App YouTube Trailer Dialog */}
            <Dialog
                open={trailerOpen}
                onClose={() => setTrailerOpen(false)}
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
                        {movie.title} - Official Trailer
                    </Typography>
                    <IconButton onClick={() => setTrailerOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, height: { xs: '260px', sm: '420px', md: '480px' } }}>
                    {movie.trailerKey && (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}?autoplay=1&rel=0`}
                            title={movie.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: 0 }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Review feedback toast */}
            <Snackbar
                open={reviewToast.open}
                autoHideDuration={3000}
                onClose={() => setReviewToast(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setReviewToast(prev => ({ ...prev, open: false }))}
                    severity={reviewToast.severity}
                    variant="filled"
                    sx={{
                        fontWeight: 600,
                        bgcolor: reviewToast.severity === 'success' ? '#f5c518' : undefined,
                        color: reviewToast.severity === 'success' ? '#000' : undefined
                    }}
                >
                    {reviewToast.message}
                </Alert>
            </Snackbar>

            {/* Share Confirmation Toast */}
            <Snackbar
                open={shareToast}
                autoHideDuration={2500}
                onClose={() => setShareToast(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setShareToast(false)} severity="success" variant="filled" sx={{ bgcolor: '#f5c518', color: '#000', fontWeight: 600 }}>
                    Movie link copied to clipboard!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MovieDetail;
