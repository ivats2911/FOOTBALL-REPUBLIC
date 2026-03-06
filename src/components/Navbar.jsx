import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Shirt, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ onCartClick, cartCount, onAuthClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
          <Shirt color="var(--accent-green)" size={28} />
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            FOOTBALL <span style={{ color: 'var(--accent-green)' }}>REPUBLIC</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ gap: '32px' }} className="desktop-links">
          <Link to="/" style={{ fontWeight: 500, transition: 'var(--transition)', textDecoration: 'none', color: 'inherit' }} className="nav-link">Home</Link>
          <a href="#shop" style={{ fontWeight: 500, transition: 'var(--transition)', textDecoration: 'none', color: 'inherit' }} className="nav-link">Shop Collection</a>
          <a href="#about" style={{ fontWeight: 500, transition: 'var(--transition)', textDecoration: 'none', color: 'inherit' }} className="nav-link">About</a>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Auth Button */}
          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{ 
                  padding: '8px', 
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--accent-green)',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                onMouseOut={(e) => !isUserMenuOpen && (e.currentTarget.style.borderColor = 'var(--glass-border)')}
              >
                <User size={20} />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: '200px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--glass-border)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Signed in as</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  </div>
                  <button 
                    onClick={() => { navigate('/orders'); setIsUserMenuOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <Package size={16} /> My Orders
                  </button>
                  <button 
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'none',
                      border: 'none',
                      color: '#ff4444',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onAuthClick}
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.875rem' }}
            >
              Sign In
            </button>
          )}

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

      <style>{`
        .desktop-links { display: none !important; }
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .nav-link:hover { color: var(--accent-green) !important; text-shadow: 0 0 8px var(--accent-glow); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
