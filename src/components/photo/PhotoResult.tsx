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
          {madLibStep >= 1 && <b className="text-yellow-400 inline"><TypewriterText text="Sacrament Meeting" className="inline" onComplete={() => setMadLibStep(2)} /></b>}
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

        {madLibStep >= 17 && (
            <div>
                <TypewriterText text="You’ll also need to watch the classic film " className="inline" onComplete={() => setMadLibStep(18)} />
                {madLibStep >= 18 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFilms.title} className="inline" onComplete={() => setMadLibStep(19)} /></b>}
                {madLibStep >= 19 && <TypewriterText text=". This edgy, controversial film received a boundary-pushing MPAA rating of " className="inline" onComplete={() => setMadLibStep(20)} />}
                {madLibStep >= 20 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFilms.mpaaRating} className="inline" onComplete={() => setMadLibStep(21)} /></b>}
                {madLibStep >= 21 && <TypewriterText text=". Released in " className="inline" onComplete={() => setMadLibStep(22)} />}
                {madLibStep >= 22 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonFilms.year)} className="inline" onComplete={() => setMadLibStep(23)} /></b>}
                {madLibStep >= 23 && <TypewriterText text=" and coming in at just " className="inline" onComplete={() => setMadLibStep(24)} />}
                {madLibStep >= 24 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFilms.runtime} className="inline" onComplete={() => setMadLibStep(25)} /></b>}
                {madLibStep >= 25 && <TypewriterText text=", this is a critical part of your sanctification. You can learn more " className="inline" onComplete={() => setMadLibStep(26)} />}
                {madLibStep >= 26 && <a href={madLibData.mormonFilms.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(27)} /></a>}
            </div>
        )}

        {madLibStep >= 27 && (
            <div>
                <TypewriterText text="This is not enough to sufficiently " className="inline" onComplete={() => setMadLibStep(28)} />
                {madLibStep >= 28 && <b className="inline"><TypewriterText text="“do the work.”" className="inline" onComplete={() => setMadLibStep(29)} /></b>}
                {madLibStep >= 29 && <TypewriterText text=" You should watch at least one season of " className="inline" onComplete={() => setMadLibStep(30)} />}
                {madLibStep >= 30 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonTVShows.title} className="inline" onComplete={() => setMadLibStep(31)} /></b>}
                {madLibStep >= 31 && <TypewriterText text=". This " className="inline" onComplete={() => setMadLibStep(32)} />}
                {madLibStep >= 32 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonTVShows.initialYearAired)} className="inline" onComplete={() => setMadLibStep(33)} /></b>}
                {madLibStep >= 33 && <TypewriterText text=" " className="inline" onComplete={() => setMadLibStep(34)} />}
                {madLibStep >= 34 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonTVShows.genre} className="inline" onComplete={() => setMadLibStep(35)} /></b>}
                {madLibStep >= 35 && <TypewriterText text=" series produced and broadcast by the legendary " className="inline" onComplete={() => setMadLibStep(36)} />}
                {madLibStep >= 36 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonTVShows.network} className="inline" onComplete={() => setMadLibStep(37)} /></b>}
                {madLibStep >= 37 && <TypewriterText text=" is rightfully considered a seminal televisual work. You can learn more here " className="inline" onComplete={() => setMadLibStep(38)} />}
                {madLibStep >= 38 && <a href={madLibData.mormonTVShows.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(39)} /></a>}
            </div>
        )}

        {madLibStep >= 39 && (
            <div>
                <TypewriterText text={`At this point, your work remains incomplete. Enjoy some lighter fare as you reflect on your depravity. Read `} className="inline" onComplete={() => setMadLibStep(40)} />
                {madLibStep >= 40 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFiction.title} className="inline" onComplete={() => setMadLibStep(41)} /></b>}
                {madLibStep >= 41 && <TypewriterText text=" by " className="inline" onComplete={() => setMadLibStep(42)} />}
                {madLibStep >= 42 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFiction.author} className="inline" onComplete={() => setMadLibStep(43)} /></b>}
                {madLibStep >= 43 && <TypewriterText text=". First published in " className="inline" onComplete={() => setMadLibStep(44)} />}
                {madLibStep >= 44 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonFiction.yearReleased)} className="inline" onComplete={() => setMadLibStep(45)} /></b>}
                {madLibStep >= 45 && <TypewriterText text=", " className="inline" onComplete={() => setMadLibStep(46)} />}
                {madLibStep >= 46 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonFiction.title} className="inline" onComplete={() => setMadLibStep(47)} /></b>}
                {madLibStep >= 47 && <TypewriterText text=" is " className="inline" onComplete={() => setMadLibStep(48)} />}
                {madLibStep >= 48 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonFiction.pageCount)} className="inline" onComplete={() => setMadLibStep(49)} /></b>}
                {madLibStep >= 49 && <TypewriterText text=" pages of pure excitement. You can learn more here " className="inline" onComplete={() => setMadLibStep(50)} />}
                {madLibStep >= 50 && <a href={madLibData.mormonFiction.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(51)} /></a>}
            </div>
        )}

        {madLibStep >= 51 && (
            <div>
                <TypewriterText text={`Enough of this. It is time to take your “work” seriously. Read `} className="inline" onComplete={() => setMadLibStep(52)} />
                {madLibStep >= 52 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonNonFiction.title} className="inline" onComplete={() => setMadLibStep(53)} /></b>}
                {madLibStep >= 53 && <TypewriterText text=" by " className="inline" onComplete={() => setMadLibStep(54)} />}
                {madLibStep >= 54 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonNonFiction.author} className="inline" onComplete={() => setMadLibStep(55)} /></b>}
                {madLibStep >= 55 && <TypewriterText text=". Originally written in " className="inline" onComplete={() => setMadLibStep(56)} />}
                {madLibStep >= 56 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonNonFiction.yearReleased)} className="inline" onComplete={() => setMadLibStep(57)} /></b>}
                {madLibStep >= 57 && <TypewriterText text=", " className="inline" onComplete={() => setMadLibStep(58)} />}
                {madLibStep >= 58 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonNonFiction.title} className="inline" onComplete={() => setMadLibStep(59)} /></b>}
                {madLibStep >= 59 && <TypewriterText text=" is " className="inline" onComplete={() => setMadLibStep(60)} />}
                {madLibStep >= 60 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonNonFiction.pageCount)} className="inline" onComplete={() => setMadLibStep(61)} /></b>}
                {madLibStep >= 61 && <TypewriterText text=" pages of pure doctrinal truth. You can learn more here " className="inline" onComplete={() => setMadLibStep(62)} />}
                {madLibStep >= 62 && <a href={madLibData.mormonNonFiction.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(63)} /></a>}
            </div>
        )}
        
        {madLibStep >= 63 && (
            <div>
                <TypewriterText text="Before your next " className="inline" onComplete={() => setMadLibStep(64)} />
                {madLibStep >= 64 && <b className="text-yellow-400 inline"><TypewriterText text="Sacrament Meeting" className="inline" onComplete={() => setMadLibStep(65)} /></b>}
                {madLibStep >= 65 && <TypewriterText text={`, make sure to subscribe and listen to at least a couple episodes of `} className="inline" onComplete={() => setMadLibStep(66)} />}
                {madLibStep >= 66 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonPodcasts.title} className="inline" onComplete={() => setMadLibStep(67)} /></b>}
                {madLibStep >= 67 && <TypewriterText text={`. Since `} className="inline" onComplete={() => setMadLibStep(68)} />}
                {madLibStep >= 68 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonPodcasts.yearInitiallyReleased)} className="inline" onComplete={() => setMadLibStep(69)} /></b>}
                {madLibStep >= 69 && <TypewriterText text={`, `} className="inline" onComplete={() => setMadLibStep(70)} />}
                {madLibStep >= 70 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonPodcasts.title} className="inline" onComplete={() => setMadLibStep(71)} /></b>}
                {madLibStep >= 71 && <TypewriterText text={" has consistently been at the top of Spotify’s most popular podcasts. It’s a "} className="inline" onComplete={() => setMadLibStep(72)} />}
                {madLibStep >= 72 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonPodcasts.genre} className="inline" onComplete={() => setMadLibStep(73)} /></b>}
                {madLibStep >= 73 && <TypewriterText text={" program produced by the venerable "} className="inline" onComplete={() => setMadLibStep(74)} />}
                {madLibStep >= 74 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonPodcasts.podcastNetwork} className="inline" onComplete={() => setMadLibStep(75)} /></b>}
                {madLibStep >= 75 && <TypewriterText text={" network you absolutely won’t want to miss. You can learn more here "} className="inline" onComplete={() => setMadLibStep(76)} />}
                {madLibStep >= 76 && <a href={madLibData.mormonPodcasts.podcastLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(77)} /></a>}
            </div>
        )}

        {madLibStep >= 77 && (
            <div>
                <TypewriterText text="If, at this point, you are still willing to " className="inline" onComplete={() => setMadLibStep(78)} />
                {madLibStep >= 78 && <b className="inline"><TypewriterText text="“do the work,”" className="inline" onComplete={() => setMadLibStep(79)} /></b>}
                {madLibStep >= 79 && <TypewriterText text={` you’ll make a pilgrimage to the `} className="inline" onComplete={() => setMadLibStep(80)} />}
                {madLibStep >= 80 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonArchitecture.title} className="inline" onComplete={() => setMadLibStep(81)} /></b>}
                {madLibStep >= 81 && <TypewriterText text={`. There you shall find penance.`} className="inline" onComplete={() => setMadLibStep(82)} />}
            </div>
        )}

        {madLibStep >= 82 && (
            <div>
                <TypewriterText text={`There you shall find the extraordinary painting, `} className="inline" onComplete={() => setMadLibStep(83)} />
                {madLibStep >= 83 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonVisualArt.title} className="inline" onComplete={() => setMadLibStep(84)} /></b>}
                {madLibStep >= 84 && <TypewriterText text={", by latter day pioneer "} className="inline" onComplete={() => setMadLibStep(85)} />}
                {madLibStep >= 85 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonVisualArt.artist} className="inline" onComplete={() => setMadLibStep(86)} /></b>}
                {madLibStep >= 86 && <TypewriterText text={`. Finished in `} className="inline" onComplete={() => setMadLibStep(87)} />}
                {madLibStep >= 87 && <b className="text-yellow-400 inline"><TypewriterText text={String(madLibData.mormonVisualArt.yearCompleted)} className="inline" onComplete={() => setMadLibStep(88)} /></b>}
                {madLibStep >= 88 && <TypewriterText text={" after 15 years of dedicated work, "} className="inline" onComplete={() => setMadLibStep(89)} />}
                {madLibStep >= 89 && <b className="text-yellow-400 inline"><TypewriterText text={madLibData.mormonVisualArt.title} className="inline" onComplete={() => setMadLibStep(90)} /></b>}
                {madLibStep >= 90 && <TypewriterText text={" remains one of the truly singular American artworks. You can learn more about it here "} className="inline" onComplete={() => setMadLibStep(91)} />}
                {madLibStep >= 91 && <a href={madLibData.mormonVisualArt.wikipediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline"><TypewriterText text="here." className="inline" onComplete={() => setMadLibStep(92)} /></a>}
            </div>
        )}

        {madLibStep >= 92 && (
            <div>
                <TypewriterText text="Genuflect accordingly. Your work is complete. You have " className="inline" onComplete={() => setMadLibStep(93)} />
                {madLibStep >= 93 && <b className="inline"><TypewriterText text="”done the work.”" className="inline" onComplete={() => setMadLibStep(94)} /></b>}
                {madLibStep >= 94 && <TypewriterText text=" Your heart has successfully been purged of woke-ness." className="inline" onComplete={() => setMadLibStep(95)} />}
            </div>
        )}

        {madLibStep >= 95 && <div><b className="text-yellow-400 inline"><TypewriterText text="Never watch television again." className="inline" onComplete={() => setMadLibStep(96)} /></b></div>}
      </div>
    );
  }

  return null;
};

export default PhotoResult;