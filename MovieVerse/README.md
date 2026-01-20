# MovieVerse

Full-stack MERN application for browsing and managing movies with Role-Based Access Control (RBAC).

## Features
- **User & Admin Roles:** Different access levels for standard users and administrators.
- **Authentication:** Secure JWT-based auth with bcrypt password hashing.
- **Movie Data:** ~250 Top Rated movies fetched from TMDb API.
- **Search & Sort:** Search movies by title/description and sort by various criteria.
- **Admin Dashboard:** Add, Edit, and Delete movies.
- **Responsive UI:** Built with React and Material UI.

## Tech Stack
- **Frontend:** React, Vite, Material UI, Axios, React Router into Context API.
- **Backend:** Node.js, Express, MongoDB, Mongoose.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI
- TMDb API Key

### Installation

1.  **Clone the repository** (if applicable) or navigate to project root.

2.  **Server Setup**
    ```bash
    cd server
    npm install
    # Create .env file with MONGO_URI, JWT_SECRET, PORT, TMDB_API_KEY
    # Run Seed Script
    node scripts/seedMovies.js
    # Start Server
    npm start # or npm run dev
    ```

3.  **Client Setup**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## Admin Credentials
To access the Admin Dashboard use the following credentials (seeded by script):
- **Email:** `admin@gmail.com`
- **Password:** `adminpassword`

## API Documentation

### Public
- `GET /api/movies` - List movies (paginated)
- `GET /api/movies/search?q=...` - Search movies
- `GET /api/movies/sorted?sort=...` - Sort movies (name, rating, duration, releasedate)

### Admin (Requires Bearer Token)
- `POST /api/movies` - Create movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

## Deployment
- **Frontend (Vercel/Netlify):** Build with `npm run build`. Set environment variables if needed.
- **Backend (Render/Railway):** Connect repo, set `build` command to `npm install` and `start` command to `node server.js`. Set environment variables in dashboard.
