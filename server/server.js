const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('bufferCommands', false);

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const seedRoutes = require('./routes/seed');
const watchlistRoutes = require('./routes/watchlist');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_READY_STATE = 1;

const getDatabaseStatus = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };

    return states[mongoose.connection.readyState] || 'unknown';
};

const requireDatabaseConnection = (req, res, next) => {
    if (mongoose.connection.readyState === DB_READY_STATE) {
        return next();
    }

    return res.status(503).json({
        message: 'Database unavailable. Please try again in a moment.',
        databaseStatus: getDatabaseStatus(),
    });
};

const validateEnvironment = () => {
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }
};

const startServer = async () => {
    validateEnvironment();

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    });

    return app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('MongoDB Connected');
    });
};

// middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('common'));

app.get('/', (req, res) => {
    const isHealthy = mongoose.connection.readyState === DB_READY_STATE;
    res.status(200).json({
        name: 'MovieVerse API',
        version: '1.0.0',
        status: isHealthy ? 'online' : 'connecting',
        database: getDatabaseStatus(),
        endpoints: {
            health: '/api/health',
            movies: '/api/movies',
            search: '/api/movies/search?q=...',
            auth: '/api/auth',
            watchlist: '/api/watchlist',
        }
    });
});

app.get('/api/health', (req, res) => {
    const databaseStatus = getDatabaseStatus();
    const isHealthy = mongoose.connection.readyState === DB_READY_STATE;

    res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'ok' : 'degraded',
        databaseStatus,
    });
});

// routes
app.use('/api/auth', requireDatabaseConnection, authRoutes);
app.use('/api/movies', requireDatabaseConnection, movieRoutes);
app.use('/api/users', requireDatabaseConnection, userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', requireDatabaseConnection, seedRoutes);
app.use('/api/watchlist', requireDatabaseConnection, watchlistRoutes);

// static for Images
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

if (require.main === module) {
    startServer().catch((err) => {
        console.error('Server startup failed:', err);
        process.exit(1);
    });
}

module.exports = app;
module.exports.startServer = startServer;
