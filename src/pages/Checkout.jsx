import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowLeft, Package, CreditCard, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [cartItems, navigate, orderPlaced]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          customer_email: formData.email,
          shipping_address: formData,
          total_amount: total,
          is_guest: !user,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItemsData = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      // 3. Success!
      setOrderId(order.id);
      setOrderPlaced(true);
      clearCart();
      
      // Send "Email" (Mocking since we don't have a mail server configured)
      console.log(`Order Confirmation sent to ${formData.email} for order ${order.id}`);

    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            maxWidth: '500px', 
            width: '100%', 
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            padding: '48px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)'
          }}
        >
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(0, 255, 157, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'var(--accent-green)'
          }}>
            <CheckCircle size={40} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Order Placed!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Thank you for your purchase. We've sent a confirmation email to <b>{formData.email}</b>.
            Your order ID is <code style={{ color: 'white' }}>#{orderId.slice(0, 8)}</code>.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
            
            {!user && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Want to track your order and manage future purchases?
                </p>
                <button 
                  className="btn-outline" 
                  style={{ width: '100%' }}
                  onClick={() => navigate('/?signup=true')}
                >
                  Create an Account
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '120px 24px 60px' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          marginBottom: '32px'
        }}
      >
        <ArrowLeft size={20} /> Back to Store
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px' }}>
        {/* Shipping Form */}
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '32px' }}>Checkout</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Shipping Address</label>
              <textarea
                name="address"
                required
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, Apartment, Suite, etc."
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
            </div>

            <div style={{ 
              marginTop: '16px',
              padding: '24px', 
              background: 'rgba(0, 255, 157, 0.05)', 
              borderRadius: '12px',
              border: '1px dashed var(--accent-green)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-green)', marginBottom: '8px' }}>
                <CreditCard size={20} />
                <span style={{ fontWeight: 600 }}>Payment Method</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                For this demo, we only support Cash on Delivery. Payment will be collected when your package arrives.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? 'Processing Order...' : `Place Order • ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div style={{ 
          background: 'var(--bg-secondary)', 
          borderRadius: '24px', 
          border: '1px solid var(--glass-border)',
          padding: '32px',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', background: '#1a2233', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity} • Size: {item.size}</div>
                </div>
                <div style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--accent-green)' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, marginTop: '12px', color: 'white' }}>
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
