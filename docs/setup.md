# Setup Guide

## Prerequisites

- **Bun** (v1.0+) - [Install Bun](https://bun.sh)
- **Node.js** (v18+) - Optional, Bun is preferred
- **Supabase Account** - [Sign up](https://supabase.com)
- **Gemini API Key** - [Get API Key](https://aistudio.google.com/app/apikey)

## Step 1: Clone Repository

```bash
git clone https://github.com/lmcmz/LicenseChekcer.git
cd LicenseChekcer
```

## Step 2: Install Dependencies

```bash
bun install
```

## Step 3: Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in the following variables:

### Required Variables

```env
# Gemini AI (server-side only)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### How to Get Keys

**Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**Supabase Keys:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing
3. Go to Project Settings → API
4. Copy:
   - `URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Database Setup

### Option A: Using Supabase Dashboard

1. Open your Supabase project
2. Go to SQL Editor
3. Copy content from `supabase/schema.sql`
4. Paste and run in SQL Editor

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push schema
supabase db push
```

### Verify Setup

Check that the `package_licenses` table was created:

```sql
SELECT * FROM package_licenses LIMIT 1;
```

## Step 5: Development

Start the development server:

```bash
bun run dev
```

The app will be available at:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3000/api`

### Available Scripts

```bash
bun run dev      # Start dev server
bun run build    # Build for production
bun run preview  # Preview production build
bun run test     # Run tests
bun run lint     # Lint code
```

## Step 6: Testing

### Test API Endpoints

**Check endpoint:**
```bash
curl "http://localhost:3000/api/check?url=https://github.com/facebook/react"
```

**Audit endpoint:**
```bash
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"dependencies": [{"name": "react", "version": "18.2.0"}]}'
```

### Test Frontend

1. Open `http://localhost:3000`
2. Paste a package.json or GitHub URL
3. Click "Audit"
4. Check results display

## Troubleshooting

### Port Already in Use

If port 3000 is taken, Vite will automatically try 3001, 3002, etc.

### Supabase Connection Error

- Verify `VITE_SUPABASE_URL` is correct
- Check that database is running
- Ensure RLS policies are set up

### Gemini API Error

- Verify `GEMINI_API_KEY` is valid
- Check API quota limits
- Ensure billing is enabled on Google Cloud

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .vercel
bun install
```

## Next Steps

- [Deployment Guide](./deployment.md) - Deploy to production
- [Architecture](./architecture.md) - Learn about the tech stack
- [API Reference](../API_EXAMPLES.md) - Explore the API
