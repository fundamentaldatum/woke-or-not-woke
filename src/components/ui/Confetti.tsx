import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  color: string;
  isActive: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ color, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Use a ref to track the active state inside the animation loop
  // This prevents the effect from re-running when the prop changes.
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  useEffect(() => {
    // Only set up the animation when the component is first activated
    if (!isActive) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const numberOfConfetti = 150;
    
    // Create the initial set of particles
    particlesRef.current = [];
    for (let i = 0; i < numberOfConfetti; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height * 0.5, // Start further up
        width: Math.random() * 10 + 5,
        height: Math.random() * 20 + 8,
        velocity: { x: (Math.random() - 0.5) * 7, y: Math.random() * 3 + 2 },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        color: color,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particlesRef.current.forEach((particle) => {
        // Only update and draw particles that are still visible
        if (particle.y < canvas.height + 20) {
          activeParticles++;

          // Apply physics
          particle.y += particle.velocity.y;
          particle.x += particle.velocity.x;
          particle.velocity.y += 0.05; // Gravity
          particle.rotation += particle.rotationSpeed;

          // Draw the rectangle
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
          ctx.restore();
        } 
        // If the confetti shower is still active, reset particles that have fallen off
        else if (isActiveRef.current) {
          activeParticles++;
          particle.y = -20; // Reset to the top
          particle.x = Math.random() * canvas.width;
        }
      });
      
      // If there are still particles on screen, continue the animation.
      // Otherwise, stop it completely.
      if (activeParticles > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      }
    };

    // Start the animation loop
    if (!animationFrameId.current) {
      animate();
    }

    return () => {
      // Cleanup on unmount
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isActive, color]); // This effect now correctly handles changes to `isActive`.

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1000,
        transition: 'opacity 0.5s ease-out',
        opacity: isActive || particlesRef.current.length > 0 ? 1 : 0,
      }}
    />
  );
};

export default Confetti;