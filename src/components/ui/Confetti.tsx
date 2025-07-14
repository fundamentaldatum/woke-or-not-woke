import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  color: string;
  isActive: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ color, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // This ref tracks the prop without re-triggering the effect
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up canvas only once
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
          velocity: { x: (Math.random() - 0.5) * 10, y: Math.random() * 5 + 2 },
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
        particle.y += particle.velocity.y;
        particle.x += particle.velocity.x;
        particle.velocity.y += 0.1; // gravity
        particle.rotation += particle.rotationSpeed;

        // Only draw if particle is on screen
        if (particle.y < canvas.height + 20) {
          activeParticles++;
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation * Math.PI / 180);
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
          ctx.restore();
        } 
        // If still active, reset particle to the top
        else if (isActiveRef.current) {
          activeParticles++;
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
        }
      });

      if (activeParticles > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        // Stop animation completely when all particles are off screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId.current = null;
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

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }} />;
};

export default Confetti;