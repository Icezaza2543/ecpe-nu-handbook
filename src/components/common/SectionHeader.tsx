export function SectionHeader({ 
  title, 
  description, 
  as: HeadingTag = 'h1',
  variant = 'default',
  className = ''
}: { 
  title: string; 
  description?: string; 
  as?: 'h1' | 'h2';
  variant?: 'default' | 'hero';
  className?: string;
}) {
  return (
    <header className={`section-header ${className}`} style={{
      position: 'relative',
      overflow: 'hidden',
      padding: variant === 'hero' ? '48px 32px' : '32px',
      borderRadius: '24px',
      marginBottom: '32px',
      border: '1px solid var(--border)',
      boxShadow: variant === 'hero' ? '0 8px 32px rgba(0, 0, 0, 0.05)' : 'none',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {variant === 'hero' && (
        <>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(79, 124, 255, 0.15) 0%, rgba(123, 97, 255, 0.08) 50%, rgba(255, 158, 87, 0.12) 100%)',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '60%',
            height: '150%',
            background: 'radial-gradient(ellipse at center, rgba(79, 124, 255, 0.08) 0%, transparent 70%)',
            transform: 'rotate(-15deg)',
            zIndex: 1,
          }} />
        </>
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <HeadingTag style={{ margin: '0 0 12px 0', fontSize: HeadingTag === 'h1' ? 'clamp(1.8rem, 3vw, 2.2rem)' : '1.8rem', color: 'var(--text)', lineHeight: 1.15 }}>{title}</HeadingTag>
        {description ? <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '800px', lineHeight: 1.6 }}>{description}</p> : null}
      </div>
    </header>
  );
}
