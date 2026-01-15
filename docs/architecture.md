# Architecture

## Tech Stack

### Frontend
- **TanStack Router** - File-based routing and type-safe navigation
- **React 18** - UI library with hooks and modern features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Lucide React** - Icon library

### Backend
- **Nitro** - Universal server framework for API routes
- **Vercel** - Serverless deployment platform
- **Bun** - Fast JavaScript runtime and package manager

### Database & Services
- **Supabase** - PostgreSQL database with real-time features
- **Gemini AI** - Google's AI for license analysis with web search
- **Vercel Analytics** - Performance and usage monitoring

## Project Structure

```
.
├── server/
│   ├── api/                    # API endpoints
│   │   ├── check.ts            # Smart check endpoint (parse + audit)
│   │   ├── audit.ts            # Audit dependencies
│   │   ├── parse.ts            # Parse dependencies
│   │   └── scan-repo.ts        # Scan GitHub repos
│   └── middleware/
│       └── rateLimit.ts        # Rate limiting middleware
├── src/
│   ├── routes/                 # TanStack Router pages
│   │   ├── __root.tsx          # Root layout
│   │   ├── index.tsx           # Home/Audit page
│   │   ├── guide.tsx           # License guide
│   │   ├── selector.tsx        # License selector
│   │   └── api.tsx             # API documentation
│   ├── components/             # React components
│   │   ├── AuditView.tsx       # Main audit interface
│   │   ├── ResultsView.tsx     # Results display
│   │   ├── Layout.tsx          # App layout
│   │   └── ...
│   ├── services/               # Business logic
│   │   ├── dependencyParser.ts # Parse dependency files
│   │   └── githubScanner.ts    # Scan GitHub repos
│   ├── lib/                    # Utilities
│   ├── i18n.ts                 # Internationalization
│   └── styles.css              # Global styles
├── supabase/
│   └── schema.sql              # Database schema
├── public/
│   ├── openapi.json            # OpenAPI specification
│   ├── logo.svg                # App logo
│   └── favicon.svg             # Favicon
├── docs/                       # Documentation
├── package.json
├── vite.config.ts
├── vercel.json
└── .env.example
```

## Data Flow

### License Check Flow

1. **User Input**
   - URL (repo or file) or raw file content
   - Triggers `/check` endpoint

2. **Smart Parsing**
   - Detect URL type (repo vs file)
   - If repo: scan for dependency files
   - If file: fetch and parse content
   - Extract dependencies

3. **Cache Check**
   - Query Supabase for cached results
   - Match by `package_name` + `package_version`

4. **AI Analysis** (for uncached)
   - Send to Gemini AI with web search
   - AI finds official license info
   - Categorizes risk level (Safe/Caution/High Risk)

5. **Storage**
   - Store results in Supabase
   - Cache for future queries

6. **Response**
   - Return audit results
   - Include cache statistics

### Two-Step Flow (Advanced)

1. **Parse** (`/parse`)
   - Extract dependencies only
   - Return structured list

2. **Audit** (`/audit`)
   - Receive dependency list
   - Follow cache → AI → storage flow

## Database Schema

### `package_licenses` Table

```sql
CREATE TABLE package_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_name TEXT NOT NULL,
  package_version TEXT NOT NULL,
  license_name TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(package_name, package_version)
);
```

**Metadata JSONB includes:**
- `repository`: GitHub repo URL
- `reason`: Risk level explanation
- `sources`: Array of reference URLs
- `isFriendly`: Boolean flag

## Security

### API Key Management
- ✅ Gemini API key stored server-side only
- ✅ Never exposed to frontend
- ✅ Environment variables in Vercel

### Rate Limiting
- ✅ 20 requests per minute per IP
- ✅ In-memory store with auto-cleanup
- ✅ Rate limit headers in responses

### Database Security
- ✅ Supabase Row Level Security (RLS)
- ✅ Service role key for backend only
- ✅ Anonymous key for frontend (read-only)

### HTTPS & CORS
- ✅ HTTPS enforced in production
- ✅ CORS configured for API endpoints
- ✅ Secure headers via Vercel

## Performance

### Caching Strategy
- Database cache for repeated queries
- In-memory rate limit store
- Client-side state management

### Optimization
- Code splitting via Vite
- Tree shaking for unused code
- Image optimization
- CDN via Vercel

### Monitoring
- Vercel Analytics for performance
- Error tracking
- API usage metrics
