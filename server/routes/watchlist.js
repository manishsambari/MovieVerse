const router = require('express').Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('watchlist')
            .select('watchlist');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.watchlist);
    } catch (err) {
        console.error('Get watchlist error:', err);
        res.status(500).json({ message: 'Error fetching watchlist' });
    }
});

router.post('/:movieId', verifyToken, async (req, res) => {
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

        res.status(200).json({ message: 'Movie added to watchlist', watchlist: user.watchlist });
    } catch (err) {
        console.error('Add to watchlist error:', err);
        res.status(500).json({ message: 'Error adding to watchlist' });
    }
});

router.delete('/:movieId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.watchlist = user.watchlist.filter(
            id => id.toString() !== req.params.movieId
        );
        await user.save();

        res.status(200).json({ message: 'Movie removed from watchlist', watchlist: user.watchlist });
    } catch (err) {
        console.error('Remove from watchlist error:', err);
        res.status(500).json({ message: 'Error removing from watchlist' });
    }
});

module.exports = router;
