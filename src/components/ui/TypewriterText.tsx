import React, { useState, useEffect, useRef } from 'react';
import { TypewriterTextProps } from '../../types';
import { ANIMATION } from '../../constants';

/**
 * TypewriterText component
 * Displays text with a typewriter animation effect, character by character
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = '',
  typingSpeed = ANIMATION.TYPEWRITER_SPEED,
  startDelay = ANIMATION.TYPEWRITER_DELAY,
  onComplete,
  reset = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  // Function to clear all timeouts
  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  // Function to reset the animation
  const resetAnimation = () => {
    clearAllTimeouts();
    setDisplayedText('');
    setIsComplete(false);
    isAnimatingRef.current = false;
    currentIndexRef.current = 0;
  };

  // Start or restart the animation
  const startAnimation = () => {
    if (isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;
    currentIndexRef.current = 0;
    
    // Initial delay before starting to type
    const initialTimeout = setTimeout(() => {
      // Function to add the next character
      const typeNextChar = () => {
        if (currentIndexRef.current < text.length) {
          setDisplayedText(text.substring(0, currentIndexRef.current + 1));
          currentIndexRef.current++;
          
          // Schedule the next character
          const nextTimeout = setTimeout(typeNextChar, typingSpeed);
          timeoutsRef.current.push(nextTimeout);
        } else {
          // Animation complete
          isAnimatingRef.current = false;
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
        }
      };
      
      // Start typing
      typeNextChar();
    }, startDelay);
    
    timeoutRef.current = initialTimeout;
    timeoutsRef.current.push(initialTimeout);
  };

  // Reset and restart animation when component mounts or reset prop changes
  useEffect(() => {
    resetAnimation();
    startAnimation();
    
    // Cleanup function
    return clearAllTimeouts;
  }, [text, reset, typingSpeed, startDelay]);
  
  return (
    <div className={className}>
      {displayedText}
      {!isComplete && <span className="inline-block w-1 h-4 ml-0.5 bg-white animate-pulse"></span>}
    </div>
  );
};

export default TypewriterText;
