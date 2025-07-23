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

  const renderMadLibEntry = (data: any, type: MadLibType) => {
    if (!data) {
      return <div className="my-2 p-2 border border-gray-600 rounded text-gray-400">Loading entry...</div>;
    }

    const title = data.title || 'N/A';
    const artist = data.artist || data.author || data.network || 'N/A';
    const genre = data.genre || 'N/A';
    const runtime = data.runtime || data.pageCount || data.constructionCost || 'N/A';
    const link = data.wikipediaLink || data.podcastLink || '#';

    let details = ` (${genre}`;
    if (runtime !== 'N/A' && runtime) details += `, ${runtime}`;
    details += `)`;
    
    // Use a Record to explicitly type the keys of the typeSteps object
    const typeSteps: Record<MadLibType, { title: number; details: number }> = {
      'music': { title: 5, details: 6 },
      'film': { title: 8, details: 9 },
      'tv': { title: 11, details: 12 },
      'fiction': { title: 14, details: 15 },
      'nonfiction': { title: 17, details: 18 },
      'podcast': { title: 20, details: 21 },
      'architecture': { title: 23, details: 24 },
      'art': { title: 26, details: 27 }
    };

    return (
      <div className="my-2 p-2 border border-gray-600 rounded">
        <TypewriterText text={title} onComplete={() => setMadLibStep(typeSteps[type].title)} />
        {madLibStep >= typeSteps[type].title && (
          <div className="text-sm text-gray-400">
            <TypewriterText text={`${artist} ${details} - `} onComplete={() => setMadLibStep(typeSteps[type].details)} />
            {madLibStep >= typeSteps[type].details && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                Learn More
              </a>
            )}
          </div>
        )}
      </div>
    );
  };
  
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
        {madLibStep >= 0 && <span><TypewriterText text="Well, first of all, you should be attending at least one " onComplete={() => setMadLibStep(1)} /></span>}
        {madLibStep >= 1 && <span><b>Sacrament Meeting</b><TypewriterText text=" every week. You can find your local ward / temple at the " onComplete={() => setMadLibStep(2)} /></span>}
        {madLibStep >= 2 && <span><a href="https://www.churchofjesuschrist.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Church of Latter Day Saints website</a><TypewriterText text="." onComplete={() => setMadLibStep(3)} /></span>}
        
        {madLibStep >= 3 && <div className="mt-4"><TypewriterText text="If you’re really interested in “doing the work,” you’ll listen to:" onComplete={() => setMadLibStep(4)} /></div>}
        {madLibStep >= 4 && renderMadLibEntry(madLibData.mormonMusic, 'music')}

        {madLibStep >= 6 && <div className="mt-4"><TypewriterText text="You’ll also need to watch:" onComplete={() => setMadLibStep(7)} /></div>}
        {madLibStep >= 7 && renderMadLibEntry(madLibData.mormonFilms, 'film')}

        {madLibStep >= 9 && <div className="mt-4"><TypewriterText text="This is not enough to successfully “do the work.” You should watch at least one season of:" onComplete={() => setMadLibStep(10)} /></div>}
        {madLibStep >= 10 && renderMadLibEntry(madLibData.mormonTVShows, 'tv')}

        {madLibStep >= 12 && <div className="mt-4"><TypewriterText text="At this point, your work remains incomplete. Enjoy some lighter material as you reflect on your depravity. Read:" onComplete={() => setMadLibStep(13)} /></div>}
        {madLibStep >= 13 && renderMadLibEntry(madLibData.mormonFiction, 'fiction')}

        {madLibStep >= 15 && <div className="mt-4"><TypewriterText text="Enough of this. It is time to take your “work” seriously. Read:" onComplete={() => setMadLibStep(16)} /></div>}
        {madLibStep >= 16 && renderMadLibEntry(madLibData.mormonNonFiction, 'nonfiction')}

        {madLibStep >= 18 && <div className="mt-4"><span><TypewriterText text="Before your next " onComplete={() => setMadLibStep(19)} /></span></div>}
        {madLibStep >= 19 && <span><b>Sacrament Meeting</b><TypewriterText text={`, make sure to subscribe and listen to at least a couple episodes of:`} onComplete={() => setMadLibStep(20)} /></span>}
        {madLibStep >= 20 && renderMadLibEntry(madLibData.mormonPodcasts, 'podcast')}
        
        {madLibStep >= 22 && <div className="mt-4"><TypewriterText text="If, at this point, you are still willing to “do the work,” you’ll visit:" onComplete={() => setMadLibStep(23)} /></div>}
        {madLibStep >= 23 && renderMadLibEntry(madLibData.mormonArchitecture, 'architecture')}

        {madLibStep >= 25 && <div className="mt-4"><TypewriterText text="There, you will find penance. Your work shall be complete. But not before you genuflect before:" onComplete={() => setMadLibStep(26)} /></div>}
        {madLibStep >= 26 && renderMadLibEntry(madLibData.mormonVisualArt, 'art')}

        {madLibStep >= 28 && <div className="mt-4"><span><TypewriterText text="Then, " onComplete={() => setMadLibStep(29)} /></span></div>}
        {madLibStep >= 29 && <span><b>and only then</b><TypewriterText text={`, your “work” is complete. You have successfully rid yourself of woke-ness. Never watch television ever again.`} onComplete={() => setMadLibStep(30)} /></span>}
      </div>
    );
  }

  return null;
};

export default PhotoResult;