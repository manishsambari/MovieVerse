import React, { useState, useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Badge,
    Divider,
    useMediaQuery,
    useTheme,
    Tooltip
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CasinoIcon from '@mui/icons-material/Casino';
import { AuthContext } from '../context/AuthContext';
import { WatchlistContext } from '../context/WatchlistContext';
import UserProfileDropdown from './UserProfileDropdown';
import SurpriseMeModal from './SurpriseMeModal';
import SearchDialog from './SearchDialog';

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const { watchlist } = useContext(WatchlistContext);
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [surpriseOpen, setSurpriseOpen] = useState(false);
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navLinks = [
        { label: 'Home', path: '/', icon: <HomeIcon /> },
        { label: 'Explore', path: '/search', icon: <SearchIcon /> },
    ];

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: 'rgba(12, 13, 18, 0.85)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    transition: 'all 0.3s ease',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 1.5, color: '#fff' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        {/* Brand Logo */}
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.2,
                                textDecoration: 'none',
                                mr: 4,
                                '&:hover .logo-icon': {
                                    transform: 'rotate(12deg) scale(1.08)',
                                }
                            }}
                        >
                            <Box
                                className="logo-icon"
                                sx={{
                                    bgcolor: '#f5c518',
                                    color: '#000',
                                    p: 0.6,
                                    borderRadius: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 16px rgba(245, 197, 24, 0.45)',
                                    transition: 'transform 0.25s ease'
                                }}
                            >
                                <MovieFilterIcon sx={{ fontSize: 24 }} />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: '"Outfit", sans-serif',
                                    fontWeight: 900,
                                    letterSpacing: '-0.5px',
                                    color: '#ffffff',
                                    userSelect: 'none',
                                }}
                            >
                                Movie<span style={{ color: '#f5c518' }}>Verse</span>
                            </Typography>
                        </Box>

                        {/* Desktop Navigation Links */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                                {navLinks.map((link) => (
                                    <Button
                                        key={link.path}
                                        component={Link}
                                        to={link.path}
                                        sx={{
                                            color: isActive(link.path) ? '#f5c518' : 'rgba(255, 255, 255, 0.75)',
                                            fontWeight: isActive(link.path) ? 700 : 500,
                                            fontSize: '0.95rem',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '8px',
                                            bgcolor: isActive(link.path) ? 'rgba(245, 197, 24, 0.08)' : 'transparent',
                                            position: 'relative',
                                            '&:hover': {
                                                color: '#fff',
                                                bgcolor: 'rgba(255, 255, 255, 0.06)',
                                            },
                                            ...(isActive(link.path) && {
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: 4,
                                                    left: '20%',
                                                    width: '60%',
                                                    height: '2px',
                                                    bgcolor: '#f5c518',
                                                    borderRadius: '2px',
                                                    boxShadow: '0 0 8px #f5c518'
                                                }
                                            })
                                        }}
                                    >
                                        {link.label}
                                    </Button>
                                ))}

                                {/* Surprise Me button */}
                                <Button
                                    onClick={() => setSurpriseOpen(true)}
                                    startIcon={<CasinoIcon sx={{ color: '#f5c518' }} />}
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        px: 2,
                                        py: 0.8,
                                        borderRadius: '8px',
                                        bgcolor: 'rgba(245, 197, 24, 0.08)',
                                        border: '1px solid rgba(245, 197, 24, 0.25)',
                                        '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.18)', borderColor: '#f5c518' }
                                    }}
                                >
                                    Surprise Me
                                </Button>
                            </Box>
                        )}

                        <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

                        {/* Right Section: Quick Search, Watchlist, Admin & Auth */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                            {/* Quick Search Shortcut Button */}
                            <Tooltip title="Quick Search (Ctrl + K)">
                                <Button
                                    onClick={() => setSearchDialogOpen(true)}
                                    startIcon={<SearchIcon sx={{ color: '#f5c518', fontSize: 20 }} />}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'rgba(255, 255, 255, 0.75)',
                                        borderRadius: '50px',
                                        px: { xs: 1.2, sm: 2 },
                                        py: 0.7,
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        minWidth: { xs: 'auto', sm: 140 },
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(245, 197, 24, 0.4)' }
                                    }}
                                >
                                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: '0.85rem' }}>
                                        Search...
                                    </Box>
                                    <Box
                                        component="span"
                                        sx={{
                                            display: { xs: 'none', md: 'inline-block' },
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            px: 0.8,
                                            py: 0.2,
                                            borderRadius: 1,
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                            color: 'rgba(255, 255, 255, 0.5)'
                                        }}
                                    >
                                        ⌘K
                                    </Box>
                                </Button>
                            </Tooltip>

                            {user ? (
                                <>
                                    {/* Watchlist Quick Button */}
                                    <IconButton
                                        component={Link}
                                        to="/profile"
                                        sx={{
                                            color: isActive('/profile') ? '#f5c518' : 'rgba(255, 255, 255, 0.8)',
                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.15)', color: '#f5c518' }
                                        }}
                                    >
                                        <Badge badgeContent={watchlist.length} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#f5c518', color: '#000', fontWeight: 'bold' } }}>
                                            <BookmarkIcon fontSize="small" />
                                        </Badge>
                                    </IconButton>

                                    {/* Admin Link */}
                                    {user.role === 'admin' && (
                                        <Button
                                            component={Link}
                                            to="/admin"
                                            startIcon={<AdminPanelSettingsIcon />}
                                            sx={{
                                                display: { xs: 'none', sm: 'inline-flex' },
                                                color: isActive('/admin') ? '#f5c518' : 'rgba(255, 255, 255, 0.8)',
                                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(245, 197, 24, 0.3)',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.15)' }
                                            }}
                                        >
                                            Admin
                                        </Button>
                                    )}

                                    {/* User Avatar Menu */}
                                    <UserProfileDropdown />
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        sx={{
                                            color: '#fff',
                                            fontWeight: 600,
                                            px: 2,
                                            borderRadius: '8px',
                                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' }
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to="/register"
                                        sx={{
                                            fontWeight: 700,
                                            px: 2.5,
                                            py: 0.8,
                                            borderRadius: '50px',
                                            boxShadow: '0 0 16px rgba(245, 197, 24, 0.35)'
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer Navigation */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        bgcolor: '#10121a',
                        backgroundImage: 'none',
                        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                        p: 2
                    },
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ bgcolor: '#f5c518', color: '#000', p: 0.5, borderRadius: 1 }}>
                            <MovieFilterIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                            Movie<span style={{ color: '#f5c518' }}>Verse</span>
                        </Typography>
                    </Box>
                    <IconButton onClick={handleDrawerToggle} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />

                <List sx={{ px: 0 }}>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={Link}
                            to="/"
                            onClick={handleDrawerToggle}
                            selected={isActive('/')}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': { bgcolor: 'rgba(245, 197, 24, 0.15)', color: '#f5c518' }
                            }}
                        >
                            <ListItemIcon sx={{ color: isActive('/') ? '#f5c518' : 'inherit' }}><HomeIcon /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={Link}
                            to="/search"
                            onClick={handleDrawerToggle}
                            selected={isActive('/search')}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': { bgcolor: 'rgba(245, 197, 24, 0.15)', color: '#f5c518' }
                            }}
                        >
                            <ListItemIcon sx={{ color: isActive('/search') ? '#f5c518' : 'inherit' }}><SearchIcon /></ListItemIcon>
                            <ListItemText primary="Explore Movies" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => {
                                handleDrawerToggle();
                                setSurpriseOpen(true);
                            }}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemIcon sx={{ color: '#f5c518' }}><CasinoIcon /></ListItemIcon>
                            <ListItemText primary="Surprise Me 🎲" />
                        </ListItemButton>
                    </ListItem>

                    {user && (
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to="/profile"
                                onClick={handleDrawerToggle}
                                selected={isActive('/profile')}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': { bgcolor: 'rgba(245, 197, 24, 0.15)', color: '#f5c518' }
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive('/profile') ? '#f5c518' : 'inherit' }}>
                                    <Badge badgeContent={watchlist.length} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: '#f5c518', color: '#000' } }}>
                                        <BookmarkIcon />
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary="My Watchlist" />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {user?.role === 'admin' && (
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to="/admin"
                                onClick={handleDrawerToggle}
                                selected={isActive('/admin')}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': { bgcolor: 'rgba(245, 197, 24, 0.15)', color: '#f5c518' }
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive('/admin') ? '#f5c518' : 'inherit' }}><AdminPanelSettingsIcon /></ListItemIcon>
                                <ListItemText primary="Admin Dashboard" />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>

                {!user && (
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            component={Link}
                            to="/login"
                            onClick={handleDrawerToggle}
                            startIcon={<LoginIcon />}
                            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/register"
                            onClick={handleDrawerToggle}
                            startIcon={<PersonAddIcon />}
                            sx={{ fontWeight: 'bold' }}
                        >
                            Create Account
                        </Button>
                    </Box>
                )}
            </Drawer>

            {/* Surprise Me Modal */}
            <SurpriseMeModal open={surpriseOpen} onClose={() => setSurpriseOpen(false)} />

            {/* Quick Search Dialog Palette (Ctrl + K) */}
            <SearchDialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} />

            {/* Spacer for fixed Navbar */}
            <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }} />
        </>
    );
}
