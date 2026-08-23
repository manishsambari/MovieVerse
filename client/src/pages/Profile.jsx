import React, { useState, useContext, useMemo } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    Avatar,
    Paper,
    Button,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Skeleton,
    Stack,
    Divider
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExploreIcon from '@mui/icons-material/Explore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AuthContext } from '../context/AuthContext';
import { WatchlistContext } from '../context/WatchlistContext';
import { getPosterUrl } from '../utils/api';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const { watchlist, loading, toggleWatchlist } = useContext(WatchlistContext);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('rating');

    // Calculate stats
    const stats = useMemo(() => {
        if (!watchlist || watchlist.length === 0) {
            return { count: 0, avgRating: 0, totalHours: 0 };
        }
        const count = watchlist.length;
        const totalRating = watchlist.reduce((acc, m) => acc + (m.rating || 0), 0);
        const avgRating = (totalRating / count).toFixed(1);
        const totalMinutes = watchlist.reduce((acc, m) => acc + (m.duration || 0), 0);
        const totalHours = (totalMinutes / 60).toFixed(1);

        return { count, avgRating, totalHours };
    }, [watchlist]);

    // Filter and sort watchlist
    const filteredWatchlist = useMemo(() => {
        let list = [...watchlist];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(m =>
                m.title?.toLowerCase().includes(q) ||
                m.description?.toLowerCase().includes(q) ||
                m.genres?.some(g => g.toLowerCase().includes(q))
            );
        }

        if (sortBy === 'rating') {
            list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'releaseDate') {
            list.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
        } else if (sortBy === 'title') {
            list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        return list;
    }, [watchlist, searchQuery, sortBy]);

    if (!user) return null;

    const avatarLetter = user.username?.charAt(0).toUpperCase() || 'U';

    return (
        <Container maxWidth="xl" sx={{ pt: 4, pb: 10 }}>
            {/* User Profile Header Card */}
            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 5,
                    bgcolor: '#13151f',
                    borderRadius: 3.5,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundImage: 'linear-gradient(135deg, rgba(245, 197, 24, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar
                                sx={{
                                    width: { xs: 70, md: 88 },
                                    height: { xs: 70, md: 88 },
                                    bgcolor: '#f5c518',
                                    color: '#000',
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                    fontWeight: 900,
                                    boxShadow: '0 0 24px rgba(245, 197, 24, 0.45)',
                                    fontFamily: '"Outfit", sans-serif'
                                }}
                            >
                                {avatarLetter}
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', fontFamily: '"Outfit", sans-serif' }}>
                                        {user.username}
                                    </Typography>
                                    <Chip
                                        icon={user.role === 'admin' ? <AdminPanelSettingsIcon sx={{ fontSize: '16px !important' }} /> : <PersonIcon sx={{ fontSize: '16px !important' }} />}
                                        label={user.role === 'admin' ? 'Administrator' : 'Member'}
                                        size="small"
                                        sx={{
                                            bgcolor: user.role === 'admin' ? 'rgba(245, 197, 24, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            color: user.role === 'admin' ? '#f5c518' : '#fff',
                                            fontWeight: 700,
                                            border: user.role === 'admin' ? '1px solid rgba(245, 197, 24, 0.4)' : '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.8 }}>
                                    {user.email}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Quick Stats Grid */}
                    <Grid item xs={12} md={5}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <BookmarkIcon sx={{ color: '#f5c518', fontSize: 24, mb: 0.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                                        {stats.count}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                        Saved
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <StarIcon sx={{ color: '#f5c518', fontSize: 24, mb: 0.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                                        {stats.avgRating}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                        Avg Rating
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <AccessTimeIcon sx={{ color: '#f5c518', fontSize: 24, mb: 0.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                                        {stats.totalHours}h
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                        Watch Time
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Watchlist Section Header with Search & Sort */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', fontFamily: '"Outfit", sans-serif' }}>
                        My Watchlist ({stats.count})
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.55)' }}>
                        All movies you have bookmarked to watch later.
                    </Typography>
                </Box>

                {watchlist.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            size="small"
                            placeholder="Filter watchlist..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#f5c518', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ minWidth: 200, bgcolor: '#13151f', borderRadius: 2 }}
                        />

                        <FormControl size="small" sx={{ minWidth: 160, bgcolor: '#13151f', borderRadius: 2 }}>
                            <InputLabel id="watchlist-sort-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Sort By</InputLabel>
                            <Select
                                labelId="watchlist-sort-label"
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => setSortBy(e.target.value)}
                                sx={{ color: '#fff' }}
                            >
                                <MenuItem value="rating">Top Rated</MenuItem>
                                <MenuItem value="releaseDate">Newest Release</MenuItem>
                                <MenuItem value="title">Title (A-Z)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </Box>

            {/* Watchlist Grid */}
            {loading ? (
                <Grid container spacing={3}>
                    {Array.from(new Array(4)).map((_, i) => (
                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={i}>
                            <Skeleton variant="rounded" height={280} sx={{ bgcolor: '#161924', borderRadius: 2 }} />
                            <Skeleton width="80%" height={24} sx={{ bgcolor: '#1d2130', mt: 1 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : filteredWatchlist.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredWatchlist.map((movie) => (
                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie._id}>
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    borderRadius: 2.5,
                                    overflow: 'hidden',
                                    bgcolor: '#13151f',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    transition: 'all 0.28s ease',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        borderColor: 'rgba(245, 197, 24, 0.3)',
                                        boxShadow: '0 12px 28px rgba(0,0,0,0.8), 0 0 16px rgba(245, 197, 24, 0.2)',
                                        '& .remove-btn': { opacity: 1 }
                                    }
                                }}
                            >
                                {/* Poster Image */}
                                <Box
                                    onClick={() => navigate(`/movie/${movie._id}`)}
                                    sx={{ position: 'relative', height: { xs: '230px', sm: '280px' }, cursor: 'pointer', overflow: 'hidden' }}
                                >
                                    <Box
                                        component="img"
                                        src={getPosterUrl(movie.posterPath, 'w342')}
                                        alt={movie.title}
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />

                                    {/* Rating badge */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            bgcolor: 'rgba(0, 0, 0, 0.75)',
                                            backdropFilter: 'blur(6px)',
                                            color: '#f5c518',
                                            px: 1,
                                            py: 0.3,
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

                                    {/* Remove button */}
                                    <IconButton
                                        className="remove-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWatchlist(movie);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(229, 9, 20, 0.85)',
                                            backdropFilter: 'blur(6px)',
                                            color: '#fff',
                                            opacity: { xs: 1, md: 0 },
                                            transition: 'all 0.2s ease',
                                            p: 0.8,
                                            '&:hover': { bgcolor: '#ff334b', transform: 'scale(1.1)' }
                                        }}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box sx={{ p: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        onClick={() => navigate(`/movie/${movie._id}`)}
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#fff',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer',
                                            '&:hover': { color: '#f5c518' }
                                        }}
                                    >
                                        {movie.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                            {movie.releaseDate ? movie.releaseDate.substring(0, 4) : ''}
                                        </Typography>
                                        {movie.duration > 0 && (
                                            <>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper
                    sx={{
                        py: 10,
                        px: 3,
                        textAlign: 'center',
                        bgcolor: '#13151f',
                        borderRadius: 3.5,
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                >
                    <BookmarkIcon sx={{ fontSize: 64, color: 'rgba(245, 197, 24, 0.3)', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 1, fontFamily: '"Outfit", sans-serif' }}>
                        {searchQuery ? 'No matching movies in watchlist' : 'Your Watchlist is Empty'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3.5, maxWidth: 450, mx: 'auto' }}>
                        {searchQuery
                            ? `No saved movies match "${searchQuery}".`
                            : 'Explore our catalog of top-rated hits, classics, and blockbuster movies, and tap the bookmark icon to start building your personal watchlist!'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component={Link}
                        to="/search"
                        startIcon={<ExploreIcon />}
                        sx={{
                            fontWeight: 800,
                            px: 4,
                            py: 1.2,
                            borderRadius: '50px',
                            boxShadow: '0 0 20px rgba(245, 197, 24, 0.35)'
                        }}
                    >
                        Explore Movies
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default Profile;
