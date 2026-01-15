# Deployment Guide

## Vercel Deployment (Recommended)

This project is optimized for Vercel and includes all necessary configuration.

### Prerequisites

- Vercel account ([Sign up](https://vercel.com))
- GitHub repository
- Environment variables ready

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### Step 2: Configure Project

Vercel will auto-detect the settings:

- **Framework Preset**: Vite
- **Build Command**: `bun run build`
- **Output Directory**: `dist`
- **Install Command**: `bun install`

### Step 3: Environment Variables

Add the following environment variables in Vercel dashboard:

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:**
- Variables starting with `VITE_` are available to the frontend
- Other variables (like `GEMINI_API_KEY`) are server-side only

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployment URL

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## Vercel Configuration

The project includes `vercel.json` with optimized settings:

```json
{
  "buildCommand": "bun run build",
  "framework": "vite",
  "installCommand": "bun install",
  "regions": ["sfo1"],
  "functions": {
    "server/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Environment-Specific Settings

### Production

- HTTPS enforced
- Analytics enabled
- Rate limiting active
- Cache optimizations

### Preview (Staging)

- Created for each PR
- Same as production settings
- Useful for testing before merge

### Development

- Local environment
- Hot module replacement
- Debug mode enabled

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify database connection
- [ ] Check rate limiting
- [ ] Test GitHub URL scanning
- [ ] Verify analytics tracking
- [ ] Test internationalization
- [ ] Check mobile responsiveness
- [ ] Test dark/light mode switching

## Monitoring

### Vercel Analytics

Automatically enabled for:
- Page views
- Performance metrics
- Web Vitals (LCP, FID, CLS)
- Custom events

View analytics:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab

### Error Tracking

Monitor errors in:
- Vercel Logs (Project → Logs)
- Supabase Logs (Database queries)
- Browser DevTools (Frontend errors)

## Scaling Considerations

### Rate Limiting

Current limit: **20 requests per minute per IP**

To adjust:
1. Edit `server/middleware/rateLimit.ts`
2. Change `MAX_REQUESTS` or `RATE_LIMIT_WINDOW`
3. Redeploy

### Database Scaling

Supabase auto-scales, but monitor:
- Connection pool usage
- Query performance
- Storage size

Consider:
- Adding indexes for frequent queries
- Implementing pagination for large results
- Archiving old cache entries

### API Performance

Monitor Gemini API usage:
- Check quota limits
- Track response times
- Consider implementing request queuing for high traffic

## Rollback

If a deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "⋯" → "Promote to Production"

## Alternative Deployment Options

### Self-Hosted

Requirements:
- Node.js 18+ or Bun runtime
- Reverse proxy (nginx/Caddy)
- SSL certificate

```bash
# Build
bun run build

# Serve
bun run preview

# Or use a process manager
pm2 start "bun run preview" --name license-checker
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "preview"]
```

Build and run:
```bash
docker build -t license-checker .
docker run -p 3000:3000 --env-file .env license-checker
```

### Other Platforms

The project can deploy to:
- **Netlify** - Configure build command and environment variables
- **Cloudflare Pages** - Compatible with Vite builds
- **Railway** - Auto-detects Bun projects
- **Render** - Configure as a web service

## Security Checklist

- [ ] Environment variables properly set
- [ ] API keys not exposed to frontend
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Supabase RLS policies enabled
- [ ] CSP headers configured
- [ ] Dependencies up to date

## Troubleshooting

### Build Failures

**Error: Cannot find module**
```bash
# Clear cache
vercel --force
```

**Bun not found**
- Ensure `installCommand` is set to `bun install`
- Check Vercel uses correct Node/Bun version

### API Errors in Production

**Gemini API timeout**
- Increase function timeout in `vercel.json`
- Check API key is valid in production

**Database connection failed**
- Verify Supabase URL is correct
- Check service role key is set
- Ensure database is not paused

### Performance Issues

**Slow API responses**
- Monitor Gemini API latency
- Check database query performance
- Review rate limiting logs

**High memory usage**
- Optimize bundle size
- Check for memory leaks
- Review middleware efficiency

## Support

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Project Issues](https://github.com/lmcmz/LicenseChekcer/issues)
