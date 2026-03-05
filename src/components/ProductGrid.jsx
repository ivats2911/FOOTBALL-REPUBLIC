import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabase';

const ProductGrid = ({ onAddToCart, onBuyNow }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="shop" style={{ padding: '80px 0', background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>GRAPHIC <span className="text-gradient">TEES</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>
            Browse our latest original drops. Unique football-inspired streetwear designed for the modern fan.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'var(--accent-green)' }}>
             <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading custom designs from store...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
             <p style={{ fontSize: '1.25rem' }}>No designs found in the database.</p>
             <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Use the Admin Panel to add your first product!</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={onAddToCart} 
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
