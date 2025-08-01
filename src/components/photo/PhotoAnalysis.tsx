import React, { useState, useCallback, useEffect } from 'react';
import { useSession, usePhotoUpload, usePhotoAnalysis } from '../../hooks';
import { PhotoUpload } from './PhotoUpload';
import { PhotoResult } from './PhotoResult';
import { SpinnerButton } from '../ui';
import TestButton from '../ui/TestButton';
import { createBlankWhiteImage } from '../../lib/utils';
import { COLORS } from '../../constants';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

/**
 * Main component for photo analysis functionality
 * Orchestrates the photo upload, analysis, and result display
 */
const PhotoAnalysis: React.FC = () => {
  const { sessionId } = useSession();
  const [spinning, setSpinning] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [wokeColor, setWokeColor] = useState(COLORS.RED);
  const [showResetButton, setShowResetButton] = useState(false);
  
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

  // Fetch mad-lib data
  const madLibData = useQuery(api.photos.getMadLibData);

  // When a new image is submitted, hide the result button
  const handleCustomSubmit = async () => {
    setIsResultVisible(false);
    setShowResetButton(false);
    await handleSubmit();
  };
  
  // Show the reset button when the mad-lib flow is complete
  const handleFlowComplete = useCallback(() => {
    setShowResetButton(true);
  }, []);
  
  const handleCustomReset = () => {
    handleReset();
    setIsResultVisible(false);
    setShowResetButton(false);
  };

  useEffect(() => {
    if (spinning) {
      // Set the random color for this session when spinning starts
      setWokeColor(Math.random() < 0.5 ? COLORS.RED : COLORS.BLUE);
    }
  }, [spinning]);

  useEffect(() => {
    if (state.photoStatus === "done" || state.photoStatus === "error") {
      setSpinning(false);
      if (state.photoStatus === "error") {
        setShowResetButton(true);
      }
    }
  }, [state.photoStatus]);
  
  const handleSetShowWhy = useCallback((show: boolean) => {
    updateState({ showWhy: show });
  }, [updateState]);
  
  const handleSetShowHow = useCallback((show: boolean) => {
    updateState({ showHow: show });
  }, [updateState]);

  const handleSetShowMadLib = useCallback((show: boolean) => {
    updateState({ showMadLib: show });
  }, [updateState]);

  const { photo } = usePhotoAnalysis(
    state.latestPhotoId,
    sessionId,
    updateState
  );
  
  const handleTestButtonClick = useCallback(async () => {
    try {
      const blankImage = await createBlankWhiteImage();
      
      updateState({
        selectedFile: blankImage,
        previewUrl: URL.createObjectURL(blankImage),
        photoStatus: "idle",
        error: "",
        showWhy: false,
        showHow: false,
        latestPhotoId: null
      });
      setIsResultVisible(false);
      setShowResetButton(false);
    } catch (err: any) {
      console.error("Error creating test image:", err);
      updateState({ error: "Failed to create test image" });
    }
  }, [updateState]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-2">
      <PhotoUpload
        previewUrl={state.previewUrl}
        photoStatus={state.photoStatus}
        handleDrop={handleDrop}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        wokeColor={wokeColor}
      />

      <div className="w-full mb-6">
        <SpinnerButton
          spinning={spinning}
          setSpinning={setSpinning}
          onFinalTrue={handleCustomSubmit}
          disabled={!state.selectedFile || state.photoStatus === "pending"}
          showResult={state.photoStatus === "done"}
          onAnimationComplete={() => setIsResultVisible(true)}
          wokeColor={wokeColor}
        />
      </div>

      <div className="w-full min-h-[56px] flex flex-col items-center justify-center">
        <PhotoResult
          photoStatus={state.photoStatus}
          error={state.error}
          showWhy={state.showWhy}
          showHow={state.showHow}
          description={photo?.description}
          setShowWhy={handleSetShowWhy}
          setShowHow={handleSetShowHow}
          setShowMadLib={handleSetShowMadLib}
          isResultVisible={isResultVisible}
          madLibData={madLibData}
          showMadLib={state.showMadLib}
          onFlowComplete={handleFlowComplete}
        />
      </div>

      {showResetButton && (
        <button
          className="mt-4 mb-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition"
          onClick={handleCustomReset}
        >
          CARE TO DO MORE WORK?
        </button>
      )}
      
      {/* <TestButton onClick={handleTestButtonClick} /> */}
    </div>
  );
};

export default PhotoAnalysis;