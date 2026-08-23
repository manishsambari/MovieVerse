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
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
