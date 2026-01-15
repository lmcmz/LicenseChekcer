# License Checker API

Base URL: `https://license-chekcer.vercel.app/api`

## Main Endpoints

### `/check` - Parse and audit (one step)

**From URL (supports repo or file URL):**
```bash
# GitHub repo URL (scans for dependency files)
curl "https://license-chekcer.vercel.app/api/check?url=https://github.com/facebook/react"

# Direct file URL
curl "https://license-chekcer.vercel.app/api/check?url=https://raw.githubusercontent.com/facebook/react/main/package.json"

# GitHub blob URL (auto-converts to raw URL)
curl "https://license-chekcer.vercel.app/api/check?url=https://github.com/facebook/react/blob/main/package.json"
```

**From file content:**
```bash
curl -X POST https://license-chekcer.vercel.app/api/check \
  -H "Content-Type: application/json" \
  -d '{
    "content": "{\"dependencies\": {\"react\": \"^18.2.0\"}}"
  }'
```

### `/audit` - Audit dependencies

Audit parsed dependencies for license compliance.

```bash
curl -X POST https://license-chekcer.vercel.app/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "dependencies": [
      { "name": "react", "version": "18.2.0" },
      { "name": "vue", "version": "3.3.4" }
    ]
  }'
```

### `/parse` - Extract dependencies

**From URL:**
```bash
curl "https://license-chekcer.vercel.app/api/parse?url=https://raw.githubusercontent.com/facebook/react/main/package.json"
```

**From file content:**
```bash
curl -X POST https://license-chekcer.vercel.app/api/parse \
  -H "Content-Type: application/json" \
  -d '{
    "content": "{\"dependencies\": {\"react\": \"^18.2.0\"}}"
  }'
```

## Response Format

```json
{
  "success": true,
  "data": [
    {
      "name": "react",
      "version": "18.2.0",
      "license": "MIT",
      "repository": "https://github.com/facebook/react",
      "riskLevel": "Safe",
      "reason": "MIT is a permissive license",
      "isFriendly": true,
      "sources": ["https://github.com/facebook/react/blob/main/LICENSE"]
    }
  ],
  "cached": false,
  "cachedCount": 0,
  "newCount": 1
}
```

## Supported File Types

Node.js • Python • Go • Rust • Java • Swift • Ruby • PHP

## Rate Limits

- **20 requests per minute** per IP address
- Rate limit headers included in response:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Timestamp when limit resets
- When exceeded: `429 Too Many Requests` with `Retry-After` header

## Documentation

Interactive docs: [license-chekcer.vercel.app/api](https://license-chekcer.vercel.app/api)

Support: [github.com/lmcmz/LicenseChekcer/issues](https://github.com/lmcmz/LicenseChekcer/issues)
