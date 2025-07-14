import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  color: string;
  isActive: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ color, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createParticles = () => {
      const numberOfConfetti = 150;
      const newParticles = [];
      for (let i = 0; i < numberOfConfetti; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: -Math.random() * canvas.height,
          width: Math.random() * 8 + 4,
          height: Math.random() * 15 + 5,
          velocity: { x: (Math.random() - 0.5) * 5, y: Math.random() * 2 + 1 }, // Reduced initial Y velocity
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          color: color,
        });
      }
      particlesRef.current = newParticles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particlesRef.current.forEach((particle) => {
        if (particle.y < canvas.height + 20) {
          activeParticles++;

          particle.y += particle.velocity.y;
          particle.x += particle.velocity.x;
          particle.velocity.y += 0.05; // Reduced gravity
          particle.rotation += particle.rotationSpeed;

          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
          ctx.restore();
        } else if (isActiveRef.current) {
          activeParticles++;
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
        }
      });

      if (activeParticles > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (isActive) {
      createParticles();
      if (!animationFrameId.current) {
        animate();
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }}
    />
  );
};

export default Confetti;