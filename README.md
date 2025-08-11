# woke-or-not-woke

An interactive web application that allows users to upload photos for AI-powered analysis with a playful, multi-step interface.

**Features**
* **Photo Upload**: Users can upload photos via drag-and-drop or by selecting a file from their device.
* **AI-Powered Image Analysis**: The application uses OpenAI's Vision API to generate a descriptive analysis of the uploaded image.
* **Engaging User Interface**:
    * **Randomized Color Scheme**: The "WOKE" and "NOT WOKE" labels are displayed in randomized colors (red or blue) for a playful touch.
    * **Pixelation Effect**: A pixelation overlay is shown on the image preview while the AI analysis is in progress, providing visual feedback to the user.
    * **Multi-Step Reveal**: The analysis results are revealed in a multi-step process with "WHY IS IT WOKE?" and "HOW DO I 'DO THE WORK?'" buttons to guide the user.
* **Session-Based Tracking**: The application uses a session ID stored in the browser's local storage to track users without requiring them to sign in.
* **Responsive Design**: The layout adapts to different screen sizes for a seamless experience on any device.

---

### 🛠️ Tech Stack

The application is built with a modern, serverless architecture.

**Frontend:**

* **React**: A JavaScript library for building user interfaces.
* **TypeScript**: A typed superset of JavaScript that enhances code quality and maintainability.
* **Vite**: A fast and lightweight build tool for modern web development.
* **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

**Backend:**

* **Convex**: A serverless platform that provides a real-time database, serverless functions, and file storage. The backend logic for handling photo uploads, saving metadata, and triggering the AI analysis is defined in `convex/photos.ts`. The database schema is defined in `convex/schema.ts` and includes tables for photos and various Mormon cultural items like music, films, and TV shows.

**AI:**

* **OpenAI Vision API**: Used for generating the image descriptions. The prompt instructs the AI to act as a visionary art historian who can find hidden connections to Latter-day Saint history in any image.

**Deployment:**

* **Cloudflare Pages**: The application is configured for deployment on Cloudflare Pages.

---

### 🎨 UI/UX Flow

The user interface and experience are designed to be playful and engaging, with a multi-step process for revealing the AI's analysis.

1.  **Photo Upload**: The user is greeted with a drag-and-drop or click-to-upload area for their photo. The interface text prompts the user to upload an image and then click the "IS IT WOKE?" button to begin the analysis.

2.  **Analysis and Visual Feedback**:
    * Once the user uploads a photo and clicks the "IS IT WOKE?" button, the analysis process begins.
    * While the analysis is in progress, a pixelation effect is shown on the image preview, providing visual feedback to the user. The text "Analyzing photo..." is also displayed, cycling through a series of humorous steps like "CONSULTING SCRIPTURE..." and "MUNCHING...".

3.  **Multi-Step Reveal**: The results of the analysis are revealed in a multi-step process, which is designed to be humorous and engaging.
    * First, a button appears that says, "WAIT, WHY IS IT WOKE?".
    * After clicking that, the user is presented with the AI-generated description, followed by another button that says, "YES, HOW DO I 'DO THE WORK?'".
    * Upon clicking this, a "mad-lib" style response is generated, which humorously suggests various Mormon-related media for the user to consume.

4.  **Session Tracking**: The application uses a session ID stored in the browser's local storage to track users without requiring them to sign in. This allows for a seamless, no-login experience.

---

### 🚀 Local Development

To run the application locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Set Up Environment Variables:**
    Create a `.env.local` file in the root of the project and add your Convex deployment URL:
    ```
    VITE_CONVEX_URL=<your_convex_deployment_url>
    ```
3.  **Run the Development Server:**
    This command starts both the frontend (Vite) and backend (Convex) development servers.
    ```bash
    npm run dev
    ```

---

### ☁️ Deployment

The application is configured for deployment on Cloudflare Pages.

**Cloudflare Pages Configuration**

* **Build command**: `npm run build`
* **Build output directory**: `dist`
* **Environment variables**:
    * `VITE_CONVEX_URL=<your_convex_deployment_url>`

**Custom Domains**

The application is deployed to:

* wokeornotwoke.org
* wokeornotwoke.com