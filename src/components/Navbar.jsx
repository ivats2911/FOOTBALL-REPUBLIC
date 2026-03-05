import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Shirt } from 'lucide-react';

const Navbar = ({ onCartClick, cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'all 0.3s ease',
      padding: scrolled ? '12px 24px' : '20px 24px',
      background: scrolled ? 'var(--glass-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Shirt color="var(--accent-green)" size={28} />
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            FOOTBALL <span style={{ color: 'var(--accent-green)' }}>REPUBLIC</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div style={{ gap: '32px' }} className="desktop-links">
          <a href="#home" style={{ fontWeight: 500, transition: 'var(--transition)' }} className="nav-link">Home</a>
          <a href="#shop" style={{ fontWeight: 500, transition: 'var(--transition)' }} className="nav-link">Shop Collection</a>
          <a href="#about" style={{ fontWeight: 500, transition: 'var(--transition)' }} className="nav-link">About</a>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onCartClick}
            style={{ 
              position: 'relative', 
              padding: '8px', 
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-green)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
          >
            <ShoppingCart size={20} color="var(--text-primary)" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--accent-green)',
                color: '#000',
                fontSize: '11px',
                fontWeight: 800,
                height: '18px',
                width: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px var(--accent-glow)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            style={{ display: 'block', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Internal CSS for media queries since we use inline styles mostly */}
      <style>{`
        .desktop-links { display: none !important; }
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .nav-link:hover { color: var(--accent-green) !important; text-shadow: 0 0 8px var(--accent-glow); }
      `}</style>
    </nav>
  );
};

export default Navbar;
