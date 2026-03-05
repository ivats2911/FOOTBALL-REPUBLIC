import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import CartOverlay from './components/CartOverlay';
import AdminPanel from './components/AdminPanel';
import ScrollingFootball from './components/ScrollingFootball';

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState(() => {
    const saved = localStorage.getItem('republic-cart');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('republic-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === product.size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.size === product.size) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const handleUpdateQuantity = (id, size, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id && item.size === size) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  const cartTotalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar 
              onCartClick={() => setIsCartOpen(true)} 
              cartCount={cartTotalItems}
            />
            
            <main>
              <HeroSection />
              <ProductGrid onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
            </main>

            <CartOverlay 
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cartItems}
              onRemoveItem={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />

            <footer style={{
              padding: '60px 24px',
              borderTop: '1px solid var(--glass-border)',
              marginTop: '60px',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  FOOTBALL <span style={{ color: 'var(--accent-green)' }}>REPUBLIC</span>
                </div>
                <p>© 2026 Football Republic. All rights reserved.</p>
              </div>
            </footer>
          </>
        } />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <ScrollingFootball />
    </div>
  );
}

export default App;
