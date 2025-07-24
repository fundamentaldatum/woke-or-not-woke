import React, { useState, useEffect } from 'react';
import { PhotoResultProps } from '../../types';
import { TypewriterText, AnalysisText } from '../../components/ui';

// Define a specific type for the mad-lib categories
type MadLibType = 'music' | 'film' | 'tv' | 'fiction' | 'nonfiction' | 'podcast' | 'architecture' | 'art';

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
    return <div className="w-full max-w-xs"><AnalysisText /></div>;
  }
  if (photoStatus === "error" && error) {
    return <div className="text-red-500 font-semibold text-center py-4">Error: {error}</div>;
  }
  if (photoStatus === "done" && !showWhy) {
    return (
      <button
        className={`bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition ${isResultVisible ? 'animate-fade-in animate-heartbeat' : 'opacity-0'}`}
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
          <TypewriterText text="If you " className="inline" typingSpeed={50} onComplete={() => setShowMust(true)} reset={resetDescriptionTyping} />
          {showMust && <TypewriterText text="MUST" className="inline italic" typingSpeed={50} onComplete={() => setShowKnow(true)} reset={resetDescriptionTyping} />}
          {showKnow && <TypewriterText text=" know... " className="inline" typingSpeed={50} onComplete={() => setShowDescriptionTyping(true)} reset={resetDescriptionTyping} />}
          {showDescriptionTyping && description && <TypewriterText text={`${description} Clearly, there's more work to be done. Would you like to know how to "DO THE WORK?"`} className="inline" typingSpeed={30} onComplete={() => setTypingComplete(true)} reset={resetDescriptionTyping} />}
          {showDescriptionTyping && !description && "No description available."}
        </div>
        {typingComplete && <button className={`mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition animate-fade-in animate-heartbeat`} onClick={() => setShowHow(true)}>YES, HOW DO I "DO THE WORK?"</button>}
      </div>
    );
  }
  if (photoStatus === "done" && showWhy && showHow && !showMadLib) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-white text-center py-4 font-semibold amatic-sc-bold text-4xl">
          <TypewriterText text="It's actually not " className="inline" typingSpeed={60} onComplete={() => setShowMy(true)} reset={resetTyping} showCursor={false} />
          {showMy && <TypewriterText text="MY" className="inline font-black text-glow" typingSpeed={60} onComplete={() => setShowJob(true)} reset={resetTyping} showCursor={false} />}
          {showJob && <TypewriterText text={` job to "do the work" for you`} className="inline" typingSpeed={60} onComplete={() => {}} reset={resetTyping} showCursor={true} />}
        </div>
        <button className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition" onClick={() => setShowMadLib(true)}>OK... SO HOW DO I "DO THE WORK?"</button>
      </div>
    );
  }
  if (photoStatus === "done" && showWhy && showHow && showMadLib) {
    if (!madLibData) {
      return <div className="text-white">Loading recommendations...</div>;
    }
    return (
      <div className="text-white text-left py-4 font-semibold w-full max-w-lg space-y-4">
        <div>
          {madLibStep >= 0 && <TypewriterText text="Well, first of all, you should be attending at least one " className="inline" onComplete={() => setMadLibStep(1)} />}
          {madLibStep >= 1 && <b className="inline"><TypewriterText text="Sacrament Meeting" className="inline" onComplete={() => setMadLibStep(2)} /></b>}
          {madLibStep >= 2 && <TypewriterText text=" every week. You can find your local ward / temple at the " className="inline" onComplete={() => setMadLibStep(3)} />}
          {madLibStep >= 3 && <a href="https://www.churchofjesuschrist.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="Church of Latter Day Saints website." className="inline" onComplete={() => setMadLibStep(4)} /></a>}
        </div>

        {madLibStep >= 4 && (
          <div>
            <TypewriterText text="If you’re really interested in “" className="inline" onComplete={() => setMadLibStep(5)} />
            {madLibStep >= 5 && <b className="inline"><TypewriterText text="doing the work" className="inline" onComplete={() => setMadLibStep(6)} /></b>}
            {madLibStep >= 6 && <TypewriterText text=",” you’ll listen to the album " className="inline" onComplete={() => setMadLibStep(7)} />}
            {madLibStep >= 7 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonMusic.title} className="inline" onComplete={() => setMadLibStep(8)} /></b>}
            {madLibStep >= 8 && <TypewriterText text=" by " className="inline" onComplete={() => setMadLibStep(9)} />}
            {madLibStep >= 9 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonMusic.artist} className="inline" onComplete={() => setMadLibStep(10)} /></b>}
            {madLibStep >= 10 && <TypewriterText text=". It was released in " className="inline" onComplete={() => setMadLibStep(11)} />}
            {madLibStep >= 11 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonMusic.year)} className="inline" onComplete={() => setMadLibStep(12)} /></b>}
            {madLibStep >= 12 && <TypewriterText text=" and is just " className="inline" onComplete={() => setMadLibStep(13)} />}
            {madLibStep >= 13 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonMusic.runtime} className="inline" onComplete={() => setMadLibStep(14)} /></b>}
            {madLibStep >= 14 && <TypewriterText text=" long. You can learn more here: " className="inline" onComplete={() => setMadLibStep(15)} />}
            {madLibStep >= 15 && <a href={madLibData.mormonMusic.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(16)} /></a>}
            {madLibStep >= 16 && <TypewriterText text="." className="inline" onComplete={() => setMadLibStep(17)} />}
          </div>
        )}
        
        {/* The rest of the script remains unchanged, but you can apply the same pattern */}
        {madLibStep >= 17 && <div><TypewriterText text={`You’ll also need to watch ${madLibData.mormonFilms.title} (${madLibData.mormonFilms.year}). You can learn more here: `} className="inline" onComplete={() => setMadLibStep(18)} /><a href={madLibData.mormonFilms.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(19)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(19)} /></div>}
        {/* ... and so on ... */}
      </div>
    );
  }

  return null;
};

export default PhotoResult;