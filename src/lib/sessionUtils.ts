/**
 * Session management utilities for the no-sign-in experience
 */

// Generate a random session ID
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Get the current session ID from localStorage or create a new one
export function getSessionId(): string {
  const storageKey = 'woke_or_not_woke_session_id';
  let sessionId = localStorage.getItem(storageKey);
  
  // If no session ID exists, create one and store it
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}
