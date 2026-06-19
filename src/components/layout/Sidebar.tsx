import { NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { navGroups } from '../../config/navigation';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-mark">
        <img 
          src={`${import.meta.env.BASE_URL}cpe_nu_modern_icon.png`} 
          alt="CPE NU Logo" 
          style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
        />
        <div>
          <strong style={{ fontSize: '1.1rem', color: 'var(--text)' }}>CPE NU</strong>
        </div>
      </div>
      
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '4px' }}>
        {navGroups.map((group) => (
          <div key={group.label}>
            <div style={{ padding: '0 12px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {group.label}
            </div>
            <nav aria-label={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path} end={item.path === '/'}>
                    <Icon size={18} style={{ opacity: 0.8 }} />
                    <span style={{ paddingTop: '2px', fontSize: '0.95rem' }}>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 12px 12px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <NavLink to="/credits" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}>
          <span style={{ background: 'var(--surface)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Sparkles size={16} color="var(--violet)" />
          </span>
          Credits & About
        </NavLink>
      </div>
    </aside>
  );
}
