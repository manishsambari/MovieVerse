import React, { useState, useEffect, useContext, useMemo } from 'react';
import api, { getPosterUrl } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    InputAdornment,
    TablePagination,
    Snackbar,
    Alert,
    Chip,
    Stack,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const INITIAL_FORM = {
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
    genres: '',
    director: '',
    writers: '',
    trailerKey: '',
    posterPath: '',
    backdropPath: '',
};

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Modals
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [deleteModal, setDeleteModal] = useState({ open: false, movie: null });
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [submitting, setSubmitting] = useState(false);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const res = await api.get('/movies?limit=250');
            setMovies(res.data.movies || res.data || []);
        } catch (err) {
            console.error('Error fetching admin movies:', err);
            setToast({ open: true, message: 'Failed to fetch movies', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    // Filtered movies
    const filteredMovies = useMemo(() => {
        if (!searchQuery.trim()) return movies;
        const q = searchQuery.toLowerCase();
        return movies.filter(m =>
            m.title?.toLowerCase().includes(q) ||
            m.director?.toLowerCase().includes(q) ||
            m.genres?.some(g => g.toLowerCase().includes(q))
        );
    }, [movies, searchQuery]);

    // Stats
    const stats = useMemo(() => {
        if (!movies.length) return { total: 0, avgRating: 0 };
        const total = movies.length;
        const totalRating = movies.reduce((acc, m) => acc + (m.rating || 0), 0);
        return {
            total,
            avgRating: (totalRating / total).toFixed(1),
        };
    }, [movies]);

    const handleOpenAdd = () => {
        setEditingMovieId(null);
        setFormData(INITIAL_FORM);
        setModalOpen(true);
    };

    const handleOpenEdit = (movie) => {
        setEditingMovieId(movie._id);
        setFormData({
            title: movie.title || '',
            description: movie.description || '',
            rating: movie.rating || '',
            releaseDate: movie.releaseDate || '',
            duration: movie.duration || '',
            genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || '',
            director: movie.director || '',
            writers: Array.isArray(movie.writers) ? movie.writers.join(', ') : movie.writers || '',
            trailerKey: movie.trailerKey || '',
            posterPath: movie.posterPath || '',
            backdropPath: movie.backdropPath || '',
        });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingMovieId(null);
        setFormData(INITIAL_FORM);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = async (file, field) => {
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, [field]: res.data }));
            setToast({ open: true, message: `${field === 'posterPath' ? 'Poster' : 'Backdrop'} uploaded successfully`, severity: 'success' });
        } catch (err) {
            console.error('Upload error:', err);
            setToast({ open: true, message: 'Image upload failed', severity: 'error' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            ...formData,
            rating: formData.rating ? parseFloat(formData.rating) : 0,
            duration: formData.duration ? parseInt(formData.duration, 10) : 0,
            genres: typeof formData.genres === 'string'
                ? formData.genres.split(',').map(g => g.trim()).filter(Boolean)
                : formData.genres,
            writers: typeof formData.writers === 'string'
                ? formData.writers.split(',').map(w => w.trim()).filter(Boolean)
                : formData.writers,
        };

        try {
            if (editingMovieId) {
                await api.put(`/movies/${editingMovieId}`, payload);
                setToast({ open: true, message: 'Movie updated successfully!', severity: 'success' });
            } else {
                await api.post('/movies', payload);
                setToast({ open: true, message: 'Movie added successfully!', severity: 'success' });
            }
            handleCloseModal();
            fetchMovies();
        } catch (err) {
            console.error('Submit error:', err);
            setToast({ open: true, message: err.response?.data?.message || 'Error saving movie', severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal.movie) return;
        try {
            await api.delete(`/movies/${deleteModal.movie._id}`);
            setMovies(prev => prev.filter(m => m._id !== deleteModal.movie._id));
            setToast({ open: true, message: `"${deleteModal.movie.title}" deleted successfully`, severity: 'success' });
            setDeleteModal({ open: false, movie: null });
        } catch (err) {
            console.error('Delete error:', err);
            setToast({ open: true, message: 'Failed to delete movie', severity: 'error' });
        }
    };

    const [seeding, setSeeding] = useState(false);

    const handleSeedMovies = async () => {
        setSeeding(true);
        try {
            const res = await api.post('/seed?force=true');
            setToast({ open: true, message: res.data.message || 'Movies seeded successfully!', severity: 'success' });
            fetchMovies();
        } catch (err) {
            console.error('Seed error:', err);
            setToast({ open: true, message: 'Failed to seed movies', severity: 'error' });
        } finally {
            setSeeding(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ pt: 4, pb: 10 }}>
            {/* Header & Stats Banner */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 4 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Box sx={{ bgcolor: 'rgba(245, 197, 24, 0.15)', color: '#f5c518', p: 1, borderRadius: 2, border: '1px solid rgba(245, 197, 24, 0.4)' }}>
                            <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', fontFamily: '"Outfit", sans-serif' }}>
                            Admin Dashboard
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Manage catalogue, add new movies, update metadata, and handle media assets.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={handleSeedMovies}
                        disabled={seeding}
                        startIcon={<MovieIcon />}
                        sx={{
                            borderColor: 'rgba(245, 197, 24, 0.5)',
                            color: '#f5c518',
                            fontWeight: 700,
                            borderRadius: '50px',
                            px: 2.5,
                            '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.1)', borderColor: '#f5c518' }
                        }}
                    >
                        {seeding ? 'Seeding Movies...' : 'Seed Catalog'}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAdd}
                        sx={{
                            fontWeight: 800,
                            px: 3,
                            py: 1.2,
                            borderRadius: '50px',
                            boxShadow: '0 0 20px rgba(245, 197, 24, 0.4)'
                        }}
                    >
                        Add New Movie
                    </Button>
                </Stack>
            </Box>

            {/* Quick Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2.5, bgcolor: '#13151f', borderRadius: 2.5, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>
                            Total Movies
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', mt: 0.5 }}>
                            {stats.total}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2.5, bgcolor: '#13151f', borderRadius: 2.5, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', fontWeight: 700 }}>
                            Catalog Avg Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <StarIcon sx={{ color: '#f5c518', fontSize: 28 }} />
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#f5c518' }}>
                                {stats.avgRating}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Table Container with Search */}
            <Paper sx={{ bgcolor: '#13151f', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <TextField
                        size="small"
                        placeholder="Search movies in table by title, director, genre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#f5c518' }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )
                        }}
                        sx={{ maxWidth: 400, bgcolor: 'rgba(255, 255, 255, 0.04)', borderRadius: 2 }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Poster</TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Title</TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Rating</TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Release Year</TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Duration</TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Genres</TableCell>
                                <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'rgba(255,255,255,0.5)' }}>
                                        Loading movies catalogue...
                                    </TableCell>
                                </TableRow>
                            ) : filteredMovies.length > 0 ? (
                                filteredMovies
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((movie) => (
                                        <TableRow
                                            key={movie._id}
                                            hover
                                            sx={{
                                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}
                                        >
                                            <TableCell>
                                                <Box
                                                    component="img"
                                                    src={getPosterUrl(movie.posterPath, 'w92')}
                                                    alt={movie.title}
                                                    sx={{ width: 40, height: 56, borderRadius: 1, objectFit: 'cover', bgcolor: '#191c28' }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: '#fff', fontWeight: 700, maxWidth: 220 }}>
                                                {movie.title}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#f5c518', fontWeight: 700 }}>
                                                    <StarIcon sx={{ fontSize: 16 }} />
                                                    {movie.rating ? movie.rating.toFixed(1) : 'NR'}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                {movie.releaseDate ? movie.releaseDate.substring(0, 4) : 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                {movie.duration ? `${movie.duration}m` : 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 200 }}>
                                                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                                    {movie.genres?.slice(0, 2).map((g) => (
                                                        <Chip key={g} label={g} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }} />
                                                    ))}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit Movie">
                                                    <IconButton
                                                        onClick={() => handleOpenEdit(movie)}
                                                        sx={{ color: '#f5c518', mr: 1, bgcolor: 'rgba(245, 197, 24, 0.1)', '&:hover': { bgcolor: 'rgba(245, 197, 24, 0.2)' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Movie">
                                                    <IconButton
                                                        onClick={() => setDeleteModal({ open: true, movie })}
                                                        sx={{ color: '#ff4444', bgcolor: 'rgba(255, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(255, 68, 68, 0.2)' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'rgba(255,255,255,0.5)' }}>
                                        No movies found matching "{searchQuery}".
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredMovies.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    sx={{ color: 'rgba(255,255,255,0.7)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
                />
            </Paper>

            {/* Add / Edit Movie Modal */}
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#13151f',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', pb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {editingMovieId ? 'Edit Movie' : 'Add New Movie'}
                    </Typography>
                    <IconButton onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                        <Grid container spacing={2.5}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    required
                                    name="title"
                                    label="Movie Title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    name="rating"
                                    label="Rating (0 - 10)"
                                    type="number"
                                    inputProps={{ step: '0.1', min: '0', max: '10' }}
                                    value={formData.rating}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    name="description"
                                    label="Overview / Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="releaseDate"
                                    label="Release Date (YYYY-MM-DD)"
                                    value={formData.releaseDate}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="duration"
                                    label="Duration (minutes)"
                                    type="number"
                                    value={formData.duration}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="genres"
                                    label="Genres (comma separated, e.g. Action, Sci-Fi)"
                                    value={formData.genres}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="director"
                                    label="Director"
                                    value={formData.director}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="writers"
                                    label="Writers (comma separated)"
                                    value={formData.writers}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="trailerKey"
                                    label="YouTube Trailer Key (e.g. dQw4w9WgXcQ)"
                                    value={formData.trailerKey}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="posterPath"
                                    label="Poster URL or /images/..."
                                    value={formData.posterPath}
                                    onChange={handleChange}
                                />
                                <Box sx={{ mt: 1 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        size="small"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ color: '#f5c518', borderColor: 'rgba(245, 197, 24, 0.4)' }}
                                    >
                                        Upload Poster File
                                        <input type="file" hidden accept="image/*" onChange={(e) => handleUpload(e.target.files[0], 'posterPath')} />
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="backdropPath"
                                    label="Backdrop URL or /images/..."
                                    value={formData.backdropPath}
                                    onChange={handleChange}
                                />
                                <Box sx={{ mt: 1 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        size="small"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ color: '#f5c518', borderColor: 'rgba(245, 197, 24, 0.4)' }}
                                    >
                                        Upload Backdrop File
                                        <input type="file" hidden accept="image/*" onChange={(e) => handleUpload(e.target.files[0], 'backdropPath')} />
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={handleCloseModal} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={submitting}
                            sx={{ fontWeight: 800, px: 3 }}
                        >
                            {submitting ? 'Saving...' : editingMovieId ? 'Update Movie' : 'Create Movie'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, movie: null })}
                PaperProps={{ sx: { bgcolor: '#13151f', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.15)', p: 1 } }}
            >
                <DialogTitle sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Confirm Movie Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Are you sure you want to permanently delete <strong>{deleteModal.movie?.title}</strong>? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteModal({ open: false, movie: null })} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={confirmDelete} sx={{ fontWeight: 700 }}>
                        Delete Movie
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast notifications */}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setToast(prev => ({ ...prev, open: false }))}
                    severity={toast.severity}
                    variant="filled"
                    sx={{ width: '100%', fontWeight: 600 }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminDashboard;
