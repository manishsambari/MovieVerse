const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../models/Movie');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const CURATED_MOVIES = [
    {
        title: "Inception",
        description: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
        rating: 8.8,
        releaseDate: "2010-07-16",
        duration: 148,
        tmdbId: 27205,
        posterPath: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        backdropPath: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
        genres: ["Action", "Sci-Fi", "Adventure"],
        director: "Christopher Nolan",
        writers: ["Christopher Nolan"],
        cast: [
            { name: "Leonardo DiCaprio", role: "Dom Cobb", image: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
            { name: "Joseph Gordon-Levitt", role: "Arthur", image: "/4p387mEbaY8x8yUq5Vq0p7v6n5F.jpg" },
            { name: "Elliot Page", role: "Ariadne", image: "/eCeFgzvf9w45ipq0f6vQ5FfM6wX.jpg" },
            { name: "Tom Hardy", role: "Eames", image: "/d8duY24gW1qT59H7DugW2m4RvyP.jpg" }
        ],
        trailerKey: "YoHD9XEInc0"
    },
    {
        title: "The Dark Knight",
        description: "Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
        rating: 9.0,
        releaseDate: "2008-07-18",
        duration: 152,
        tmdbId: 155,
        posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdropPath: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
        genres: ["Action", "Crime", "Drama"],
        director: "Christopher Nolan",
        writers: ["Jonathan Nolan", "Christopher Nolan"],
        cast: [
            { name: "Christian Bale", role: "Bruce Wayne / Batman", image: "/b7fTC9WFkgqGOv77mLQ0uv5jNqe.jpg" },
            { name: "Heath Ledger", role: "Joker", image: "/5Y9HnYYa9jF4NuY9l0GW75Z9fZv.jpg" },
            { name: "Michael Caine", role: "Alfred Pennyworth", image: "/klTx9g6c2M49r0BqE78fV8E9yqE.jpg" }
        ],
        trailerKey: "EXeTwQWrcwY"
    },
    {
        title: "Interstellar",
        description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        rating: 8.7,
        releaseDate: "2014-11-05",
        duration: 169,
        tmdbId: 157336,
        posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdropPath: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        director: "Christopher Nolan",
        writers: ["Jonathan Nolan", "Christopher Nolan"],
        cast: [
            { name: "Matthew McConaughey", role: "Cooper", image: "/sY2wa52skqJ1X1o1931L61X6l88.jpg" },
            { name: "Anne Hathaway", role: "Brand", image: "/tLpq5970y0N618J83m7N8q1e8q8.jpg" },
            { name: "Jessica Chastain", role: "Murph", image: "/nkNk3c4g9L77L88eN7eL8y99e7q.jpg" }
        ],
        trailerKey: "zSWdZVtXT7E"
    },
    {
        title: "Pulp Fiction",
        description: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
        rating: 8.9,
        releaseDate: "1994-09-10",
        duration: 154,
        tmdbId: 680,
        posterPath: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        backdropPath: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
        genres: ["Crime", "Drama"],
        director: "Quentin Tarantino",
        writers: ["Quentin Tarantino", "Roger Avary"],
        cast: [
            { name: "John Travolta", role: "Vincent Vega", image: "/9H50X9K1z7n51u8V2z47nN0aQ6B.jpg" },
            { name: "Samuel L. Jackson", role: "Jules Winnfield", image: "/mXN4Gw9q8hQx6B8W4e578a1v6q8.jpg" },
            { name: "Uma Thurman", role: "Mia Wallace", image: "/956fL9q9yq8wXN4B6v578a1v6q8.jpg" }
        ],
        trailerKey: "s7EdQ4FqbhY"
    },
    {
        title: "The Shawshank Redemption",
        description: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unshakeable sense of hope.",
        rating: 9.3,
        releaseDate: "1994-09-23",
        duration: 142,
        tmdbId: 278,
        posterPath: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
        backdropPath: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
        genres: ["Drama", "Crime"],
        director: "Frank Darabont",
        writers: ["Stephen King", "Frank Darabont"],
        cast: [
            { name: "Tim Robbins", role: "Andy Dufresne", image: "/i1P9L88yq8wXN4B6v578a1v6q8.jpg" },
            { name: "Morgan Freeman", role: "Ellis Boyd 'Red' Redding", image: "/oGJQ5Ig3794h61W7b8q8e1v6q8.jpg" }
        ],
        trailerKey: "PLl99DlL6b4"
    },
    {
        title: "Spirited Away",
        description: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
        rating: 8.6,
        releaseDate: "2001-07-20",
        duration: 125,
        tmdbId: 129,
        posterPath: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
        backdropPath: "/Ab8mkHmkYADjU7wQiOkia99GQI.jpg",
        genres: ["Animation", "Family", "Fantasy"],
        director: "Hayao Miyazaki",
        writers: ["Hayao Miyazaki"],
        cast: [
            { name: "Rumi Hiiragi", role: "Chihiro Ogino (voice)", image: "/bB987e9y8q8wXN4B6v578a1v6q8.jpg" },
            { name: "Miyu Irino", role: "Haku (voice)", image: "/c87e9y8q8wXN4B6v578a1v6q8.jpg" }
        ],
        trailerKey: "ByXuk9QqQkk"
    },
    {
        title: "Avengers: Endgame",
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        rating: 8.3,
        releaseDate: "2019-04-24",
        duration: 181,
        tmdbId: 299534,
        posterPath: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        backdropPath: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        genres: ["Action", "Adventure", "Sci-Fi"],
        director: "Anthony Russo, Joe Russo",
        writers: ["Christopher Markus", "Stephen McFeely"],
        cast: [
            { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man", image: "/1YjdSym1jTG7xjHSI0yGGWEswQw.jpg" },
            { name: "Chris Evans", role: "Steve Rogers / Captain America", image: "/3bOGNsHlrswhyW799IumuGFagnh.jpg" },
            { name: "Mark Ruffalo", role: "Bruce Banner / Hulk", image: "/5qHNjhtjMD4YWH3ag0SC3vN9NxJ.jpg" }
        ],
        trailerKey: "TcMBFSGVi1c"
    },
    {
        title: "Spider-Man: Into the Spider-Verse",
        description: "Miles Morales is juggling his life between being a high school student and being a spider-man. When Wilson 'Kingpin' Fisk uses a super collider, others from across the Spider-Verse are transported to this dimension.",
        rating: 8.4,
        releaseDate: "2018-12-06",
        duration: 117,
        tmdbId: 324857,
        posterPath: "/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
        backdropPath: "/7d6EZ0rNZu49Jpw7qMr4px9qBHg.jpg",
        genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
        director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
        writers: ["Phil Lord", "Rodney Rothman"],
        cast: [
            { name: "Shameik Moore", role: "Miles Morales (voice)", image: "/v313BwazP44GegFm74zN76Cuh4k.jpg" },
            { name: "Jake Johnson", role: "Peter B. Parker (voice)", image: "/66Vw6e7kH79a7N1b47nN0aQ6B.jpg" }
        ],
        trailerKey: "tg52up16eq0"
    },
    {
        title: "Parasite",
        description: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
        rating: 8.5,
        releaseDate: "2019-05-30",
        duration: 132,
        tmdbId: 496243,
        posterPath: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        backdropPath: "/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
        genres: ["Drama", "Thriller", "Comedy"],
        director: "Bong Joon-ho",
        writers: ["Bong Joon-ho", "Han Jin-won"],
        cast: [
            { name: "Song Kang-ho", role: "Kim Ki-taek", image: "/41gJvTq7t9a7N1b47nN0aQ6B.jpg" },
            { name: "Lee Sun-kyun", role: "Park Dong-ik", image: "/51gJvTq7t9a7N1b47nN0aQ6B.jpg" }
        ],
        trailerKey: "5xH0R_uxnM8"
    },
    {
        title: "The Matrix",
        description: "Set in the 22nd century, The Matrix tells the story of a computer hacker who learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        rating: 8.7,
        releaseDate: "1999-03-30",
        duration: 136,
        tmdbId: 603,
        posterPath: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        backdropPath: "/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg",
        genres: ["Action", "Sci-Fi"],
        director: "Lana Wachowski, Lilly Wachowski",
        writers: ["Lana Wachowski", "Lilly Wachowski"],
        cast: [
            { name: "Keanu Reeves", role: "Neo", image: "/4D0PpNI0kmP58hgrwGC3wC5x0Vy.jpg" },
            { name: "Laurence Fishburne", role: "Morpheus", image: "/mh0VsjWz8A7gA9b47nN0aQ6B.jpg" },
            { name: "Carrie-Anne Moss", role: "Trinity", image: "/8a0VsjWz8A7gA9b47nN0aQ6B.jpg" }
        ],
        trailerKey: "vKQi3bBA1y8"
    },
    {
        title: "Fight Club",
        description: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
        rating: 8.8,
        releaseDate: "1999-10-15",
        duration: 139,
        tmdbId: 550,
        posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdropPath: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
        genres: ["Drama", "Thriller"],
        director: "David Fincher",
        writers: ["Chuck Palahniuk", "Jim Uhls"],
        cast: [
            { name: "Brad Pitt", role: "Tyler Durden", image: "/cckcYc2v0yh1tc9Qgr15N5L6FfG.jpg" },
            { name: "Edward Norton", role: "The Narrator", image: "/eIkFqvB295G78wXN4B6v578a1v6q8.jpg" }
        ],
        trailerKey: "qtRKdVHc-cE"
    },
    {
        title: "GoodFellas",
        description: "The story of Henry Hill and his life in the mafia, covering his relationship with his wife Karen and his mob partners Jimmy Conway and Tommy DeVito.",
        rating: 8.7,
        releaseDate: "1990-09-12",
        duration: 145,
        tmdbId: 769,
        posterPath: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
        backdropPath: "/sw7mordbZxgITU877hTpZOGUBNV.jpg",
        genres: ["Drama", "Crime"],
        director: "Martin Scorsese",
        writers: ["Nicholas Pileggi", "Martin Scorsese"],
        cast: [
            { name: "Robert De Niro", role: "James Conway", image: "/cT8htcck9Vn51u8V2z47nN0aQ6B.jpg" },
            { name: "Ray Liotta", role: "Henry Hill", image: "/dT8htcck9Vn51u8V2z47nN0aQ6B.jpg" },
            { name: "Joe Pesci", role: "Tommy DeVito", image: "/eT8htcck9Vn51u8V2z47nN0aQ6B.jpg" }
        ],
        trailerKey: "2ilzidi_J8Q"
    }
];

const seedAdminUser = async () => {
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
        return true;
    }
    return false;
};

