import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, Divider, IconButton, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import GitHubIcon from '@mui/icons-material/GitHub';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#08090c',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.7)',
                pt: 8,
                pb: 4,
                mt: 'auto'
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {/* Brand column */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Box
                                sx={{
                                    bgcolor: '#f5c518',
                                    color: '#000',
                                    p: 0.8,
                                    borderRadius: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 16px rgba(245, 197, 24, 0.4)'
                                }}
                            >
                                <MovieIcon sx={{ fontSize: 24 }} />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: '"Outfit", sans-serif',
                                    fontWeight: 900,
                                    letterSpacing: '-0.5px',
                                    color: '#fff'
                                }}
                            >
                                Movie<span style={{ color: '#f5c518' }}>Verse</span>
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.7, mb: 3, maxWidth: 360 }}>
                            Your ultimate destination for discovering top-rated cinematic masterpieces, curated genres, trailers, and personal watchlist tracking.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                component="a"
                                href="https://github.com/manishsambari/MovieVerse"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    '&:hover': { color: '#f5c518', bgcolor: 'rgba(245, 197, 24, 0.15)' }
                                }}
                            >
                                <GitHubIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* Navigation */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                            Navigation
                        </Typography>
                        <Stack spacing={1.2}>
                            <MuiLink component={Link} to="/" sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#f5c518' }, fontSize: '0.9rem' }}>
                                Home
                            </MuiLink>
                            <MuiLink component={Link} to="/search" sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#f5c518' }, fontSize: '0.9rem' }}>
                                Explore & Search
                            </MuiLink>
                            <MuiLink component={Link} to="/profile" sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#f5c518' }, fontSize: '0.9rem' }}>
                                My Watchlist
                            </MuiLink>
                        </Stack>
                    </Grid>

                    {/* Top Genres */}
                    <Grid item xs={6} sm={3} md={3}>
                        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                            Popular Categories
                        </Typography>
                        <Stack spacing={1.2}>
                            <MuiLink component={Link} to="/search?category=Action" sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#f5c518' }, fontSize: '0.9rem' }}>
                                Action & Adventure
                            </MuiLink>
                            <MuiLink component={Link} to="/search?category=Drama" sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#f5c518' }, fontSize: '0.9rem' }}>
                                Drama & Romance
                            </MuiLink>
                            <MuiLink component={Link} to="/search?category=Comedy" sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#f5c518' }, fontSize: '0.9rem' }}>
                                Comedy Favorites
                            </MuiLink>
                            <MuiLink component={Link} to="/search?category=Crime" sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: '#f5c518' }, fontSize: '0.9rem' }}>
                                Crime & Thriller
                            </MuiLink>
                        </Stack>
                    </Grid>

                    {/* Attribution & Tech */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                            Data Attribution
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.6, fontSize: '0.85rem' }}>
                            Movie metadata, posters, and cast information are provided courtesy of TMDb. This product uses the TMDb API but is not endorsed or certified by TMDb.
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)' }}>
                        © {new Date().getFullYear()} MovieVerse. Built with React, Material-UI & Node.js.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.75rem' }}>
                        <span>Crafted with</span>
                        <FavoriteIcon sx={{ fontSize: 13, color: '#e50914' }} />
                        <span>for cinema lovers</span>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
