import React, { useState, useEffect } from 'react';
import { PhotoResultProps } from '../../types';
import { TypewriterText } from '../../components/ui';

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
  // State for managing animations
  const [typingComplete, setTypingComplete] = useState(false);
  const [resetTyping, setResetTyping] = useState(false);
  const [resetDescriptionTyping, setResetDescriptionTyping] = useState(false);
  const [showDescriptionTyping, setShowDescriptionTyping] = useState(false);

  // State for sequential typing of the "MY job" sentence
  const [showMy, setShowMy] = useState(false);
  const [showJob, setShowJob] = useState(false);

  // State for sequential typing of the "If you MUST know" sentence
  const [showMust, setShowMust] = useState(false);
  const [showKnow, setShowKnow] = useState(false);


  // Reset typing state when "WHY IS IT WOKE?" is clicked
  useEffect(() => {
    setTypingComplete(false);
    setResetTyping(prev => !prev);
    setShowMy(false);
    setShowJob(false);
  }, [showWhy]);

  // Reset typing state when "HOW DO I 'DO THE WORK?'" is clicked
  useEffect(() => {
    if (showHow) {
      setResetDescriptionTyping(prev => !prev);
      setShowMust(false);
      setShowKnow(false);
      setShowDescriptionTyping(false);
    }
  }, [showHow]);

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
        <div className="text-white text-center py-4 font-semibold amatic-sc-bold text-4xl">
          {showWhy && (
            <>
              <TypewriterText
                text="It's actually not "
                className="inline"
                typingSpeed={60}
                onComplete={() => setShowMy(true)}
                reset={resetTyping}
                showCursor={false}
              />
              {showMy && (
                <TypewriterText
                  text="MY"
                  className="inline font-black text-glow"
                  typingSpeed={60}
                  onComplete={() => setShowJob(true)}
                  reset={resetTyping}
                  showCursor={false}
                />
              )}
              {showJob && (
                <TypewriterText
                  text=" job to 'do the work' for you"
                  className="inline"
                  typingSpeed={60}
                  onComplete={() => setTypingComplete(true)}
                  reset={resetTyping}
                  showCursor={true}
                />
              )}
            </>
          )}
        </div>
        {typingComplete && (
          <button
            className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
            onClick={() => setShowHow(true)}
          >
            HOW DO I "DO THE WORK?"
          </button>
        )}
      </div>
    );
  }

  if (photoStatus === "done" && showWhy && showHow) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-white text-center py-4 font-semibold">
          <TypewriterText
            text="If you "
            className="inline"
            typingSpeed={50}
            onComplete={() => setShowMust(true)}
            reset={resetDescriptionTyping}
          />
          {showMust && (
            <TypewriterText
              text="MUST"
              className="inline italic"
              typingSpeed={50}
              onComplete={() => setShowKnow(true)}
              reset={resetDescriptionTyping}
            />
          )}
          {showKnow && (
            <TypewriterText
              text=" know... "
              className="inline"
              typingSpeed={50}
              onComplete={() => setShowDescriptionTyping(true)}
              reset={resetDescriptionTyping}
            />
          )}
          {showDescriptionTyping && description && (
            <TypewriterText
              text={description}
              className="inline"
              typingSpeed={30}
              onComplete={() => {}}
              reset={resetDescriptionTyping}
            />
          )}
          {showDescriptionTyping && !description && "No description available."}
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