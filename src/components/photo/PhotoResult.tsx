import React from 'react';
import { PhotoResultProps } from '../../types';

/**
 * Component for displaying photo analysis results
 * Handles different states: pending, error, and multi-step reveal process
 */
export const PhotoResult: React.FC<PhotoResultProps> = ({
  photoStatus,
  error,
  showWhy,
  showHow,
  description,
  setShowWhy,
  setShowHow,
}) => {
  if (photoStatus === "pending") {
    return (
      <div className="text-yellow-400 font-semibold text-center py-4">
        Analyzing photo...
      </div>
    );
  }
  
  if (photoStatus === "error" && error) {
    return (
      <div className="text-red-500 font-semibold text-center py-4">
        Error: {error}
      </div>
    );
  }
  
  if (photoStatus === "done" && !showWhy) {
    return (
      <button
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
        onClick={() => setShowWhy(true)}
      >
        WHY IS IT WOKE?
      </button>
    );
  }
  
  if (photoStatus === "done" && showWhy && !showHow) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-white text-center py-4 font-semibold">
          It's actually not MY job to "do the work" for you
        </div>
        <button
          className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
          onClick={() => setShowHow(true)}
        >
          HOW DO I "DO THE WORK?"
        </button>
      </div>
    );
  }
  
  if (photoStatus === "done" && showWhy && showHow) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-white text-center py-4 font-semibold">
          {description ? description : "No description available."}
        </div>
        <button
          className="mt-2 bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          disabled
        >
          HOW DO I "DO THE WORK?"
        </button>
      </div>
    );
  }
  
  return null;
};

export default PhotoResult;
