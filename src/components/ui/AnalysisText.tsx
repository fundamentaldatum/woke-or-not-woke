import React, { useState, useEffect } from 'react';

const analysisSteps = [
    "CONSULTING SCRIPTURE…",
    "READING THE ROOM…",
    "THINKING LONG AND HARD…",
    "JUST ASKING QUESTIONS…",
    "CONSIDERING THE FACTS…",
    "MUNCHING…",
    "FINALIZING ANALYSIS...",
  ];

const AnalysisText: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Animate percentage
    const percentageInterval = setInterval(() => {
      setPercentage(prev => {
        const next = prev + Math.floor(Math.random() * 3) + 1;
        return Math.min(next, 99); // Stop at 99% for effect
      });
    }, 120);

    // Cycle through analysis steps
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % analysisSteps.length);
    }, 800);

    return () => {
      clearInterval(percentageInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="font-mono text-center text-lg text-yellow-400" style={{ textShadow: '0 0 5px #facc15, 0 0 10px #facc15' }}>
      <p>{analysisSteps[currentStepIndex]}</p>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%`, transition: 'width 0.1s linear' }}></div>
      </div>
      <p className="mt-1">{percentage}% COMPLETE</p>
    </div>
  );
};

export default AnalysisText;