const router = require('express').Router();
const User = require('../models/User');
const verify = require('../middleware/verify');

// GET user's watchlist
router.get('/watchlist', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.watchlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ADD movie to watchlist
router.post('/watchlist/:movieId', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.watchlist.includes(req.params.movieId)) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }

        user.watchlist.push(req.params.movieId);
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('watchlist');
        res.status(200).json(updatedUser.watchlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// REMOVE movie from watchlist
router.delete('/watchlist/:movieId', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.watchlist = user.watchlist.filter(
            (id) => id.toString() !== req.params.movieId
        );
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('watchlist');
        res.status(200).json(updatedUser.watchlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
