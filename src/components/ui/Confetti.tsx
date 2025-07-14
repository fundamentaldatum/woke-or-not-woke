import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  color: string;
  isActive: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ color, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const numberOfConfetti = 150;

    if (isActive) {
      for (let i = 0; i < numberOfConfetti; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -Math.random() * canvas.height * 0.5,
          width: Math.random() * 10 + 5,
          height: Math.random() * 20 + 8,
          velocity: { x: (Math.random() - 0.5) * 7, y: Math.random() * 3 + 2 },
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          color: color,
        });
      }
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particles.forEach((particle, index) => {
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
        }
      });

      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
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