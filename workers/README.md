# Cloudflare Workers Deployment

This directory contains the Cloudflare Worker that handles the API routes for MyMiniShelf.

## Setup

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy the worker:
   ```bash
   cd workers
   wrangler deploy
   ```

4. Update the API URL in your Next.js app:
   - Replace the rewrite URL in `next.config.js` with your actual worker URL
   - Or set an environment variable `NEXT_PUBLIC_API_URL`

## Production Enhancements

For production use, consider:

1. **KV Storage**: Replace in-memory storage with Cloudflare KV for persistence
2. **AI Integration**: Add OpenAI API key for real cover generation
3. **PDF Generation**: Use a PDF generation service or library
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Authentication**: Add user authentication if needed

## Environment Variables

Set these in the Cloudflare Workers dashboard:
- `OPENAI_API_KEY`: For AI cover generation
- Any other API keys needed for your services