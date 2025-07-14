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


 const numberOfConfetti = 100;
 const gravity = 0.1;
 const confettiParticles: {
 x: number;
 y: number;
 radius: number;
 velocity: { x: number; y: number };
 color: string;
 }[] = [];


 for (let i = 0; i < numberOfConfetti; i++) {
 confettiParticles.push({
 x: Math.random() * width,
 y: -Math.random() * height,
 radius: Math.random() * 5 + 2,
 velocity: {
 x: (Math.random() - 0.5) * 5,
 y: Math.random() * 10 + 5,
 },
 color: color,
 });
 }


 const animate = () => {
 if (!isActive) {
 ctx.clearRect(0, 0, width, height);
 return;
 }


 ctx.clearRect(0, 0, width, height);


 confettiParticles.forEach((particle, index) => {
 particle.y += particle.velocity.y;
 particle.x += particle.velocity.x;
 particle.velocity.y += gravity;


 // Bounce off the bottom
 if (particle.y >= height) {
 particle.y = -Math.random() * height;
 particle.velocity.y = Math.random() * 10 + 5;
 particle.x = Math.random() * width;
 }


 ctx.beginPath();
 ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
 ctx.fillStyle = particle.color;
 ctx.fill();
 });


 requestAnimationFrame(animate);
 };


 animate();


 return () => {
 ctx.clearRect(0, 0, width, height);
 };
 }, [isActive, color]);


 return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 10 }} />;
};


export default Confetti;