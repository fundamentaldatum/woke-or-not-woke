import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  color: string;
  onComplete: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ color, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Use a ref to track the color prop inside the animation loop
  // This prevents the effect from re-running when the color changes.
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const numberOfConfetti = 250;

    for (let i = 0; i < numberOfConfetti; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -Math.random() * canvas.height,
          width: Math.random() * 10 + 5,
          height: Math.random() * 20 + 8,
          velocity: { x: (Math.random() - 0.5) * 7, y: Math.random() * 3 + 2 },
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
        });
    }

    // Stop generating new particles after 2.5 seconds
    const stopTime = Date.now() + 2500;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particles.forEach((particle) => {
        if (particle.y < canvas.height + 20) {
          activeParticles++;

          particle.y += particle.velocity.y;
          particle.x += particle.velocity.x;
          particle.velocity.y += 0.05;
          particle.rotation += particle.rotationSpeed;

          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          // Use the color from the ref
          ctx.fillStyle = colorRef.current;
          ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
          ctx.restore();
        } else if (Date.now() < stopTime) {
          // Recycle particles only before the stop time
          activeParticles++;
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
        }
      });

      if (activeParticles > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        // Animation is complete, call the callback
        onComplete();
      }
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // The empty dependency array ensures this effect runs only once on mount.
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
};

export default Confetti;