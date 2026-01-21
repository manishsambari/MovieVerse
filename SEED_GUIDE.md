# Seeding the Vercel Production Database

## Prerequisites

You need to add one more environment variable to your Vercel project:

**`SEED_SECRET`** - A secret key to protect the seed endpoint (choose any random string, e.g., `my-super-secret-seed-key-12345`)

## Steps to Seed the Database

### 1. Add Environment Variable to Vercel

1. Go to your Vercel Dashboard
2. Select your MovieVerse project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name:** `SEED_SECRET`
   - **Value:** `your-chosen-secret-key` (remember this!)
   - **Environment:** Production (or all environments)
5. Click **Save**

### 2. Deploy the Changes

The seed endpoint has been created at `api/seed.js`. You need to deploy these changes:

```bash
git add .
git commit -m "Add seed endpoint for Vercel"
git push
```

Vercel will automatically deploy the changes.

### 3. Trigger the Seed Endpoint

Once deployed, use a tool like **Postman**, **curl**, or **Thunder Client** to make a POST request:

**Using curl:**
```bash
curl -X POST https://your-vercel-url.vercel.app/api/seed \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-chosen-secret-key"}'
```

**Using Postman:**
- Method: `POST`
- URL: `https://your-vercel-url.vercel.app/api/seed`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "secret": "your-chosen-secret-key"
  }
  ```

### 4. Wait for Completion

The seeding process will:
- Fetch 250 top-rated movies from TMDb
- Populate your MongoDB database
- Create the admin user

This may take 2-5 minutes. You'll get a response like:

```json
{
  "message": "Database seeded successfully!",
  "moviesSeeded": 250,
  "adminCreated": true
}
```

### 5. Verify

Visit your Vercel deployment URL and you should now see all the movies!

## Security Note

After seeding, you can optionally:
1. Remove the `SEED_SECRET` environment variable from Vercel
2. Delete the `api/seed.js` file and redeploy

This prevents anyone from accidentally re-seeding or accessing the endpoint.

## Troubleshooting

**If you get a 403 error:**
- Check that the `secret` in your request matches the `SEED_SECRET` environment variable exactly

**If you get a timeout:**
- Vercel serverless functions have a 10-second timeout on the free plan
- The seed might take longer, so you may need to reduce the number of movies or upgrade your plan
- Alternatively, run the seed script locally against the production database

**To seed locally against production:**
1. Temporarily update `server/.env` with your production `MONGO_URI`
2. Run: `node server/scripts/seedMovies.js`
3. Revert the `.env` file back to local settings
