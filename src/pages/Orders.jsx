import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '120px 24px 60px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>My Orders</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track and manage your recent purchases</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 40px', 
          background: 'var(--bg-secondary)', 
          borderRadius: '24px',
          border: '1px solid var(--glass-border)'
        }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Looks like you haven't placed any orders yet.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div 
              key={order.id} 
              style={{ 
                background: 'var(--bg-secondary)', 
                borderRadius: '20px', 
                border: '1px solid var(--glass-border)',
                overflow: 'hidden'
              }}
            >
              {/* Order Header */}
              <div style={{ 
                padding: '20px 24px', 
                background: 'rgba(255,255,255,0.02)', 
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Order Placed</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Amount</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-green)' }}>₹{order.total_amount.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: order.status === 'delivered' ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                      color: order.status === 'delivered' ? 'var(--accent-green)' : '#ffc107',
                      display: 'inline-block',
                      textTransform: 'capitalize'
                    }}>
                      {order.status}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Order #ID: <span style={{ color: 'white' }}>{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {order.order_items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ 
                        width: '70px', 
                        height: '70px', 
                        background: '#1a2233', 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        border: '1px solid var(--glass-border)'
                      }}>
                        <img 
                          src={item.products?.image_url} 
                          alt={item.products?.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>{item.products?.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Qty: {item.quantity} • Price: ₹{item.price_at_purchase}
                        </p>
                      </div>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        onClick={() => navigate(`/`)} // Could navigate to product page
                      >
                        Buy it again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
