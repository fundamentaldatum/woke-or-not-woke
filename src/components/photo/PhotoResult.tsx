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

        {madLibStep >= 4 && (
          <div>
            <TypewriterText text="If you’re really interested in " className="inline" onComplete={() => setMadLibStep(5)} />
            {madLibStep >= 5 && <b className="inline"><TypewriterText text="“doing the work,”" className="inline" onComplete={() => setMadLibStep(6)} /></b>}
            {madLibStep >= 6 && <TypewriterText text=" you’ll listen to the album " className="inline" onComplete={() => setMadLibStep(7)} />}
            {madLibStep >= 7 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonMusic.title} className="inline" onComplete={() => setMadLibStep(8)} /></b>}
            {madLibStep >= 8 && <TypewriterText text=" by " className="inline" onComplete={() => setMadLibStep(9)} />}
            {madLibStep >= 9 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonMusic.artist} className="inline" onComplete={() => setMadLibStep(10)} /></b>}
            {madLibStep >= 10 && <TypewriterText text=". It was released in " className="inline" onComplete={() => setMadLibStep(11)} />}
            {madLibStep >= 11 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonMusic.year)} className="inline" onComplete={() => setMadLibStep(12)} /></b>}
            {madLibStep >= 12 && <TypewriterText text=" and is just " className="inline" onComplete={() => setMadLibStep(13)} />}
            {madLibStep >= 13 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonMusic.runtime} className="inline" onComplete={() => setMadLibStep(14)} /></b>}
            {madLibStep >= 14 && <TypewriterText text=" long. You can learn more here " className="inline" onComplete={() => setMadLibStep(15)} />}
            {madLibStep >= 15 && <a href={madLibData.mormonMusic.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(16)} /></a>}
          </div>
        )}

        {madLibStep >= 16 && (
          <div>
            <TypewriterText text="You’ll also need to watch the classic film " className="inline" onComplete={() => setMadLibStep(17)} />
            {madLibStep >= 17 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFilms.title} className="inline" onComplete={() => setMadLibStep(18)} /></b>}
            {madLibStep >= 18 && <TypewriterText text=". This edgy, controversial film received a boundary-pushing MPAA rating of " className="inline" onComplete={() => setMadLibStep(19)} />}
            {madLibStep >= 19 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFilms.mpaaRating} className="inline" onComplete={() => setMadLibStep(20)} /></b>}
            {madLibStep >= 20 && <TypewriterText text=". Released in " className="inline" onComplete={() => setMadLibStep(21)} />}
            {madLibStep >= 21 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonFilms.year)} className="inline" onComplete={() => setMadLibStep(22)} /></b>}
            {madLibStep >= 22 && <TypewriterText text=" and coming in at just " className="inline" onComplete={() => setMadLibStep(23)} />}
            {madLibStep >= 23 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFilms.runtime} className="inline" onComplete={() => setMadLibStep(24)} /></b>}
            {madLibStep >= 24 && <TypewriterText text=", this is a critical part of your sanctification. You can learn more " className="inline" onComplete={() => setMadLibStep(25)} />}
            {madLibStep >= 25 && <a href={madLibData.mormonFilms.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(26)} /></a>}
          </div>
        )}

        {madLibStep >= 26 && <div><TypewriterText text="This is not enough to sufficiently " className="inline" onComplete={() => setMadLibStep(27)} /></div>}
        {madLibStep >= 27 && <b className="inline"><TypewriterText text="“do the work.”" className="inline" onComplete={() => setMadLibStep(28)} /></b>}
        {madLibStep >= 28 && <TypewriterText text=" You should watch at least one season of " className="inline" onComplete={() => setMadLibStep(29)} />}
        {madLibStep >= 29 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonTVShows.title} className="inline" onComplete={() => setMadLibStep(30)} /></b>}
        {madLibStep >= 30 && <TypewriterText text={`. This ${madLibData.mormonTVShows.initialYearAired} ${madLibData.mormonTVShows.genre} series produced and broadcast by the legendary ${madLibData.mormonTVShows.network} is rightfully considered a seminal televisual work. You can learn more here `} className="inline" onComplete={() => setMadLibStep(31)} />}
        {madLibStep >= 31 && <a href={madLibData.mormonTVShows.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(32)} /></a>}
        
        {madLibStep >= 32 && <div><TypewriterText text={`At this point, your work remains incomplete. Enjoy some lighter fare as you reflect on your depravity. Read ${madLibData.mormonFiction.title} by ${madLibData.mormonFiction.author}. First published in ${madLibData.mormonFiction.yearReleased}, ${madLibData.mormonFiction.title} is ${madLibData.mormonFiction.pageCount} pages of pure excitement. You can learn more here `} className="inline" onComplete={() => setMadLibStep(33)} /><a href={madLibData.mormonFiction.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(34)} /></a></div>}
        
        {madLibStep >= 34 && <div><TypewriterText text={`Enough of this. It is time to take your “work” seriously. Read ${madLibData.mormonNonFiction.title} by ${madLibData.mormonNonFiction.author}. Originally written in ${madLibData.mormonNonFiction.yearReleased}, ${madLibData.mormonNonFiction.title} is ${madLibData.mormonNonFiction.pageCount} pages of pure doctrinal truth. You can learn more here `} className="inline" onComplete={() => setMadLibStep(35)} /><a href={madLibData.mormonNonFiction.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(36)} /></a></div>}

        {madLibStep >= 36 && <div><TypewriterText text="Before your next " className="inline" onComplete={() => setMadLibStep(37)} /></div>}
        {madLibStep >= 37 && <b className="inline"><TypewriterText text="Sacrament Meeting" className="inline" onComplete={() => setMadLibStep(38)} /></b>}
        {madLibStep >= 38 && <TypewriterText text={`, make sure to subscribe and listen to at least a couple episodes of ${madLibData.mormonPodcasts.title}. Since ${madLibData.mormonPodcasts.yearInitiallyReleased}, ${madLibData.mormonPodcasts.title} has consistently been at the top of Spotify’s most popular podcasts. It’s a ${madLibData.mormonPodcasts.genre} program produced by the venerable ${madLibData.mormonPodcasts.podcastNetwork} network you absolutely won’t want to miss. You can learn more here `} className="inline" onComplete={() => setMadLibStep(39)} />}
        {madLibStep >= 39 && <a href={madLibData.mormonPodcasts.podcastLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(40)} /></a>}
        
        {madLibStep >= 40 && <div><TypewriterText text="If, at this point, you are still willing to " className="inline" onComplete={() => setMadLibStep(41)} /></div>}
        {madLibStep >= 41 && <b className="inline"><TypewriterText text="“do the work,”" className="inline" onComplete={() => setMadLibStep(42)} /></b>}
        {madLibStep >= 42 && <TypewriterText text={` you’ll make a pilgrimage to the ${madLibData.mormonArchitecture.title}. There you shall find penance.`} className="inline" onComplete={() => setMadLibStep(43)} />}
        
        {madLibStep >= 43 && <div><TypewriterText text={`There you shall find the extraordinary painting, ${madLibData.mormonVisualArt.title}, by latter day pioneer ${madLibData.mormonVisualArt.artist}. Finished in ${madLibData.mormonVisualArt.yearCompleted} after 15 years of dedicated work, ${madLibData.mormonVisualArt.title} remains one of the truly singular American artworks. You can learn more about it here `} className="inline" onComplete={() => setMadLibStep(44)} /><a href={madLibData.mormonVisualArt.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(45)} /></a></div>}
        
        {madLibStep >= 45 && <div><TypewriterText text="Genuflect accordingly. Your work is complete. You have " className="inline" onComplete={() => setMadLibStep(46)} /></div>}
        {madLibStep >= 46 && <b className="inline"><TypewriterText text="”done the work.”" className="inline" onComplete={() => setMadLibStep(47)} /></b>}
        {madLibStep >= 47 && <TypewriterText text=" Your heart has successfully been purged of woke-ness." className="inline" onComplete={() => setMadLibStep(48)} />}

        {madLibStep >= 48 && <div><b className="inline"><TypewriterText text="Never watch television again." className="inline" onComplete={() => setMadLibStep(49)} /></b></div>}
      </div>
    );
  }

  return null;
};

export default PhotoResult;