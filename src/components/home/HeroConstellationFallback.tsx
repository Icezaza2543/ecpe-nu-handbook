import { Network } from 'lucide-react';
import { MotionCard } from '../common/MotionCard';

export function HeroConstellationFallback() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', aspectRatio: '1/1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: '10%', background: 'radial-gradient(circle, rgba(79, 124, 255, 0.1) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(20px)', animation: 'pulse 4s infinite ease-in-out' }} />
      <MotionCard style={{ background: 'var(--surface)', padding: '32px', borderRadius: '32px', border: '1px solid rgba(79, 124, 255, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(79, 124, 255, 0.1)', color: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Network size={32} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)', fontSize: '1.2rem' }}>Curriculum Map</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Interactive visualization is hidden on smaller screens to save performance.</p>
        </div>
      </MotionCard>
    </div>
  );
}
