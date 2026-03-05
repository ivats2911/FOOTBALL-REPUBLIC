import React, { useState } from 'react';
import { ShoppingBag, Zap, Shirt } from 'lucide-react';

const ProductCard = ({ product, onAdd, onBuyNow }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div style={{
      position: 'relative',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'var(--transition)',
    }}
    className="product-card"
    >
      <div style={{
        aspectRatio: '1/1',
        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px'
      }}>
        
        {/* T-Shirt Mockup Container */}
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Base Mockup Image (Only in mockup mode) */}
          {product.use_mockup !== false && (
            <img 
              src="/tshirt mockup.png" 
              alt="T-shirt Template" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: 1
              }}
            />
          )}

          {/* User Design Overlay */}
          {product.image_url && (
            <div style={{
              position: 'absolute',
              top: `${product.design_y ?? (product.use_mockup !== false ? 35 : 50)}%`,
              left: `${product.design_x ?? 50}%`,
              width: `${product.design_scale ?? (product.use_mockup !== false ? 50 : 100)}%`,
              height: product.use_mockup !== false ? 'auto' : `${product.design_scale ?? 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mixBlendMode: product.use_mockup !== false ? 'multiply' : 'normal',
              opacity: product.use_mockup !== false ? 0.9 : 1
            }}>
              <img 
                src={product.image_url} 
                alt="Design" 
                style={{
                  width: '100%',
                  height: product.use_mockup !== false ? 'auto' : '100%',
                  objectFit: product.use_mockup !== false ? 'contain' : 'cover'
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              {product.category}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {product.name}
            </h3>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{product.price}
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 16px 0', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.description}
        </p>

        {/* Size Selection */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>SELECT SIZE</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: `1px solid ${selectedSize === size ? 'var(--accent-green)' : 'var(--glass-border)'}`,
                  background: selectedSize === size ? 'rgba(0, 255, 102, 0.1)' : 'none',
                  color: selectedSize === size ? 'var(--accent-green)' : 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Final Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            className="btn-outline" 
            onClick={() => onAdd({ ...product, size: selectedSize })}
            style={{ padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ShoppingBag size={16} /> Cart
          </button>
          <button 
            className="btn-primary" 
            onClick={() => onBuyNow({ ...product, size: selectedSize })}
            style={{ padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Zap size={16} /> Buy Now
          </button>
        </div>
      </div>

      <style>{`
        .product-card:hover {
          border-color: rgba(0, 255, 102, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
