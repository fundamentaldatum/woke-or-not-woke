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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (isActive && particlesRef.current.length === 0) {
      const numberOfConfetti = 200;
      for (let i = 0; i < numberOfConfetti; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: -Math.random() * canvas.height,
          width: Math.random() * 10 + 5,
          height: Math.random() * 20 + 8,
          velocity: { x: (Math.random() - 0.5) * 7, y: Math.random() * 3 + 2 },
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          color: color,
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particlesRef.current.forEach((particle) => {
        if (particle.y < canvas.height + 20) {
          activeParticles++;

          particle.y += particle.velocity.y;
          particle.x += particle.velocity.x;
          particle.velocity.y += 0.05;
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
        particlesRef.current = [];
      }
    };

    if (isActive && !animationFrameId.current) {
        animate();
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