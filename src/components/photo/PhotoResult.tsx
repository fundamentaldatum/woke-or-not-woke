import React, { useState, useEffect } from 'react';
import { PhotoResultProps } from '../../types';
import { TypewriterText, AnalysisText } from '../../components/ui';

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
  setShowMadLib,
  isResultVisible,
  madLibData,
  showMadLib,
}) => {
  const [typingComplete, setTypingComplete] = useState(false);
  const [resetTyping, setResetTyping] = useState(false);
  const [resetDescriptionTyping, setResetDescriptionTyping] = useState(false);
  
  const [showMy, setShowMy] = useState(false);
  const [showJob, setShowJob] = useState(false);
  const [showMust, setShowMust] = useState(false);
  const [showKnow, setShowKnow] = useState(false);
  const [showDescriptionTyping, setShowDescriptionTyping] = useState(false);

  // State for mad-lib animation steps
  const [madLibStep, setMadLibStep] = useState(0);

  useEffect(() => {
    setTypingComplete(false);
    setResetDescriptionTyping(prev => !prev);
    setShowMust(false);
    setShowKnow(false);
    setShowDescriptionTyping(false); 
  }, [showWhy]);

  useEffect(() => {
    if (showHow) {
      setResetTyping(prev => !prev);
      setShowMy(false); 
      setShowJob(false);
    }
  }, [showHow]);

  useEffect(() => {
    if (showMadLib) {
      setMadLibStep(0);
    }
  }, [showMadLib]);

  if (photoStatus === "pending") {
    return (
      <div className="w-full max-w-xs">
        <AnalysisText />
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
        className={`bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition ${
          isResultVisible ? 'animate-fade-in animate-heartbeat' : 'opacity-0'
        }`}
        onClick={() => setShowWhy(true)}
      >
        WAIT, WHY IS IT WOKE?
      </button>
    );
  }

  if (photoStatus === "done" && showWhy && !showHow) {
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
              text={`${description} Clearly, there's more work to be done. Would you like to know how to "DO THE WORK?"`}
              className="inline"
              typingSpeed={30}
              onComplete={() => setTypingComplete(true)}
              reset={resetDescriptionTyping}
            />
          )}
          {showDescriptionTyping && !description && "No description available."}
        </div>
        {typingComplete && (
          <button
            className={`mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition animate-fade-in animate-heartbeat`}
            onClick={() => setShowHow(true)}
          >
            YES, HOW DO I "DO THE WORK?"
          </button>
        )}
      </div>
    );
  }

  if (photoStatus === "done" && showWhy && showHow && !showMadLib) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-white text-center py-4 font-semibold amatic-sc-bold text-4xl">
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
              text={` job to "do the work" for you`}
              className="inline"
              typingSpeed={60}
              onComplete={() => {}}
              reset={resetTyping}
              showCursor={true}
            />
          )}
        </div>
        <button
          className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
          onClick={() => setShowMadLib(true)}
        >
          OK... SO HOW DO I "DO THE WORK?"
        </button>
      </div>
    );
  }

  if (photoStatus === "done" && showWhy && showHow && showMadLib) {
    if (!madLibData) {
      return <div className="text-white">Loading recommendations...</div>;
    }
    return (
      <div className="text-white text-left py-4 font-semibold w-full">
        {madLibStep >= 0 && (
          <TypewriterText
            text="Well, first of all, you should be attending at least one "
            onComplete={() => setMadLibStep(1)}
          />
        )}
        {madLibStep >= 1 && (
          <>
            <b>Sacrament Meeting</b>
            <TypewriterText text=" every week. You can find your local ward / temple at the " onComplete={() => setMadLibStep(2)} />
          </>
        )}
        {madLibStep >= 2 && (
          <>
            <a href="https://www.churchofjesuschrist.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Church of Latter Day Saints website</a>
            <TypewriterText text="." onComplete={() => setMadLibStep(3)} />
          </>
        )}
        {madLibStep >= 3 && (
          <>
            <br />
            <TypewriterText text={`If you’re really interested in “doing the work,” you’ll listen to ${madLibData.mormonMusic.TITLE} by ${madLibData.mormonMusic.ARTIST}.`} onComplete={() => setMadLibStep(4)} />
          </>
        )}
        {madLibStep >= 4 && (
          <>
            <br />
            <TypewriterText text={`You’ll also need to watch ${madLibData.mormonFilms.TITLE}.`} onComplete={() => setMadLibStep(5)} />
          </>
        )}
        {madLibStep >= 5 && (
          <>
            <br />
            <TypewriterText text={`This is not enough to successfully “do the work.” You should watch at least one season of ${madLibData.mormonTVShows.TITLE}.`} onComplete={() => setMadLibStep(6)} />
          </>
        )}
        {madLibStep >= 6 && (
          <>
            <br />
            <TypewriterText text={`At this point, your work remains incomplete. Enjoy some lighter material as you reflect on your depravity. Read ${madLibData.mormonFiction.TITLE} by ${madLibData.mormonFiction.AUTHOR}.`} onComplete={() => setMadLibStep(7)} />
          </>
        )}
        {madLibStep >= 7 && (
          <>
            <br />
            <TypewriterText text={`Enough of this. It is time to take your “work” seriously. Read ${madLibData.mormonNonFiction.TITLE} by ${madLibData.mormonNonFiction.AUTHOR}.`} onComplete={() => setMadLibStep(8)} />
          </>
        )}
        {madLibStep >= 8 && (
          <>
            <br />
            <TypewriterText text={`Before your next `} onComplete={() => setMadLibStep(9)} />
          </>
        )}
        {madLibStep >= 9 && (
          <>
            <b>Sacrament Meeting</b>
            <TypewriterText text={`, make sure to subscribe and listen to at least a couple episodes of ${madLibData.mormonPodcasts.TITLE}.`} onComplete={() => setMadLibStep(10)} />
          </>
        )}
        {madLibStep >= 10 && (
          <>
            <br />
            <TypewriterText text={`If, at this point, you are still willing to “do the work,” you’ll visit ${madLibData.mormonArchitecture.TITLE}. There, you will find penance. Your work shall be complete. But not before you genuflect before ${madLibData.mormonVisualArt.TITLE} by ${madLibData.mormonVisualArt.ARTIST}.`} onComplete={() => setMadLibStep(11)} />
          </>
        )}
        {madLibStep >= 11 && (
          <>
            <br />
            <TypewriterText text={`Then, `} onComplete={() => setMadLibStep(12)} />
          </>
        )}
        {madLibStep >= 12 && (
          <>
            <b>and only then</b>
            <TypewriterText text={`, your “work” is complete. You have successfully rid yourself of woke-ness. Never watch television ever again.`} onComplete={() => setMadLibStep(13)} />
          </>
        )}
      </div>
    );
  }

  return null;
};

export default PhotoResult;