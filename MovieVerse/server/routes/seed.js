const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../models/Movie');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


router.post('/seed', async (req, res) => {
    try {
        const { secret } = req.body;

        if (secret !== process.env.JWT_SECRET) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const movieCount = await Movie.countDocuments();
        if (movieCount > 0) {
            return res.json({
                message: 'Database already seeded',
                movieCount
            });
        }

        const moviesSet = new Map();
        let page = 1;
        const totalMoviesNeeded = 250;

        while (moviesSet.size < totalMoviesNeeded && page <= 15) {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated`, {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: 'en-US',
                    page: page,
                },
            });

            const results = response.data.results;
            if (!results.length) break;

            for (const movie of results) {
                if (moviesSet.size >= totalMoviesNeeded) break;

                try {
                    const detailResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                        params: {
                            api_key: process.env.TMDB_API_KEY,
                            append_to_response: 'credits,videos'
                        }
                    });

                    const details = detailResponse.data;
                    const credits = details.credits;
                    const videos = details.videos;

                    const director = credits.crew.find(person => person.job === 'Director')?.name;
                    const writers = credits.crew.filter(person => person.department === 'Writing').map(p => p.name).slice(0, 3);
                    const cast = credits.cast.slice(0, 6).map(c => ({
                        name: c.name,
                        role: c.character,
                        image: c.profile_path
                    }));

                    const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

                    moviesSet.set(movie.id, {
                        title: details.title,
                        description: details.overview,
                        rating: details.vote_average,
                        releaseDate: details.release_date,
                        duration: details.runtime,
                        tmdbId: details.id,
                        posterPath: details.poster_path,
                        backdropPath: details.backdrop_path,
                        genres: details.genres.map(g => g.name),
                        director: director,
                        writers: writers,
                        cast: cast,
                        trailerKey: trailer ? trailer.key : null
                    });
                } catch (e) {
                    console.error(`Error fetching movie ${movie.id}:`, e.message);
                }
            }
            page++;
        }

        const movies = Array.from(moviesSet.values());

        // Insert movies
        for (const movie of movies) {
            await Movie.findOneAndUpdate(
                { tmdbId: movie.tmdbId },
                movie,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        // Seed Admin
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('adminpassword', salt);
            const adminUser = new User({
                username: 'admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
        }

        res.json({
            message: 'Database seeded successfully!',
            moviesSeeded: movies.length,
            adminCreated: !adminExists
        });

    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({
            message: 'Error seeding database',
            error: error.message
        });
    }
});

module.exports = router;
