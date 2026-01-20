import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("rating");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        if (e) e.preventDefault(); // Handle form submit or effect
        try {
            // If query is empty, we can fetch 'sorted' or just search with empty string (regex matches all)
            const res = await axios.get(`/api/movies/search?q=${query}&sort=${sort}`);
            setResults(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Optional: Search automatically when sort changes
    React.useEffect(() => {
        if (query || sort) {
            handleSearch();
        }
    }, [sort]);
    // Note: We might not want to auto-search on every keystroke of query, but on sort change yes if results exist.
    // For simplicity, let's keep search on button click OR enter, but sort triggers re-fetch if we have results? 
    // Or just treat it as a filter.
    // Let's make "Search" button trigger the fetch. Sort dropdown also triggers fetch.

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                    fullWidth
                    label="Search Movies"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or description..."
                />
                <TextField
                    select
                    label="Sort By"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    SelectProps={{
                        native: true,
                    }}
                    sx={{ minWidth: 200 }}
                >
                    <option value="rating">Rating (High to Low)</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="releaseDate">Release Date (Newest)</option>
                    <option value="duration">Duration (Shortest)</option>
                </TextField>
                <Button variant="contained" onClick={(e) => handleSearch(e)} size="large">Search</Button>
            </Box>
            <Grid container spacing={3}>
                {results.map((movie) => (
                    <Grid item xs={6} sm={4} md={3} key={movie._id}>
                        <Card
                            sx={{
                                height: '100%',
                                bgcolor: '#1a1a1a',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative', overflow: 'hidden', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={movie.posterPath
                                        ? (movie.posterPath.startsWith('/images')
                                            ? `${movie.posterPath}`
                                            : `https://image.tmdb.org/t/p/w500${movie.posterPath}`)
                                        : `https://placehold.co/300x450?text=${movie.title}`}
                                    alt={movie.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'gray' }}>
                                    <Typography variant="body2" sx={{ mr: 1, display: 'flex', alignItems: 'center', color: '#f5c518', fontWeight: 'bold' }}>
                                        <span style={{ fontSize: '16px', marginRight: '4px' }}>★</span> {movie.rating.toFixed(1)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">| {movie.releaseDate?.substring(0, 4)}</Typography>
                                </Box>
                                <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 'bold', lineHeight: 1.2, mb: 1, color: 'white' }}>
                                    {movie.title}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    color="primary"
                                    onClick={() => navigate(`/movie/${movie._id}`)}
                                    sx={{
                                        mt: 'auto',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            bgcolor: 'rgba(245, 197, 24, 0.1)'
                                        }
                                    }}
                                >
                                    Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Search;
