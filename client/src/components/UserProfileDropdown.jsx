import React, { useState, useContext } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Box
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserProfileDropdown = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleClose();
        navigate('/profile');
    };

    const handleWatchlist = () => {
        handleClose();
        navigate('/profile');
    };

    const handleLogout = () => {
        handleClose();
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    if (!user) return null;

    // Get first letter of username for avatar
    const avatarLetter = user.username?.charAt(0).toUpperCase() || 'U';

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{
                    ml: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    }
                }}
                aria-controls={open ? 'profile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#f5c518',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        border: '2px solid transparent',
                        transition: 'border-color 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: '#f5c518',
                        }
                    }}
                >
                    {avatarLetter}
                </Avatar>
            </IconButton>

            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        mt: 1.5,
                        minWidth: 220,
                        overflow: 'visible',
                        bgcolor: '#1a1a1a',
                        border: '1px solid rgba(245, 197, 24, 0.2)',
                        borderRadius: 2,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: '#1a1a1a',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            borderTop: '1px solid rgba(245, 197, 24, 0.2)',
                            borderLeft: '1px solid rgba(245, 197, 24, 0.2)',
                        },
                    },
                }}
            >
                {/* User Info Section */}
                <Box sx={{ px: 2, py: 1.5, pb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            color: '#fff',
                            mb: 0.5
                        }}
                    >
                        {user.username}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            display: 'block'
                        }}
                    >
                        {user.email}
                    </Typography>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 0.5 }} />

                {/* Profile Menu Item */}
                <MenuItem
                    onClick={handleProfile}
                    sx={{
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            bgcolor: 'rgba(245, 197, 24, 0.1)',
                            pl: 2.5,
                        }
                    }}
                >
                    <ListItemIcon>
                        <AccountCircleIcon sx={{ color: '#f5c518' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Profile"
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: '#fff'
                        }}
                    />
                </MenuItem>

                {/* Watchlist Menu Item */}
                <MenuItem
                    onClick={handleWatchlist}
                    sx={{
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            bgcolor: 'rgba(245, 197, 24, 0.1)',
                            pl: 2.5,
                        }
                    }}
                >
                    <ListItemIcon>
                        <FavoriteIcon sx={{ color: '#e50914' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Watchlist"
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: '#fff'
                        }}
                    />
                </MenuItem>

                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 0.5 }} />

                {/* Logout Menu Item */}
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            bgcolor: 'rgba(229, 9, 20, 0.1)',
                            pl: 2.5,
                        }
                    }}
                >
                    <ListItemIcon>
                        <ExitToAppIcon sx={{ color: '#e50914' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: '#fff'
                        }}
                    />
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserProfileDropdown;
