const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'You are not allowed to do that!' });
    }
};

module.exports = verifyAdmin;
