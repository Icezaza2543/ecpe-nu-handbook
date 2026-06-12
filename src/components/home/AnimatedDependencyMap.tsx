import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function AnimatedDependencyMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const numParticles = 75; // Adjust density here
    const connectionDistance = 140; // Max distance for connecting nodes
    const mouseConnectionDistance = 180; // Distance for mouse interaction
    
    // Colors based on the handbook theme (Core, Math, Elective, GenEd)
    const colors = [
      '37, 99, 235',   // Blue (Core)
      '8, 145, 178',   // Cyan (Math/Logic)
      '168, 85, 247',  // Violet (GenEd)
      '236, 72, 153'   // Pink (Project)
    ];

    // Resize canvas correctly without blur
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        ctx.scale(dpr, dpr);
        
        // Re-init particles on heavy resize if needed, but keeping them is fine
        if (particles.length === 0) {
          initParticles(parent.clientWidth, parent.clientHeight);
        }
      }
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.6; // Slow drifting speed
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1.5; // Small nodes
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls gently
        if (this.x < 0 || this.x > canvasWidth) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvasHeight) this.vy = -this.vy;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, 0.8)`;
        ctx.fill();

        // Optional: Soft glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, 0.5)`;
        ctx.shadowBlur = 0; // reset for next drawing operations
      }
    }

    const initParticles = (w: number, h: number) => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(w, h));
      }
    };

    window.addEventListener('resize', resize);
    resize(); // initial setup

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(w, h);
        particles[i].draw(ctx);

        // Check connections between particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Opacity based on distance (closer = more opaque)
            const opacity = 1 - (dist / connectionDistance);
            
            // Mix colors or just use grey/blue for lines
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.35})`; 
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        
        // Check connection with mouse pointer
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < mouseConnectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = 1 - (distMouse / mouseConnectionDistance);
          // Highlight mouse connection with node's specific color
          ctx.strokeStyle = `rgba(${particles[i].color}, ${opacity * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="mission-graph" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at center, var(--primary), transparent 70%)' }} />
    );
  }

  return (
    <div className="mission-graph" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'auto' }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'auto' }}
        aria-hidden="true"
      />
    </div>
  );
}
