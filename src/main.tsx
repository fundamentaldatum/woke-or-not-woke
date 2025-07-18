import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";

/**
 * Initialize Convex client with the URL from environment variables
 */
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

/**
 * Render the application with Convex provider
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>,
);
