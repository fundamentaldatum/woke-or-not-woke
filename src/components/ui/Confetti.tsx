import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  color: string;
  onComplete: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ color, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Use refs to track props inside the animation loop.
  // This prevents the effect from re-running and causing the animation "hiccup".
  const colorRef = useRef(color);
  colorRef.current = color;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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
          ctx.fillStyle = colorRef.current;
          ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
          ctx.restore();
        } else if (Date.now() < stopTime) {
          activeParticles++;
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
        }
      });

      if (activeParticles > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        onCompleteRef.current();
      }
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // The empty dependency array is key: it ensures this effect runs only ONCE.
  }, []);

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