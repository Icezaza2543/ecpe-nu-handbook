import { NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { navGroups } from '../../config/navigation';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-mark">
        <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--violet))', boxShadow: '0 4px 12px rgba(123, 97, 255, 0.3)' }}>EC</span>
        <div>
          <strong style={{ fontSize: '1.1rem', color: 'var(--text)' }}>ECPE NU</strong>
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