// GET or POST /api/seed - Seeds database with TMDb or Curated Movies
const handleSeed = async (req, res) => {
    try {
        const movieCount = await Movie.countDocuments();
        const force = req.query.force === 'true' || req.body?.force === true;

        if (movieCount > 0 && !force) {
            await seedAdminUser();
            return res.status(200).json({
                message: 'Database already has movies!',
                movieCount,
                adminStatus: 'Admin account (admin@gmail.com) ready'
            });
        }

        let moviesToInsert = [];

        // If TMDb API key is configured, fetch live top-rated movies
        if (process.env.TMDB_API_KEY) {
            try {
                const moviesSet = new Map();
                let page = 1;
                const totalMoviesNeeded = 100;

                while (moviesSet.size < totalMoviesNeeded && page <= 6) {
                    const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
                        params: {
                            api_key: process.env.TMDB_API_KEY,
                            language: 'en-US',
                            page: page,
                        },
                        timeout: 8000
                    });

                    const results = response.data.results || [];
                    if (!results.length) break;

                    for (const movie of results) {
                        if (moviesSet.size >= totalMoviesNeeded) break;

                        try {
                            const detailResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                                params: {
                                    api_key: process.env.TMDB_API_KEY,
                                    append_to_response: 'credits,videos'
                                },
                                timeout: 5000
                            });

                            const details = detailResponse.data;
                            const credits = details.credits || { crew: [], cast: [] };
                            const videos = details.videos || { results: [] };

                            const director = credits.crew.find(person => person.job === 'Director')?.name || 'N/A';
                            const writers = credits.crew.filter(person => person.department === 'Writing').map(p => p.name).slice(0, 3);
                            const cast = (credits.cast || []).slice(0, 6).map(c => ({
                                name: c.name,
                                role: c.character,
                                image: c.profile_path
                            }));

                            const trailer = (videos.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');

                            moviesSet.set(movie.id, {
                                title: details.title,
                                description: details.overview,
                                rating: details.vote_average,
                                releaseDate: details.release_date,
                                duration: details.runtime || 120,
                                tmdbId: details.id,
                                posterPath: details.poster_path,
                                backdropPath: details.backdrop_path,
                                genres: (details.genres || []).map(g => g.name),
                                director: director,
                                writers: writers,
                                cast: cast,
                                trailerKey: trailer ? trailer.key : null
                            });
                        } catch {
                            // Continue on single movie error
                        }
                    }
                    page++;
                }

                moviesToInsert = Array.from(moviesSet.values());
            } catch (err) {
                console.warn('TMDb live fetch failed, falling back to curated list:', err.message);
                moviesToInsert = CURATED_MOVIES;
            }
        }

        // If no TMDb key or TMDb fetch was empty, use high quality curated list
        if (!moviesToInsert.length) {
            moviesToInsert = CURATED_MOVIES;
        }

        // Upsert movies
        for (const movie of moviesToInsert) {
            await Movie.findOneAndUpdate(
                { title: movie.title },
                movie,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        // Ensure Admin user
        const adminCreated = await seedAdminUser();
        const totalNow = await Movie.countDocuments();

        return res.status(200).json({
            message: 'Database seeded successfully!',
            moviesSeeded: moviesToInsert.length,
            totalMoviesInDb: totalNow,
            adminCreated,
            adminCredentials: {
                email: 'admin@gmail.com',
                password: 'adminpassword'
            }
        });
    } catch (error) {
        console.error('Seed error:', error);
        return res.status(500).json({
            message: 'Error seeding database',
            error: error.message
        });
    }
};

router.post('/seed', handleSeed);
router.get('/seed', handleSeed);

module.exports = router;
