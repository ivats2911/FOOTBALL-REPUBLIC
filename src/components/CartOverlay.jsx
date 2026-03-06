import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartOverlay = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(10, 14, 23, 0.8)',
              backdropFilter: 'blur(4px)',
              zIndex: 100
            }}
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '400px',
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--glass-border)',
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '24px', 
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Your Cart</h2>
              <button 
                onClick={onClose}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                  <p>Your cart is empty.</p>
                  <button 
                    className="btn-outline" 
                    style={{ marginTop: '24px' }}
                    onClick={onClose}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {cartItems.map(item => (
                    <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: '#1a2233', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid var(--glass-border)'
                      }}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>No Image</span>
                        )}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{item.name}</h4>
                          <span style={{ fontWeight: 700 }}>₹{item.price}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Size: <b style={{ color: 'var(--accent-green)' }}>{item.size}</b></span>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            background: 'rgba(255,255,255,0.05)', 
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                            padding: '2px'
                          }}>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, item.size, -1)}
                              style={{ 
                                padding: '4px', 
                                color: item.quantity > 1 ? 'var(--text-primary)' : 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: item.quantity > 1 ? 'pointer' : 'not-allowed'
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, item.size, 1)}
                              style={{ 
                                padding: '4px', 
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => onRemoveItem(item.id, item.size)}
                          style={{ 
                            alignSelf: 'flex-start',
                            marginTop: '8px',
                            color: '#ff4444',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: 0.7,
                            transition: 'opacity 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                          onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{ 
                padding: '24px', 
                borderTop: '1px solid var(--glass-border)',
                background: 'rgba(10, 14, 23, 0.5)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700 }}>
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '16px' }}
                  onClick={onCheckout}
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartOverlay;
