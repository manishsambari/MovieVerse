const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('common'));

// Routes
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/upload', require('./routes/upload'));

// Static Serve for Images
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
