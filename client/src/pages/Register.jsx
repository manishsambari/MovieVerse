import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', {
                username,
                email,
                password,
            });
            navigate('/login');
        } catch (err) {
            console.error('Registration Error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Something went wrong with registration';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 72px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(245, 197, 24, 0.08) 0%, rgba(12, 13, 18, 0.95) 70%), url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    sx={{
                        p: { xs: 3.5, sm: 4.5 },
                        bgcolor: 'rgba(19, 21, 31, 0.92)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3.5,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 197, 24, 0.1)',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: '#f5c518',
                                color: '#000',
                                borderRadius: 2,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1.5,
                                boxShadow: '0 0 20px rgba(245, 197, 24, 0.5)'
                            }}
                        >
                            <MovieFilterIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', fontFamily: '"Outfit", sans-serif' }}>
                            Create Account
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.55)', mt: 0.5 }}>
                            Join MovieVerse to build your personal watchlist
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" onSubmit={handleRegister}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                        >
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            size="large"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.3,
                                fontWeight: 800,
                                fontSize: '1rem',
                                borderRadius: '50px',
                                boxShadow: '0 0 20px rgba(245, 197, 24, 0.4)'
                            }}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                    {/* Bottom prompt */}
                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#f5c518', fontWeight: 700, textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;
