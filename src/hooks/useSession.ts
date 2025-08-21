/**
 * Hook for managing user session
 */

import { useState, useEffect } from 'react';
import { getSessionId } from '../lib/sessionUtils';

/**
 * Hook to get and manage the current user session
 * @returns Object containing the session ID
 */
export function useSession() {
  const [sessionId, setSessionId] = useState<string>("");

  // Get session ID on component mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  return { sessionId };
}
