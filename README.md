# License Checker

A modern tool to check and audit open source licenses for your dependencies.

🌐 **[Live Demo](https://licensechecker.xyz)** • 📚 **[API Docs](https://licensechecker.xyz/api)** • 🐛 **[Issues](https://github.com/lmcmz/LicenseChekcer/issues)**

## Features

- 🤖 AI-powered license analysis with web search
- 📦 Multi-language support (Node.js, Python, Go, Rust, Java, Swift, Ruby, PHP)
- 💾 Smart caching for faster queries
- 🎨 Modern UI with dark mode
- 🌐 Internationalization (English & Chinese)
- 🔒 Secure backend API

## Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Start development server
bun run dev
```

Visit `http://localhost:3000`

## API Usage

```bash
# Check from GitHub repo URL
curl "https://licensechecker.xyz/api/check?url=https://github.com/facebook/react"

# Check from file content
curl -X POST https://licensechecker.xyz/api/check \
  -H "Content-Type: application/json" \
  -d '{"content": "..."}'

# Audit parsed dependencies
curl -X POST https://licensechecker.xyz/api/audit \
  -H "Content-Type: application/json" \
  -d '{"dependencies": [{"name": "react", "version": "18.2.0"}]}'
```

See [API Documentation](./API_EXAMPLES.md) for more details.

## Documentation

- [Architecture](./docs/architecture.md) - Technical architecture and stack
- [Setup Guide](./docs/setup.md) - Detailed setup instructions
- [Deployment](./docs/deployment.md) - Deployment guide
- [API Reference](./API_EXAMPLES.md) - Complete API documentation

## Tech Stack

TanStack Router • Vite • Supabase • Gemini AI • Vercel

## License

MIT
