import React, { useMemo } from 'react';
import { COLORS, UI } from '../../constants';

/**
 * Header component with the app title and randomized colors
 */
export const Header: React.FC = () => {
  // Randomize color assignment on mount
  const [wokeColor, notWokeColor] = useMemo(() => {
    // true: WOKE is red, NOT WOKE is blue; false: WOKE is blue, NOT WOKE is red
    const wokeIsRed = Math.random() < 0.5;
    return wokeIsRed
      ? [COLORS.RED, COLORS.BLUE]
      : [COLORS.BLUE, COLORS.RED];
  }, []);

  return (
    <header
      className="w-full py-6 flex flex-col items-center shadow-sm z-10"
      style={{
        background: UI.BACKGROUND.HEADER,
      }}
    >
      <h1
        className="text-5xl font-bold tracking-wide"
        style={{
          fontFamily: "'Tagesschrift', sans-serif",
          letterSpacing: "0.08em",
          color: COLORS.WHITE,
          textShadow: "0 2px 8px #1b263b88",
          display: "flex",
          gap: "0.5em",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span style={{ color: wokeColor, textShadow: "0 2px 8px #0008" }}>WOKE</span>
        <span style={{ color: COLORS.WHITE }}>OR</span>
        <span style={{ color: notWokeColor, textShadow: "0 2px 8px #0008" }}>NOT WOKE</span>
      </h1>
    </header>
  );
};

export default Header;
