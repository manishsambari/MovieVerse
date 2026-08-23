import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api, { getPosterUrl } from '../utils/api';
import {
    Container,
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Chip,
    InputAdornment,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Skeleton,
    Paper,
    Divider,
    Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import StarIcon from '@mui/icons-material/Star';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WatchlistButton from '../components/WatchlistButton';

const CATEGORIES = [
    'All',
    'Action',
    'Drama',
    'Comedy',
    'Crime',
    'Animation',
    'Adventure',
    'Thriller',
    'Sci-Fi',
    'Horror',
    'Romance'
];

const DECADES = [
    { label: 'All Eras', value: '' },
    { label: '2020s', value: '2020s' },
    { label: '2010s', value: '2010s' },
    { label: '2000s', value: '2000s' },
    { label: '1990s', value: '1990s' },
    { label: 'Classics (<1990)', value: 'classic' },
];

const RATINGS = [
    { label: 'Any Rating', value: 0 },
    { label: '★ 7.0+', value: 7.0 },
    { label: '★ 8.0+', value: 8.0 },
    { label: '★ 8.5+', value: 8.5 },
];

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialQuery = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || 'All';
    const initialSort = searchParams.get('sort') || 'rating';
    const initialMinRating = parseFloat(searchParams.get('minRating')) || 0;
    const initialDecade = searchParams.get('decade') || '';

    const [query, setQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState(initialSort);
    const [minRating, setMinRating] = useState(initialMinRating);
    const [decade, setDecade] = useState(initialDecade);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Sync state when URL search params change
    useEffect(() => {
        const q = searchParams.get('q') || '';
        const cat = searchParams.get('category') || 'All';
        const s = searchParams.get('sort') || 'rating';
        const mr = parseFloat(searchParams.get('minRating')) || 0;
        const dec = searchParams.get('decade') || '';
        setQuery(q);
        setCategory(cat);
        setSort(s);
        setMinRating(mr);
        setDecade(dec);
    }, [searchParams]);

    const fetchMovies = useCallback(async (searchQuery, selectedCat, selectedSort, selectedMinRating, selectedDecade) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append('q', searchQuery.trim());
            if (selectedCat && selectedCat !== 'All') params.append('category', selectedCat);
            if (selectedSort) params.append('sort', selectedSort);
            if (selectedMinRating > 0) params.append('minRating', selectedMinRating);
            if (selectedDecade) params.append('decade', selectedDecade);

            const res = await api.get(`/movies/search?${params.toString()}`);
            setResults(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Search movies error:', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search trigger
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchMovies(query, category, sort, minRating, decade);
        }, 300);

        return () => clearTimeout(handler);
    }, [query, category, sort, minRating, decade, fetchMovies]);

    const handleCategoryChange = (newCat) => {
        setCategory(newCat);
        const nextParams = new URLSearchParams(searchParams);
        if (newCat && newCat !== 'All') {
            nextParams.set('category', newCat);
        } else {
            nextParams.delete('category');
        }
        setSearchParams(nextParams);
    };

    const handleDecadeChange = (newDecade) => {
        setDecade(newDecade);
        const nextParams = new URLSearchParams(searchParams);
        if (newDecade) {
            nextParams.set('decade', newDecade);
        } else {
            nextParams.delete('decade');
        }
        setSearchParams(nextParams);
    };

    const handleRatingChange = (newRating) => {
        setMinRating(newRating);
        const nextParams = new URLSearchParams(searchParams);
        if (newRating > 0) {
            nextParams.set('minRating', newRating);
        } else {
            nextParams.delete('minRating');
        }
        setSearchParams(nextParams);
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSort(newSort);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('sort', newSort);
        setSearchParams(nextParams);
    };

    const handleClearAll = () => {
        setQuery('');
        setCategory('All');
        setMinRating(0);
        setDecade('');
        setSort('rating');
        setSearchParams(new URLSearchParams());
    };

    const hasActiveFilters = query || category !== 'All' || minRating > 0 || decade;

    return (
        <Container maxWidth="xl" sx={{ pt: 4, pb: 10 }}>
            {/* Header Title */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: '#fff', mb: 1, fontFamily: '"Outfit", sans-serif' }}>
                    Explore Movies
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Filter by genre, minimum star rating, decade, or search by keyword in real time.
                </Typography>
            </Box>

            {/* Search and Filter Card */}
            <Paper
                sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    mb: 4,
                    bgcolor: '#13151f',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    {/* Search Input */}
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            placeholder="Search by title, director, keyword..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#f5c518' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: query ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setQuery('')} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                                    borderRadius: 2
                                }
                            }}
                        />
                    </Grid>

                    {/* Sort Dropdown */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="sort-select-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sort By</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                value={sort}
                                label="Sort By"
                                onChange={handleSortChange}
                                startAdornment={<SortIcon sx={{ color: '#f5c518', mr: 1 }} />}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                                    borderRadius: 2,
                                    color: '#fff',
                                    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
                                }}
                            >
                                <MenuItem value="rating">Top Rated (Highest First)</MenuItem>
                                <MenuItem value="releaseDate">Release Date (Newest First)</MenuItem>
                                <MenuItem value="name">Title (A - Z)</MenuItem>
                                <MenuItem value="duration">Runtime (Shortest First)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

                {/* Genre Filter Chips */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                        Genres:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                        {CATEGORIES.map((cat) => {
                            const isSelected = category === cat;
                            return (
                                <Chip
                                    key={cat}
                                    label={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    sx={{
                                        bgcolor: isSelected ? '#f5c518' : 'rgba(255, 255, 255, 0.05)',
                                        color: isSelected ? '#000' : 'rgba(255, 255, 255, 0.8)',
                                        fontWeight: isSelected ? 800 : 500,
                                        border: isSelected ? '1px solid #f5c518' : '1px solid rgba(255, 255, 255, 0.08)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: isSelected ? '#ffd700' : 'rgba(245, 197, 24, 0.15)',
                                            color: isSelected ? '#000' : '#f5c518',
                                        }
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>

                {/* Rating & Decade Filter Groups */}
                <Grid container spacing={2}>
                    {/* Minimum Rating */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                            Minimum Rating:
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.8 }}>
                            {RATINGS.map((r) => {
                                const isSelected = minRating === r.value;
                                return (
                                    <Chip
                                        key={r.label}
                                        label={r.label}
                                        onClick={() => handleRatingChange(r.value)}
                                        size="small"
                                        sx={{
                                            bgcolor: isSelected ? 'rgba(245, 197, 24, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                                            color: isSelected ? '#f5c518' : 'rgba(255, 255, 255, 0.75)',
                                            fontWeight: isSelected ? 800 : 500,
                                            border: isSelected ? '1px solid #f5c518' : '1px solid rgba(255, 255, 255, 0.08)',
                                        }}
                                    />
                                );
                            })}
                        </Stack>
                    </Grid>

                    {/* Decade / Era */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                            Decade:
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.8 }}>
                            {DECADES.map((d) => {
                                const isSelected = decade === d.value;
                                return (
                                    <Chip
                                        key={d.label}
                                        label={d.label}
                                        onClick={() => handleDecadeChange(d.value)}
                                        size="small"
                                        sx={{
                                            bgcolor: isSelected ? 'rgba(245, 197, 24, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                                            color: isSelected ? '#f5c518' : 'rgba(255, 255, 255, 0.75)',
                                            fontWeight: isSelected ? 800 : 500,
                                            border: isSelected ? '1px solid #f5c518' : '1px solid rgba(255, 255, 255, 0.08)',
                                        }}
                                    />
                                );
                            })}
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results Count and Active Filters Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                    {loading ? 'Searching catalog...' : `Found ${results.length} ${results.length === 1 ? 'movie' : 'movies'}`}
                </Typography>

                {hasActiveFilters && (
                    <Button
                        size="small"
                        onClick={handleClearAll}
                        sx={{ color: '#f5c518', textTransform: 'none', fontWeight: 600 }}
                    >
                        Reset All Filters
                    </Button>
                )}
            </Box>

            {/* Results Grid */}
            <Grid container spacing={3}>
                {loading ? (
                    Array.from(new Array(10)).map((_, i) => (
                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={i}>
                            <Skeleton variant="rounded" height={280} sx={{ bgcolor: '#161924', borderRadius: 2 }} />
                            <Skeleton width="80%" height={24} sx={{ bgcolor: '#1d2130', mt: 1 }} />
                            <Skeleton width="40%" height={18} sx={{ bgcolor: '#1d2130' }} />
                        </Grid>
                    ))
                ) : results.length > 0 ? (
                    results.map((movie) => (
                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie._id}>
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    transition: 'all 0.28s ease',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        '& .poster-img': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.8), 0 0 16px rgba(245, 197, 24, 0.2)',
                                        }
                                    }
                                }}
                                onClick={() => navigate(`/movie/${movie._id}`)}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: { xs: '240px', sm: '290px' },
                                        borderRadius: 2.5,
                                        overflow: 'hidden',
                                        bgcolor: '#181a24',
                                        mb: 1.2,
                                        border: '1px solid rgba(255, 255, 255, 0.06)'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        className="poster-img"
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

                                    {/* Rating Overlay */}
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
                                </Box>

                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
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
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
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
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                py: 10,
                                px: 3,
                                textAlign: 'center',
                                bgcolor: '#13151f',
                                borderRadius: 3,
                                border: '1px solid rgba(255, 255, 255, 0.06)'
                            }}
                        >
                            <MovieFilterIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
                                No movies found
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3, maxWidth: 420, mx: 'auto' }}>
                                We couldn't find any movies matching your current filters. Try relaxing the rating, era, or genre.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClearAll}
                            >
                                Reset All Filters
                            </Button>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Search;
