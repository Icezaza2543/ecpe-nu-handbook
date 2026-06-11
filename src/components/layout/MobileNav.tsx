import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Sparkles, X } from 'lucide-react';
import { navGroups, primaryMobileLinks } from '../../config/navigation';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sheet on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <nav className="mobile-nav" aria-label="มือถือ">
        {primaryMobileLinks.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} end={path === '/'}>
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
        <button 
          type="button" 
          onClick={() => setIsOpen(true)}
          className={`more-button ${isOpen ? 'active' : ''}`}
          aria-expanded={isOpen}
          aria-label="เมนูเพิ่มเติม"
        >
          <Menu size={20} aria-hidden="true" />
          <span>เพิ่มเติม</span>
        </button>
      </nav>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="mobile-nav-backdrop" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Bottom Sheet */}
      <div 
        className={`mobile-nav-sheet ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="เมนูเพิ่มเติม"
      >
        <div className="sheet-header">
          <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>เมนูทั้งหมด</h2>
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            aria-label="ปิดเมนู"
            className="close-button"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="sheet-content">
          {navGroups.map((group) => (
            <div key={group.label} className="sheet-group">
              <h3 className="sheet-group-title">{group.label}</h3>
              <div className="sheet-links">
                {group.items.map(({ path, label, icon: Icon }) => (
                  <NavLink key={path} to={path} end={path === '/'} className="sheet-link">
                    <div className="sheet-icon-wrapper">
                      <Icon size={18} />
                    </div>
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
          <div className="sheet-footer">
            <NavLink to="/credits" className="sheet-link special">
              <div className="sheet-icon-wrapper">
                <Sparkles size={18} color="var(--violet)" />
              </div>
              <span>Credits & About</span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
