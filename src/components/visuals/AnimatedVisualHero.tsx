import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function AnimatedVisualHero() {
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
    
    // 8 topics arranged in an octagon
    const topics = [
      { label: 'แผนการศึกษา', color: '37, 99, 235' },   // Blue
      { label: 'Flowchart', color: '8, 145, 178' },      // Cyan
      { label: 'โครงข่ายตัวต่อ', color: '109, 40, 217' },   // Violet
      { label: 'แผนที่เสี่ยง', color: '225, 29, 72' },     // Danger
      { label: 'ตัวเลือกปี 4', color: '249, 115, 22' },    // Orange
      { label: 'เช็กลิสต์จบ', color: '5, 150, 105' },      // Success
      { label: 'สำรวจ GenEd', color: '124, 58, 237' },   // Purple
      { label: 'Heatmap', color: '15, 118, 110' },       // Teal
    ];

    let boxes: { x: number, y: number, w: number, h: number, color: string, label: string }[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        ctx.scale(dpr, dpr);
        
        initBoxesAndParticles(parent.clientWidth, parent.clientHeight);
      }
    };

    class Particle {
      startX: number;
      startY: number;
      targetX: number;
      targetY: number;
      speed: number;
      progress: number;
      color: string;
      size: number;
      delay: number;
      controlX: number;
      controlY: number;

      constructor(startX: number, startY: number, endX: number, endY: number, color: string, isCurve: boolean = false) {
        this.startX = startX;
        this.startY = startY;
        this.targetX = endX;
        this.targetY = endY;
        this.progress = 0;
        this.speed = 0.003 + Math.random() * 0.005;
        this.color = color;
        this.size = Math.random() * 1.5 + 1.5;
        this.delay = Math.random() * 150;
        
        if (isCurve) {
          // Calculate control point for bezier curve
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const dx = endX - startX;
          const dy = endY - startY;
          // Normal vector
          const nx = -dy;
          const ny = dx;
          // Scale normal vector to create curve
          const dist = Math.sqrt(nx * nx + ny * ny);
          const offset = (Math.random() - 0.5) * dist * 0.4;
          
          this.controlX = midX + (nx / dist) * offset;
          this.controlY = midY + (ny / dist) * offset;
        } else {
          this.controlX = (startX + endX) / 2;
          this.controlY = (startY + endY) / 2;
        }
      }

      update() {
        if (this.delay > 0) {
          this.delay--;
          return;
        }
        this.progress += this.speed;
        if (this.progress > 1) {
          this.progress = 0;
          this.delay = Math.random() * 80;
        }
      }

      getPoint(t: number) {
        // Quadratic bezier
        const mt = 1 - t;
        const x = mt * mt * this.startX + 2 * mt * t * this.controlX + t * t * this.targetX;
        const y = mt * mt * this.startY + 2 * mt * t * this.controlY + t * t * this.targetY;
        return { x, y };
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.delay > 0) return;

        const currentPoint = this.getPoint(this.progress);
        
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, this.size, 0, Math.PI * 2);
        // Fade in and out
        const alpha = Math.sin(this.progress * Math.PI);
        ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
        ctx.fill();
        
        // Trail
        const trailLen = 0.15;
        const trailProgress = Math.max(0, this.progress - trailLen);
        const trailStart = this.getPoint(trailProgress);
        
        ctx.beginPath();
        ctx.moveTo(trailStart.x, trailStart.y);
        
        // Draw segmented trail for curve
        for (let t = trailProgress; t <= this.progress; t += 0.05) {
          const p = this.getPoint(t);
          ctx.lineTo(p.x, p.y);
        }
        ctx.lineTo(currentPoint.x, currentPoint.y);
        
        const gradient = ctx.createLinearGradient(trailStart.x, trailStart.y, currentPoint.x, currentPoint.y);
        gradient.addColorStop(0, `rgba(${this.color}, 0)`);
        gradient.addColorStop(1, `rgba(${this.color}, ${alpha * 0.6})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size * 0.8;
        ctx.stroke();
      }
    }

    const initBoxesAndParticles = (w: number, h: number) => {
      boxes = [];
      particles = [];
      
      const centerX = w / 2;
      const centerY = h / 2;
      const radiusX = Math.min(w * 0.35, 300);
      const radiusY = Math.min(h * 0.35, 200);

      // Create octagon boxes
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 - Math.PI / 8; // Offset to not be perfectly cardinal
        const bx = centerX + Math.cos(angle) * radiusX;
        const by = centerY + Math.sin(angle) * radiusY;
        
        boxes.push({
          x: bx,
          y: by,
          w: 110,
          h: 36,
          color: topics[i].color,
          label: topics[i].label
        });
      }

      // Spawn particles
      boxes.forEach((box, i) => {
        // 1. Lines running out from center to boxes
        for (let j = 0; j < 4; j++) {
          particles.push(new Particle(centerX, centerY, box.x, box.y, box.color, true));
        }

        // 2. Lines running between adjacent boxes
        const nextBox = boxes[(i + 1) % 8];
        for (let j = 0; j < 3; j++) {
          particles.push(new Particle(box.x, box.y, nextBox.x, nextBox.y, box.color, true));
        }
        
        // 3. Lines running outwards from boxes to nowhere
        const angle = (i * Math.PI * 2) / 8 - Math.PI / 8;
        for (let j = 0; j < 5; j++) {
          const spread = angle + (Math.random() - 0.5) * 0.8;
          const dist = 100 + Math.random() * 150;
          particles.push(new Particle(box.x, box.y, box.x + Math.cos(spread) * dist, box.y + Math.sin(spread) * dist, box.color, false));
        }
      });
    };

    window.addEventListener('resize', resize);
    
    setTimeout(() => {
      resize();
    }, 50);

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Draw faint background lines connecting the octagon
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.lineWidth = 1;
      
      // Connect adjacent boxes
      ctx.beginPath();
      boxes.forEach((box, i) => {
        if (i === 0) ctx.moveTo(box.x, box.y);
        else ctx.lineTo(box.x, box.y);
      });
      ctx.closePath();
      ctx.stroke();

      // Connect center to boxes
      const centerX = w / 2;
      const centerY = h / 2;
      boxes.forEach(box => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(box.x, box.y);
        ctx.stroke();
      });

      // Central node subtle glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.fill();

      // Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      // Draw boxes over lines
      boxes.forEach(box => {
        ctx.fillStyle = `rgba(${box.color}, 0.1)`;
        ctx.strokeStyle = `rgba(${box.color}, 0.4)`;
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(box.x - box.w/2, box.y - box.h/2, box.w, box.h, 6);
        } else {
          ctx.rect(box.x - box.w/2, box.y - box.h/2, box.w, box.h);
        }
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = `rgba(${box.color}, 0.95)`;
        ctx.font = '600 13px "Inter", "Mitr", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(box.label, box.x, box.y);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="mission-graph" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, opacity: 0.1, background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' }} />
    );
  }

  return (
    <div className="mission-graph" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-hidden="true"
      />
    </div>
  );
}
