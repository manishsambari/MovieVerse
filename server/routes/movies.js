const router = require('express').Router();
const Movie = require('../models/Movie');
const verifyToken = require('../middleware/auth');
const verifyAdmin = require('../middleware/admin');

// CREATE MOVIE (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    const newMovie = new Movie(req.body);
    try {
        const savedMovie = await newMovie.save();
        res.status(200).json(savedMovie);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE MOVIE (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedMovie);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE MOVIE (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json('Movie has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET MOVIE
router.get('/find/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL MOVIES (Pagination)
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Default limit 20
    const skip = (page - 1) * limit;

    try {
        let filter = {};
        if (qCategory) {
            filter.genres = { $in: [qCategory] };
        }

        const movies = await Movie.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Movie.countDocuments();

        res.status(200).json({
            movies,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error("Get Movies Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// SEARCH MOVIES
router.get('/search', async (req, res) => {
    const query = req.query.q;
    const sortBy = req.query.sort; // rating, releaseDate, duration, name

    let sortOption = {};
    if (sortBy === 'rating') sortOption = { rating: -1 };
    else if (sortBy === 'releaseDate') sortOption = { releaseDate: -1 };
    else if (sortBy === 'duration') sortOption = { duration: 1 };
    else if (sortBy === 'name') sortOption = { title: 1 };
    else sortOption = { createdAt: -1 };

    try {
        const movies = await Movie.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).sort(sortOption);
        res.status(200).json(movies);
    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// SORT MOVIES
router.get('/sorted', async (req, res) => {
    const sortBy = req.query.sort; // rating, releaseDate, duration, name
    let sortOption = {};

    if (sortBy === 'rating') sortOption = { rating: -1 };
    else if (sortBy === 'releaseDate') sortOption = { releaseDate: -1 };
    else if (sortBy === 'duration') sortOption = { duration: 1 };
    else if (sortBy === 'name') sortOption = { title: 1 };
    else sortOption = { createdAt: -1 };

    try {
        const movies = await Movie.find().sort(sortOption);
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
