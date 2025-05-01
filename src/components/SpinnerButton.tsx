import React, { useEffect, useRef, useState } from "react";

// Colors
const COLOR_RED = "#ff2d55";
const COLOR_BLUE = "#2d8cff";
const BORDER_IDLE = "#fff";

type SpinnerButtonProps = {
  spinning: boolean;
  setSpinning: (b: boolean) => void;
  onFinalTrue: () => Promise<void>;
  disabled?: boolean;
  showResult: boolean;
};

const SpinnerButton: React.FC<SpinnerButtonProps> = ({
  spinning,
  setSpinning,
  onFinalTrue,
  disabled,
  showResult,
}) => {
  // Spinner animation state
  const [position, setPosition] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [finalSnap, setFinalSnap] = useState(false);

  // Color assignment for this spin
  const [wokeColor, setWokeColor] = useState(COLOR_RED);
  const [notWokeColor, setNotWokeColor] = useState(COLOR_BLUE);

  // Border color state
  const [resultBorderColor, setResultBorderColor] = useState<string>(BORDER_IDLE);

  // When result is shown, border matches the "WOKE" color
  useEffect(() => {
    if (showResult) {
      setResultBorderColor(wokeColor);
    } else {
      setResultBorderColor(BORDER_IDLE);
    }
  }, [showResult, wokeColor]);

  // On each spin, randomly assign colors
  useEffect(() => {
    if (spinning) {
      if (Math.random() < 0.5) {
        setWokeColor(COLOR_RED);
        setNotWokeColor(COLOR_BLUE);
      } else {
        setWokeColor(COLOR_BLUE);
        setNotWokeColor(COLOR_RED);
      }
    }
  }, [spinning]);

  // Spinner logic
  const spinTimeout = useRef<any>(null);
  useEffect(() => {
    if (spinning) {
      setIsSpinning(true);
      setBounce(false);
      setFinalSnap(false);
      const totalSpins = Math.floor(Math.random() * 20) + 24; // 24–43 cycles
      let i = 0;
      function easeOutQuad(t: number) {
        return t * (2 - t);
      }
      function spinStep() {
        if (i === totalSpins - 1) {
          setPosition(1); // "NOT WOKE"
        } else {
          setPosition(i % 2);
        }
        i++;
        const progress = Math.min(i / totalSpins, 1);
        const minDelay = 40;
        const maxDelay = 140;
        const delay = minDelay + (maxDelay - minDelay) * easeOutQuad(progress);
        if (i < totalSpins) {
          spinTimeout.current = setTimeout(spinStep, delay);
        } else {
          setFinalSnap(true);
          setTimeout(() => {
            setPosition(0); // "WOKE"
            setTimeout(() => {
              setBounce(true);
              setIsSpinning(false);
              setFinalSnap(false);
              setSpinning(false);
            }, 180);
          }, 120);
        }
      }
      spinStep();
    }
    return () => {
      if (spinTimeout.current) clearTimeout(spinTimeout.current);
    };
    // eslint-disable-next-line
  }, [spinning, setSpinning]);

  // Handle click
  const handleClick = async () => {
    if (spinning || disabled) return;
    setSpinning(true);
    await onFinalTrue();
  };

  // Button border color logic
  const borderColor =
    showResult && !isSpinning
      ? resultBorderColor
      : BORDER_IDLE;

  // Spinner window style (slot machine effect)
  const spinnerWindowStyle: React.CSSProperties = {
    height: "2.2rem",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    background: "transparent",
    borderRadius: "0.7rem",
    margin: 0,
    transition: "box-shadow 0.2s",
  };

  // Button style
  const buttonStyle: React.CSSProperties = {
    maxWidth: 320,
    minWidth: 180,
    width: "100%",
    padding: "0.7rem 1.5rem",
    border: `4px solid ${borderColor}`,
    borderRadius: "1.2rem",
    background: "#181f2f",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.25rem",
    letterSpacing: "0.01em",
    boxShadow: "0 2px 16px 0 rgba(0,0,0,0.18)",
    cursor: disabled || spinning || showResult ? "default" : "pointer",
    outline: "none",
    position: "relative",
    transition: "border-color 0.25s cubic-bezier(.4,2,.6,1), background 0.2s",
    userSelect: "none",
    margin: "0 auto",
    display: "block",
  };

  // Spinner animation style
  const spinAnimStyle: React.CSSProperties = {
    transform: `translateY(-${position * 2.2}rem)`,
    transition: isSpinning || finalSnap ? "transform 0.13s cubic-bezier(.4,2,.6,1)" : "none",
    fontSize: "1.25rem",
    fontWeight: 700,
    textShadow: "0 1px 8px #000a",
    ...(bounce && !isSpinning
      ? {
          animation: "woke-bounce 0.32s cubic-bezier(.4,2,.6,1)",
        }
      : {}),
  };

  // Keyframes for bounce
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes woke-bounce {
        0% { transform: scaleY(1) }
        30% { transform: scaleY(1.18) }
        60% { transform: scaleY(0.92) }
        100% { transform: scaleY(1) }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Render
  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled || spinning || showResult}
      tabIndex={0}
      aria-label="IS IT WOKE?"
    >
      {/* Idle */}
      {!spinning && !showResult && (
        <span className="block w-full text-center">IS IT WOKE?</span>
      )}
      {/* Spinner */}
      {spinning && (
        <span style={spinnerWindowStyle}>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              ...spinAnimStyle,
            }}
          >
            <span
              style={{
                height: "2.2rem",
                lineHeight: "2.2rem",
                color: wokeColor,
                fontWeight: 800,
                letterSpacing: "0.01em",
              }}
            >
              WOKE
            </span>
            <span
              style={{
                height: "2.2rem",
                lineHeight: "2.2rem",
                color: notWokeColor,
                fontWeight: 800,
                letterSpacing: "0.01em",
              }}
            >
              NOT WOKE
            </span>
          </span>
        </span>
      )}
      {/* Result */}
      {!spinning && showResult && (
        <span
          className="block w-full text-center"
          style={{
            color: wokeColor,
            textShadow: "0 1px 8px #000a",
            fontWeight: 800,
            fontSize: "1.3rem",
            letterSpacing: "0.01em",
            transition: "color 0.2s",
          }}
        >
          WOKE
        </span>
      )}
    </button>
  );
};

export default SpinnerButton;
