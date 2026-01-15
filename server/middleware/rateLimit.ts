import { defineEventHandler, getRequestIP } from 'h3';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20; // 20 requests per minute

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export default defineEventHandler((event) => {
  // Skip rate limiting for non-API routes
  if (!event.path.startsWith('/api/')) {
    return;
  }

  // Skip rate limiting for certain endpoints (health checks, etc.)
  if (event.path === '/api/health') {
    return;
  }

  const ip = getRequestIP(event) || 'unknown';
  const now = Date.now();

  let entry = rateLimitStore.get(ip);

  // Create or reset entry if expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW,
    };
    rateLimitStore.set(ip, entry);
  }

  entry.count++;

  // Set rate limit headers
  const remaining = Math.max(0, MAX_REQUESTS - entry.count);
  const resetIn = Math.ceil((entry.resetAt - now) / 1000);

  event.node.res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
  event.node.res.setHeader('X-RateLimit-Remaining', remaining.toString());
  event.node.res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000).toString());

  // Check if rate limit exceeded
  if (entry.count > MAX_REQUESTS) {
    event.node.res.setHeader('Retry-After', resetIn.toString());
    event.node.res.statusCode = 429;
    event.node.res.end(
      JSON.stringify({
        success: false,
        error: `Rate limit exceeded. Please try again in ${resetIn} seconds.`,
      })
    );
    return;
  }
});
