woke-or-not-woke 👽
An interactive web application that allows users to upload photos for AI-powered analysis with a playful, multi-step interface.

✨ Features
📸 Photo Upload: Users can upload photos via drag-and-drop or by selecting a file from their device.

🧠 AI-Powered Image Analysis: The application uses OpenAI's Vision API to generate a descriptive analysis of the uploaded image.

🎨 Engaging User Interface:

Randomized Color Scheme: The "WOKE" and "NOT WOKE" labels are displayed in randomized colors (red or blue) for a playful touch.

Pixelation Effect: A pixelation overlay is shown on the image preview while the AI analysis is in progress, providing visual feedback to the user.

Multi-Step Reveal: The analysis results are revealed in a multi-step process with "WHY IS IT WOKE?" and "HOW DO I 'DO THE WORK?'" buttons to guide the user.

🤫 Session-Based Tracking: The application uses a session ID stored in the browser's local storage to track users without requiring them to sign in.

📱 Responsive Design: The layout adapts to different screen sizes for a seamless experience on any device.

🛠️ Tech Stack
Frontend:

React: A JavaScript library for building user interfaces.

TypeScript: A typed superset of JavaScript.

Vite: A fast and lightweight build tool for modern web development.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Backend:

Convex: A serverless platform that provides a real-time database, serverless functions, and file storage.

AI:

OpenAI Vision API: Used for generating image descriptions.

🚀 Local Development
To run the application locally, follow these steps:

Install Dependencies:

Bash

npm install
Set Up Environment Variables:
Create a .env.local file in the root of the project and add your Convex deployment URL:

VITE_CONVEX_URL=<your_convex_deployment_url>
Run the Development Server:
This command starts both the frontend (Vite) and backend (Convex) development servers.

Bash

npm run dev
☁️ Deployment
The application is configured for deployment on Cloudflare Pages.

Cloudflare Pages Configuration
Build command: npm run build

Build output directory: dist

Environment variables:

VITE_CONVEX_URL=<your_convex_deployment_url>
Custom Domains
The application is deployed to:

wokeornotwoke.org

wokeornotwoke.com