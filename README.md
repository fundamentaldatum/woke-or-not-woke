Woke or Not Woke
"Woke or Not Woke" is an interactive web application that allows users to upload photos for AI-powered analysis. The application is built with a modern tech stack, featuring a React-based frontend and a Convex serverless backend. The user experience is designed to be playful and engaging, with a multi-step reveal process for the analysis results.

Features
Photo Upload: Users can upload photos via drag-and-drop or by selecting a file from their device.

AI-Powered Image Analysis: The application uses OpenAI's Vision API to generate a descriptive analysis of the uploaded image.

Engaging User Interface:

Randomized Color Scheme: The "WOKE" and "NOT WOKE" labels are displayed in randomized colors (red or blue) for a playful touch.

Pixelation Effect: A pixelation overlay is shown on the image preview while the AI analysis is in progress, providing visual feedback to the user.

Multi-Step Reveal: The analysis results are revealed in a multi-step process, with "WHY IS IT WOKE?" and "HOW DO I 'DO THE WORK?'" buttons to guide the user through the experience.

Session-Based Tracking: The application uses a session ID stored in the browser's local storage to track users without requiring them to sign in, providing a seamless and anonymous user experience.

Responsive Design: The application is designed with a responsive layout that adapts to different screen sizes.

Tech Stack
Frontend:

React: A JavaScript library for building user interfaces.

TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.

Vite: A fast and lightweight build tool for modern web development.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Backend:

Convex: A serverless platform that provides a real-time database, serverless functions, and file storage.

AI:

OpenAI Vision API: Used for generating the image descriptions.

Local Development
To run the application locally, follow these steps:

Install Dependencies:

Bash

npm install
Set Up Environment Variables:
Create a .env.local file in the root of the project and add the following environment variable:

VITE_CONVEX_URL=<your_convex_deployment_url>
Run the Development Server:
This command will start both the frontend (Vite) and backend (Convex) development servers.

Bash

npm run dev
Deployment
The application is configured for deployment on Cloudflare Pages.

Cloudflare Pages Configuration
Build command: npm run build

Build output directory: dist

Environment variables:

VITE_CONVEX_URL: The URL for the Convex deployment.

Custom Domains
The application is deployed to:

wokeornotwoke.org

wokeornotwoke.com
