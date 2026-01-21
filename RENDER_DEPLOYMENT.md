# Deploy MovieVerse - Render (Backend) + Vercel (Frontend)

This guide walks you through deploying the MovieVerse application with:
- **Backend API** on Render (better for long-running processes, no timeout issues)
- **Frontend** on Vercel (optimized for React/Vite apps)

---

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy deployment)

### Step 2: Create a New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the **MovieVerse** repository
4. Configure the service:

   **Settings:**
   - **Name:** `movieverse-backend` (or any name you prefer)
   - **Region:** Choose closest to your users
   - **Branch:** `Movieverse` (or your main branch)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free (or paid for better performance)

### Step 3: Set Environment Variables

In the Render dashboard, scroll down to **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |
| `TMDB_API_KEY` | Your TMDb API key |
| `PORT` | `5000` (or leave blank, Render auto-assigns) |

> [!IMPORTANT]
> Make sure your MongoDB allows connections from anywhere (0.0.0.0/0) or add Render's IP addresses to your MongoDB whitelist.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your backend
3. Wait for deployment to complete (check logs for any errors)
4. Once deployed, you'll get a URL like: `https://movieverse-backend.onrender.com`

### Step 5: Seed the Database

After deployment, you need to populate the database with movies:

**Option A: Using Render Shell (Recommended)**

1. In Render dashboard, go to your service
2. Click **"Shell"** tab
3. Run the seed script:
   ```bash
   cd /opt/render/project/src
   node scripts/seedMovies.js
   ```

**Option B: Using Local Script**

1. Temporarily update `server/.env` with production `MONGO_URI`
2. Run locally: `node server/scripts/seedMovies.js`
3. Revert `.env` back to local settings

### Step 6: Test the API

Visit your Render URL with `/api/movies?limit=5`:
```
https://movieverse-backend.onrender.com/api/movies?limit=5
```

You should see JSON data with movies!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update API Base URL

You need to configure the frontend to use your Render backend URL instead of relative paths.

**Create environment variable file:**

Create `client/.env.production`:

```env
VITE_API_URL=https://movieverse-backend.onrender.com
```

**Update axios configuration:**

We'll create an axios instance with the base URL.

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Step 3: Set Environment Variables

In Vercel project settings → Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://movieverse-backend.onrender.com` |

### Step 4: Deploy

Click **"Deploy"** and wait for Vercel to build your frontend.

---

## Part 3: Enable CORS on Backend

Your Render backend needs to allow requests from your Vercel frontend.

The backend already has CORS enabled with `app.use(cors())`, which allows all origins. For production, you might want to restrict this to your Vercel domain.

---

## Testing the Full Stack

1. **Visit your Vercel URL** (e.g., `https://movieverse.vercel.app`)
2. **Check if movies load** - you should see all categories populated
3. **Test login** with admin credentials:
   - Email: `admin@gmail.com`
   - Password: `adminpassword`
4. **Test admin features** - add/edit/delete movies

---

## Troubleshooting

### Movies not showing on frontend

**Check browser console:**
- Open DevTools (F12) → Console tab
- Look for CORS errors or API connection errors

**Verify API URL:**
- Check that `VITE_API_URL` is set correctly in Vercel
- Ensure the URL doesn't have a trailing slash

**Test API directly:**
```bash
curl https://movieverse-backend.onrender.com/api/movies?limit=5
```

### Render backend not starting

**Check Render logs:**
- Go to Render dashboard → Your service → Logs
- Look for MongoDB connection errors
- Verify environment variables are set correctly

### CORS errors

If you see CORS errors, update `server/server.js`:

```javascript
app.use(cors({
    origin: ['https://your-vercel-url.vercel.app', 'http://localhost:5173']
}));
```

---

## Cost Considerations

- **Render Free Tier:** Backend will spin down after 15 minutes of inactivity (cold starts)
- **Vercel Free Tier:** Generous limits for frontend hosting
- **MongoDB Atlas:** Free tier (512MB) should be sufficient for this app

For better performance, consider upgrading Render to a paid plan ($7/month) to avoid cold starts.

---

## Next Steps

After successful deployment:
1. ✅ Test all features thoroughly
2. ✅ Set up custom domain (optional)
3. ✅ Configure production CORS properly
4. ✅ Monitor logs for errors
5. ✅ Consider adding analytics

Your MovieVerse app is now live! 🎉
