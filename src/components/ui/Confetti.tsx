import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  color: string;
  isActive: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ color, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const numberOfConfetti = 150;
    const gravity = 0.1;
    const confettiParticles: {
      x: number;
      y: number;
      width: number;
      height: number;
      velocity: { x: number; y: number };
      rotation: number;
      rotationSpeed: number;
      color: string;
    }[] = [];

    for (let i = 0; i < numberOfConfetti; i++) {
      confettiParticles.push({
        x: Math.random() * width,
        y: -Math.random() * height,
        width: Math.random() * 8 + 4,
        height: Math.random() * 15 + 5,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 5 + 2,
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        color: color,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      confettiParticles.forEach((particle) => {
        particle.y += particle.velocity.y;
        particle.x += particle.velocity.x;
        particle.velocity.y += gravity;
        particle.rotation += particle.rotationSpeed;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
        ctx.restore();

        // Reset confetti that goes off-screen
        if (particle.y > height + 20) {
            particle.y = -20;
            particle.x = Math.random() * width;
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    };
  }, [isActive, color]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 10 }} />;
};

export default Confetti;