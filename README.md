# License Checker

A modern tool to check and manage open source licenses for your dependencies.

## Architecture

This project is built with:
- **TanStack Start** - Full-stack React framework with routing
- **Vite** - Fast build tool and dev server
- **Supabase** - PostgreSQL database and authentication
- **Bun** - Fast JavaScript runtime and package manager
- **Vercel** - Deployment platform
- **Gemini AI** - License analysis with web search capabilities
- **Vercel Analytics** - Performance monitoring

## Features

- 📦 Multi-language dependency support (npm, Python, Go, Rust, Maven, Gradle, Swift)
- 🔍 AI-powered license analysis with web search
- 💾 Database caching for faster repeated queries
- 🎨 Modern UI with dark mode support
- 🌐 Internationalization (English & Chinese)
- 📊 Visual dependency tree and table views
- 🔒 Secure API key management (backend-only)

## Project Structure

```
.
├── api/                    # Backend API routes (Nitro)
│   └── audit-licenses.ts   # License audit endpoint
├── src/
│   ├── routes/             # TanStack Router pages
│   │   ├── __root.tsx      # Root layout
│   │   ├── index.tsx       # Home/Audit page
│   │   ├── guide.tsx       # License guide page
│   │   └── selector.tsx    # License selector page
│   ├── components/         # React components
│   ├── services/           # Business logic
│   ├── lib/                # Utilities
│   ├── i18n.ts             # Internationalization
│   └── styles.css          # Global styles
├── supabase/
│   └── schema.sql          # Database schema
├── package.json
├── vite.config.ts
├── vercel.json
└── .env.example
```

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `GEMINI_API_KEY` - Your Google Gemini API key (server-side only)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key (server-side only)

### 3. Set Up Supabase Database

Run the schema file in your Supabase SQL editor:

```bash
# Or use Supabase CLI
supabase db push
```

The schema creates:
- `package_licenses` table for caching license information
- Indexes for fast lookups
- Row Level Security policies

### 4. Development

Start the development server:

```bash
bun run dev
```

The app will be available at `http://localhost:3000`

### 5. Build

Build for production:

```bash
bun run build
```

## Deployment

This project is optimized for Vercel deployment:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

Vercel will automatically:
- Build the project with Bun
- Deploy API routes as serverless functions
- Set up analytics

## How It Works

1. **User Input**: Users paste their dependency file (package.json, requirements.txt, etc.)
2. **Parsing**: Dependencies are extracted and normalized
3. **Cache Check**: System checks Supabase database for cached results
4. **AI Analysis**: Uncached dependencies are sent to backend API
5. **Gemini Query**: Backend calls Gemini AI with web search enabled
6. **Storage**: Results are stored in Supabase for future queries
7. **Display**: Results are shown with risk levels and recommendations

## Security

- ✅ API keys are stored server-side only
- ✅ Frontend never accesses Gemini directly
- ✅ Supabase RLS policies protect data
- ✅ HTTPS enforced in production

## License

MIT
