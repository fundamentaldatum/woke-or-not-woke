import React, { useState } from 'react';
import { useSession, usePhotoUpload, usePhotoAnalysis } from '../../hooks';
import { PhotoUpload } from './PhotoUpload';
import { PhotoResult } from './PhotoResult';
import { SpinnerButton } from '../ui';

/**
 * Main component for photo analysis functionality
 * Orchestrates the photo upload, analysis, and result display
 */
const PhotoAnalysis: React.FC = () => {
  const { sessionId } = useSession();
  const [spinning, setSpinning] = useState(false);
  
  // Photo upload state and handlers
  const {
    state,
    fileInputRef,
    updateState,
    handleFileChange,
    handleDrop,
    handleSubmit,
    handleReset
  } = usePhotoUpload(sessionId);
  
  // Photo analysis state
  const { photo } = usePhotoAnalysis(
    state.latestPhotoId,
    sessionId,
    updateState
  );

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-2">
      {/* Image upload area */}
      <PhotoUpload
        previewUrl={state.previewUrl}
        photoStatus={state.photoStatus}
        handleDrop={handleDrop}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
      />

      {/* Spinner/Submit button */}
      <div className="w-full mb-6">
        <SpinnerButton
          spinning={spinning}
          setSpinning={setSpinning}
          onFinalTrue={async () => {
            await handleSubmit();
          }}
          disabled={!state.selectedFile || state.photoStatus === "pending"}
          showResult={state.photoStatus === "done"}
        />
      </div>

      {/* Output/result field */}
      <div className="w-full min-h-[56px] flex flex-col items-center justify-center">
        <PhotoResult
          photoStatus={state.photoStatus}
          error={state.error}
          showWhy={state.showWhy}
          showHow={state.showHow}
          description={photo?.description}
          setShowWhy={(show) => updateState({ showWhy: show })}
          setShowHow={(show) => updateState({ showHow: show })}
        />
      </div>

      {/* Reset button */}
      {state.photoStatus === "done" || state.photoStatus === "error" ? (
        <button
          className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition"
          onClick={handleReset}
        >
          Reset
        </button>
      ) : null}
    </div>
  );
};

export default PhotoAnalysis;
