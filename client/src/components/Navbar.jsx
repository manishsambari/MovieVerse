import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ background: 'black', boxShadow: 'none' }}>
                {/* Note: 'fixed' position might require padding-top in the main content. I will handle that in index.css or Container. */}
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: '900', color: '#f5c518', letterSpacing: '-1px' }}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#f5c518', border: '2px solid #f5c518', padding: '4px 8px', borderRadius: '4px' }}>
                            MovieVerse
                        </Link>
                    </Typography>

                    <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 'normal' }}>Home</Button>
                    <Button color="inherit" component={Link} to="/search" sx={{ fontWeight: 'normal' }}>Search</Button>
                    {user && (
                        <Button color="inherit" component={Link} to="/profile" sx={{ fontWeight: 'normal' }}>Profile</Button>
                    )}

                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            {user.role === 'admin' && (
                                <Button color="inherit" component={Link} to="/admin" sx={{ mr: 1 }}>Admin</Button>
                            )}
                            <Typography variant="body2" sx={{ mx: 2, color: '#aaa' }}>{user.username}</Typography>
                            <Button color="primary" variant="contained" size="small" onClick={handleLogout} sx={{ fontWeight: 'bold' }}>Logout</Button>
                        </Box>
                    ) : (
                        <Box sx={{ ml: 2 }}>
                            <Button color="inherit" component={Link} to="/login" sx={{ mr: 1 }}>Login</Button>
                            <Button variant="contained" color="primary" component={Link} to="/register">Sign Up</Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            {/* Spacer for fixed AppBar */}
            <Toolbar />
        </Box>
    );
}
