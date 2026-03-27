const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedMovies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        const moviesSet = new Map();
        let page = 1;
        const totalMoviesNeeded = 250;

        while (moviesSet.size < totalMoviesNeeded) {
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
                    process.stdout.write(`.`);
                } catch (e) {
                    console.error(`Error fetching details for movie ${movie.id}:`, e.message);
                }
            }
            page++;
        }

        const movies = Array.from(moviesSet.values());

        // Upsert movies to ensure images are added to existing ones
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
            console.log('Admin user seeded (admin@gmail.com / adminpassword)');
        }

        console.log(`\nSuccessfully seeded ${movies.length} movies!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedMovies();
