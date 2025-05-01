import React, { useEffect, useRef, useState } from "react";

type PixelateOverlayProps = {
  src: string;
  active: boolean;
  pixelSize?: number; // Size of the "pixels" (default: 12)
  className?: string;
};

const ANIMATION_DURATION = 1800; // ms for a full sweep

const PixelateOverlay: React.FC<PixelateOverlayProps> = ({
  src,
  active,
  pixelSize = 16,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  // Animate progress from 0 to 1 while active
  useEffect(() => {
    let raf: number;
    let start: number;
    if (active) {
      setProgress(0);
      function animate(ts: number) {
        if (!start) start = ts;
        const elapsed = ts - start;
        let p = Math.min(elapsed / ANIMATION_DURATION, 1);
        setProgress(p);
        if (p < 1 && active) {
          raf = requestAnimationFrame(animate);
        } else if (active) {
          // Loop the animation for as long as active
          start = undefined as any;
          raf = requestAnimationFrame(animate);
        }
      }
      raf = requestAnimationFrame(animate);
    } else {
      setProgress(0);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  // Draw pixelation sweep
  useEffect(() => {
    if (!active) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = img.width;
      const h = img.height;
      const px = Math.max(4, pixelSize);

      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      // Calculate sweep width
      const sweepWidth = Math.floor(w * progress);

      // 1. Draw pixelated area (left side)
      if (sweepWidth > 0) {
        // Draw scaled down image to an offscreen canvas
        const offCanvas = document.createElement("canvas");
        offCanvas.width = Math.ceil(sweepWidth / px);
        offCanvas.height = Math.ceil(h / px);
        const offCtx = offCanvas.getContext("2d");
        if (offCtx) {
          offCtx.imageSmoothingEnabled = false;
          offCtx.drawImage(
            img,
            0,
            0,
            sweepWidth,
            h,
            0,
            0,
            offCanvas.width,
            offCanvas.height
          );
          // Draw pixelated area back up to main canvas
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            offCanvas,
            0,
            0,
            offCanvas.width,
            offCanvas.height,
            0,
            0,
            sweepWidth,
            h
          );
        }
      }

      // 2. Draw sharp area (right side)
      if (sweepWidth < w) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(sweepWidth, 0, w - sweepWidth, h);
        ctx.clip();
        ctx.drawImage(img, sweepWidth, 0, w - sweepWidth, h, sweepWidth, 0, w - sweepWidth, h);
        ctx.restore();
      }

      // 3. Optional: Draw a vertical scanline at the sweep edge
      if (sweepWidth > 0 && sweepWidth < w) {
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#fff";
        ctx.fillRect(sweepWidth - 2, 0, 4, h);
        ctx.restore();
      }
    };
  }, [src, active, progress, pixelSize]);

  return active ? (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full rounded-lg z-20 pointer-events-none ${className}`}
      style={{
        objectFit: "contain",
        width: "100%",
        height: "100%",
        opacity: 0.85,
        background: "transparent",
        transition: "opacity 0.2s",
      }}
    />
  ) : null;
};

export default PixelateOverlay;
