# Woke or Not Woke

An interactive web application that allows users to upload photos for AI-powered analysis. The app features a playful interface with "WOKE" and "NOT WOKE" labels (with randomized colors) and a multi-step reveal process.

## Tech Stack

- Frontend: React with TypeScript, using Vite as the build tool
- Backend: Convex for serverless backend functions and database
- Storage: Convex Storage for image files
- AI: OpenAI's Vision API for image description generation
- Session Management: Browser localStorage for maintaining user sessions

## Development

To run the application locally:

```bash
# Install dependencies
npm install

# Start the development server (frontend + backend)
npm run dev
```

## Deployment

This application is deployed to Cloudflare Pages with the following configuration:

### Cloudflare Pages Configuration

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment variables**:
  - `VITE_CONVEX_URL`: The URL for the Convex deployment

### Custom Domains

The application is deployed to:
- wokeornotwoke.org
- wokeornotwoke.com

### Deployment Process

1. Push changes to the GitHub repository
2. Cloudflare Pages automatically builds and deploys the application
3. The application connects to the Convex backend (deployment: fast-grasshopper-579)

## Features

- Photo upload via drag-and-drop or file selection
- Image analysis using OpenAI's Vision API
- Playful UI with randomized color scheme for "WOKE" and "NOT WOKE" labels
- Multi-step reveal process with "WHY IS IT WOKE?" and "HOW DO I 'DO THE WORK?'" buttons
- Pixelation effect during image analysis
- Session-based user tracking without requiring sign-in
