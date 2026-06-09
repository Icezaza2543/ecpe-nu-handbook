import { AlertTriangle, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  message?: string;
}

export function VisualFallback({ message = "Unable to load interactive visual. Your device or browser may not support WebGL or the required resources." }: Props) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', padding: '2rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
      <AlertTriangle size={48} style={{ color: 'var(--warning)', marginBottom: '1rem' }} />
      <h3 style={{ marginBottom: '0.5rem' }}>Visual Unavailable</h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {message}
      </p>
      <button 
        onClick={() => navigate('/courses')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
      >
        <Map size={18} /> Go to Course Catalog
      </button>
    </div>
  );
}
