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
        type: String,
    },
    duration: {
        type: Number,
    },
    tmdbId: {
        type: Number,
        unique: true,
    },
    posterPath: {
        type: String,
    },
    backdropPath: {
        type: String,
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
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
