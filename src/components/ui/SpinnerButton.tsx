import React, { useEffect, useRef, useState } from "react";
import { SpinnerButtonProps } from "../../types";
import { COLORS } from "../../constants";
import Confetti from "./Confetti";

/**
 * Animated button component that spins between "WOKE" and "NOT WOKE"
 * Used for initiating photo analysis with a playful interaction
 */
const SpinnerButton: React.FC<SpinnerButtonProps> = ({
  spinning,
  setSpinning,
  onFinalTrue,
  disabled,
  showResult,
}) => {
  const [position, setPosition] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [finalSnap, setFinalSnap] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [renderConfetti, setRenderConfetti] = useState(false);

  const [wokeColor, setWokeColor] = useState(COLORS.RED);
  const [notWokeColor, setNotWokeColor] = useState(COLORS.BLUE);

  const [resultBorderColor, setResultBorderColor] = useState<string>(
    COLORS.BORDER_IDLE
  );

  useEffect(() => {
    if (showResult) {
      setResultBorderColor(wokeColor);
    } else {
      setResultBorderColor(COLORS.BORDER_IDLE);
    }
  }, [showResult, wokeColor]);

  useEffect(() => {
    if (spinning) {
      if (Math.random() < 0.5) {
        setWokeColor(COLORS.RED);
        setNotWokeColor(COLORS.BLUE);
      } else {
        setWokeColor(COLORS.BLUE);
        setNotWokeColor(COLORS.RED);
      }
    }
  }, [spinning]);

  // Spinner logic
  const spinTimeout = useRef<any>(null);
  const flashTimeout = useRef<any>(null);
  const confettiTimeout = useRef<any>(null);
  const unmountConfettiTimeout = useRef<any>(null);
  const prevSpinning = useRef(spinning);

  useEffect(() => {
    const wasSpinning = prevSpinning.current;

    if (spinning && !wasSpinning) {
      setIsSpinning(true);
      setBounce(false);
      setFinalSnap(false);
      setIsFlashing(false);
      setConfettiActive(false);
      setRenderConfetti(false);

      const spinLoop = () => {
        setPosition((pos) => (pos === 0 ? 1 : 0));
        spinTimeout.current = setTimeout(spinLoop, 150);
      };
      spinLoop();
    } else if (!spinning && wasSpinning) {
      if (spinTimeout.current) clearTimeout(spinTimeout.current);

      setFinalSnap(true);
      setTimeout(() => {
        setPosition(0);
        setTimeout(() => {
          setBounce(true);
          setIsSpinning(false);
          setFinalSnap(false);

          setIsFlashing(true);
          setConfettiActive(true);
          setRenderConfetti(true);

          flashTimeout.current = setTimeout(() => {
            setIsFlashing(false);
          }, 1000);

          // Stop emitting new confetti after 3 seconds
          confettiTimeout.current = setTimeout(() => {
            setConfettiActive(false);
          }, 3000);
          
          // Unmount the confetti component after 5 seconds to allow all to fall
          unmountConfettiTimeout.current = setTimeout(() => {
            setRenderConfetti(false);
          }, 5000);

        }, 180);
      }, 120);
    }

    prevSpinning.current = spinning;

    return () => {
      if (spinTimeout.current) clearTimeout(spinTimeout.current);
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      if (confettiTimeout.current) clearTimeout(confettiTimeout.current);
      if (unmountConfettiTimeout.current) clearTimeout(unmountConfettiTimeout.current);
    };
  }, [spinning]);

  const handleClick = async () => {
    if (spinning || disabled) return;
    setSpinning(true);
    await onFinalTrue();
  };

  const borderColor =
    showResult && !isSpinning ? resultBorderColor : COLORS.BORDER_IDLE;

  const buttonStyle: React.CSSProperties = {
    maxWidth: 320,
    minWidth: 180,
    width: "100%",
    padding: "0.7rem 1.5rem",
    border: `4px solid ${borderColor}`,
    borderRadius: "1.2rem",
    background: "#181f2f",
    color: COLORS.WHITE,
    fontFamily: "'Marcellus', serif",
    fontWeight: 400,
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
    "--flash-color": wokeColor,
    animation: isFlashing ? "button-flash 0.25s 4" : "none",
  } as React.CSSProperties;

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

  const spinAnimStyle: React.CSSProperties = {
    transform: `translateY(-${position * 2.2}rem)`,
    transition:
      isSpinning || finalSnap ? "transform 0.13s cubic-bezier(.4,2,.6,1)" : "none",
    fontSize: "1.25rem",
    fontWeight: 700,
    textShadow: "0 1px 8px #000a",
    ...(bounce && !isSpinning
      ? {
          animation: "woke-bounce 0.32s cubic-bezier(.4,2,.6,1)",
        }
      : {}),
  };

  const wokeResultStyle: React.CSSProperties = {
    color: wokeColor,
    textShadow: "0 1px 8px #000a",
    fontWeight: 800,
    fontSize: "1.3rem",
    letterSpacing: "0.01em",
    transition: "color 0.2s",
    "--flash-color": wokeColor,
    animation: isFlashing ? "text-flash 0.25s 4" : "none",
  } as React.CSSProperties;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes woke-bounce {
        0% { transform: scaleY(1) }
        30% { transform: scaleY(1.18) }
        60% { transform: scaleY(0.92) }
        100% { transform: scaleY(1) }
      }
      @keyframes button-flash {
        50% {
          box-shadow: 0 0 25px 8px var(--flash-color);
        }
      }
      @keyframes text-flash {
        50% {
          color: #fff;
          text-shadow: 0 0 25px var(--flash-color);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {renderConfetti && <Confetti color={wokeColor} isActive={confettiActive} />}
      <button
        type="button"
        style={buttonStyle}
        onClick={handleClick}
        disabled={disabled || spinning || showResult}
        tabIndex={0}
        aria-label="IS IT WOKE?"
      >
        {!spinning && !showResult && (
          <span className="block w-full text-center">IS IT WOKE?</span>
        )}
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
        {!spinning && showResult && (
          <span className="block w-full text-center" style={wokeResultStyle}>
            WOKE
          </span>
        )}
      </button>
    </>
  );
};

export default SpinnerButton;