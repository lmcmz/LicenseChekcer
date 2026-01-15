import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  const origin = event.node?.req?.headers?.origin;

  // Allow requests from localhost and the production domain
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://license-chekcer.vercel.app',
  ];

  if (origin && allowedOrigins.includes(origin)) {
    if (event.node?.res) {
      event.node.res.setHeader('Access-Control-Allow-Origin', origin);
      event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      event.node.res.setHeader('Access-Control-Max-Age', '86400');
    }
  }

  // Handle preflight requests
  if (event.method === 'OPTIONS') {
    if (event.node?.res) {
      event.node.res.statusCode = 204;
      event.node.res.end();
    }
    return;
  }
});
