const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    rating: {
        type: Number,
    },
    releaseDate: {
        type: String, // Storing as string or Date depending on TMDb format, string is often easier for display if no calcs needed
    },
    duration: {
        type: Number, // in minutes
    },
    tmdbId: {
        type: Number,
        unique: true,
    },
    posterPath: {
        type: String, // /path/to/image.jpg
    },
    backdropPath: {
        type: String, // /path/to/backdrop.jpg
    },
    genres: [{
        type: String,
    }],
    director: {
        type: String,
    },
    writers: [{
        type: String,
    }],
    cast: [{
        name: String,
        role: String,
        image: String,
    }],
    trailerKey: {
        type: String, // YouTube Video Key
    },
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
