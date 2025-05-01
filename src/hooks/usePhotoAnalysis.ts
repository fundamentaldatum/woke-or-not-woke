/**
 * Hook for managing photo analysis state
 */

import { useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { PhotoState } from '../types';

/**
 * Hook to manage photo analysis state and updates
 * @param photoId The ID of the photo being analyzed
 * @param sessionId The current user session ID
 * @param updateState Function to update the photo state
 * @returns Object containing the photo data and analysis state
 */
export function usePhotoAnalysis(
  photoId: Id<"photos"> | null,
  sessionId: string,
  updateState: (newState: Partial<PhotoState>) => void
) {
  // Query the photo data
  const photo = useQuery(
    api.photos.get,
    photoId && sessionId ? { photoId, sessionId } : "skip"
  );

  // Use a ref to track the previous photo status
  const prevStatusRef = useRef<string | undefined>(undefined);
  
  // Watch for photo status updates
  useEffect(() => {
    if (!photo) return;
    
    // Only update state if the status has actually changed
    if (prevStatusRef.current !== photo.status) {
      prevStatusRef.current = photo.status;
      
      if (photo.status === "pending") {
        updateState({
          photoStatus: "pending",
        });
      } else if (photo.status === "done") {
        updateState({
          photoStatus: "done",
        });
      } else if (photo.status === "error") {
        updateState({
          photoStatus: "error",
          error: photo.error || "Something went wrong.",
        });
      }
    }
  }, [photo, updateState]);

  return { photo };
}
