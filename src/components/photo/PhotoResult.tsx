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

        {madLibStep >= 4 && <div><TypewriterText text={`If you’re really interested in “doing the work,” you’ll listen to the album ${madLibData.mormonMusic.title} by ${madLibData.mormonMusic.artist}. It was released in ${madLibData.mormonMusic.year} and is just ${madLibData.mormonMusic.runtime} long. You can learn more here: `} className="inline" onComplete={() => setMadLibStep(5)} /><a href={madLibData.mormonMusic.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(6)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(6)} /></div>}
        {madLibStep >= 6 && <div><TypewriterText text={`You’ll also need to watch ${madLibData.mormonFilms.title} (${madLibData.mormonFilms.year}). You can learn more here: `} className="inline" onComplete={() => setMadLibStep(7)} /><a href={madLibData.mormonFilms.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(8)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(8)} /></div>}
        {madLibStep >= 8 && <div><TypewriterText text={`This is not enough to successfully “do the work.” You should watch at least one season of ${madLibData.mormonTVShows.title} on ${madLibData.mormonTVShows.network}. Learn more: `} className="inline" onComplete={() => setMadLibStep(9)} /><a href={madLibData.mormonTVShows.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(10)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(10)} /></div>}
        {madLibStep >= 10 && <div><TypewriterText text={`At this point, your work remains incomplete. Enjoy some lighter material as you reflect on your depravity. Read ${madLibData.mormonFiction.title} by ${madLibData.mormonFiction.author}. It's ${madLibData.mormonFiction.pageCount} pages long. Find out more: `} className="inline" onComplete={() => setMadLibStep(11)} /><a href={madLibData.mormonFiction.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(12)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(12)} /></div>}
        {madLibStep >= 12 && <div><TypewriterText text={`Enough of this. It is time to take your “work” seriously. Read ${madLibData.mormonNonFiction.title} by ${madLibData.mormonNonFiction.author}. Learn more about this ${madLibData.mormonNonFiction.pageCount}-page book here: `} className="inline" onComplete={() => setMadLibStep(13)} /><a href={madLibData.mormonNonFiction.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(14)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(14)} /></div>}
        {madLibStep >= 14 && <div><TypewriterText text="Before your next " className="inline" onComplete={() => setMadLibStep(15)} /></div>}
        {madLibStep >= 15 && <div><b className="inline"><TypewriterText text="Sacrament Meeting" className="inline" onComplete={() => setMadLibStep(16)} /></b><TypewriterText text={`, make sure to subscribe and listen to at least a couple episodes of ${madLibData.mormonPodcasts.title}. Find it here: `} className="inline" onComplete={() => setMadLibStep(17)} /><a href={madLibData.mormonPodcasts.podcastLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(18)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(18)} /></div>}
        {madLibStep >= 18 && <div><TypewriterText text={`If, at this point, you are still willing to “do the work,” you’ll visit the ${madLibData.mormonArchitecture.title}. Learn more about it: `} className="inline" onComplete={() => setMadLibStep(19)} /><a href={madLibData.mormonArchitecture.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(20)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(20)} /></div>}
        {madLibStep >= 20 && <div><TypewriterText text={`There, you will find penance. Your work shall be complete. But not before you genuflect before ${madLibData.mormonVisualArt.title} by ${madLibData.mormonVisualArt.artist}. See it here: `} className="inline" onComplete={() => setMadLibStep(21)} /><a href={madLibData.mormonVisualArt.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="link" className="inline" onComplete={() => setMadLibStep(22)} /></a><TypewriterText text="." className="inline" onComplete={() => setMadLibStep(22)} /></div>}
        {madLibStep >= 22 && <div><TypewriterText text="Then, " className="inline" onComplete={() => setMadLibStep(23)} /></div>}
        {madLibStep >= 23 && <div><b className="inline"><TypewriterText text="and only then" className="inline" onComplete={() => setMadLibStep(24)} /></b><TypewriterText text=", your “work” is complete. You have successfully rid yourself of woke-ness. Never watch television ever again." className="inline" onComplete={() => setMadLibStep(25)} /></div>}
      </div>
    );
  }

  return null;
};

export default PhotoResult;