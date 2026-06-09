export function SectionHeader({ title, description, bgImage }: { title: string; description?: string; bgImage?: string }) {
  return (
    <header className="section-header" style={{
      position: 'relative',
      overflow: 'hidden',
      padding: bgImage ? '48px 32px' : '32px',
      borderRadius: '24px',
      marginBottom: '32px',
      border: '1px solid var(--border)',
      boxShadow: bgImage ? '0 8px 32px rgba(0, 0, 0, 0.05)' : 'none',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {bgImage && (
        <>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 100%)',
            zIndex: 1
          }} />
        </>
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '2.2rem', color: 'var(--text)' }}>{title}</h2>
        {description ? <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '800px', lineHeight: 1.6 }}>{description}</p> : null}
      </div>
    </header>
  );
}
