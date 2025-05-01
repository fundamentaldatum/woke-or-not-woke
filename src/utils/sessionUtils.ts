/**
 * Session management utilities for the no-sign-in experience
 */

import { STORAGE_KEYS } from '../constants';

/**
 * Generate a random session ID
 * @returns A unique session identifier
 */
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Get the current session ID from localStorage or create a new one
 * @returns The current session ID
 */
export function getSessionId(): string {
  let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  
  // If no session ID exists, create one and store it
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }
  
  return sessionId;
}
