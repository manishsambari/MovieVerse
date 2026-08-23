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

// GET ALL MOVIES 
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
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

        const total = await Movie.countDocuments(filter);

        res.status(200).json({
            movies,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalMovies: total
        });
    } catch (err) {
        console.error("Get Movies Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// GET RANDOM MOVIE (Surprise Me)
router.get('/random', async (req, res) => {
    try {
        const count = await Movie.countDocuments();
        if (count === 0) {
            return res.status(404).json({ message: 'No movies available' });
        }
        const random = Math.floor(Math.random() * count);
        const movie = await Movie.findOne().skip(random);
        res.status(200).json(movie);
    } catch (err) {
        console.error("Random Movie Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// SEARCH MOVIES (With Advanced Filtering)
router.get('/search', async (req, res) => {
    const query = req.query.q ? req.query.q.trim() : '';
    const sortBy = req.query.sort; // rating, releaseDate, duration, name
    const category = req.query.category;
    const minRating = parseFloat(req.query.minRating);
    const decade = req.query.decade;

    let sortOption = {};
    if (sortBy === 'rating') sortOption = { rating: -1 };
    else if (sortBy === 'releaseDate') sortOption = { releaseDate: -1 };
    else if (sortBy === 'duration') sortOption = { duration: 1 };
    else if (sortBy === 'name') sortOption = { title: 1 };
    else sortOption = { rating: -1, createdAt: -1 };

    try {
        let filter = {};
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { director: { $regex: query, $options: 'i' } },
                { genres: { $regex: query, $options: 'i' } }
            ];
        }
        if (category && category !== 'All') {
            filter.genres = { $in: [category] };
        }
        if (!isNaN(minRating) && minRating > 0) {
            filter.rating = { $gte: minRating };
        }
        if (decade) {
            if (decade === '2020s') filter.releaseDate = { $gte: '2020-01-01', $lte: '2029-12-31' };
            else if (decade === '2010s') filter.releaseDate = { $gte: '2010-01-01', $lte: '2019-12-31' };
            else if (decade === '2000s') filter.releaseDate = { $gte: '2000-01-01', $lte: '2009-12-31' };
            else if (decade === '1990s') filter.releaseDate = { $gte: '1990-01-01', $lte: '1999-12-31' };
            else if (decade === 'classic') filter.releaseDate = { $lt: '1990-01-01' };
        }

        const movies = await Movie.find(filter).sort(sortOption);
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

// ADD / UPDATE REVIEW (Authenticated users)
router.post('/:id/reviews', verifyToken, async (req, res) => {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
        return res.status(400).json({ message: 'Rating and comment are required' });
    }

    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Check if user already reviewed
        const existingIndex = movie.reviews.findIndex(
            r => r.user.toString() === req.user.id.toString()
        );

        const newReview = {
            user: req.user.id,
            username: req.body.username || 'Anonymous User',
            rating: Number(rating),
            comment: comment.trim(),
            createdAt: new Date(),
        };

        if (existingIndex > -1) {
            movie.reviews[existingIndex] = newReview;
        } else {
            movie.reviews.unshift(newReview);
        }

        await movie.save();
        res.status(200).json({ message: 'Review saved successfully', reviews: movie.reviews });
    } catch (err) {
        console.error("Review save error:", err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE REVIEW (User who created it or Admin)
router.delete('/:id/reviews/:reviewId', verifyToken, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const review = movie.reviews.id(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership or admin
        if (review.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You can only delete your own review' });
        }

        movie.reviews.pull({ _id: req.params.reviewId });
        await movie.save();

        res.status(200).json({ message: 'Review removed', reviews: movie.reviews });
    } catch (err) {
        console.error("Review delete error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

