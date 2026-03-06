import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle, AlertCircle, Lock, ArrowLeft, Shirt, Trash2, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: 'ORIGINAL',
    category: 'T-Shirts',
    price: '',
    description: '',
    image_url: '',
    design_scale: 50,
    design_x: 50,
    design_y: 35,
    use_mockup: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchProducts = async () => {
    setFetchingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setFetchingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect passcode');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // If it's a full image, set default scale to 100
      if (!formData.use_mockup) {
        setFormData(prev => ({ ...prev, design_scale: 100, design_x: 50, design_y: 50 }));
      }
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      console.log('Attempting upload to bucket "Products" at path:', filePath);

      let { error: uploadError, data } = await supabase.storage
        .from('Products')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Supabase Storage Upload Error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('Products')
        .getPublicUrl(filePath);

      console.log('Upload successful! Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Caught error during image upload process:', error);
      throw new Error('Error uploading image: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      if (!formData.name || !formData.price || !formData.description) {
        throw new Error('Please fill out all required fields.');
      }

      let finalImageUrl = formData.image_url;

      if (imageFile) {
        setStatus({ type: 'loading', message: 'Uploading image...' });
        finalImageUrl = await uploadImage(imageFile);
      }

      const productToInsert = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: finalImageUrl,
        design_scale: parseInt(formData.design_scale),
        design_x: parseInt(formData.design_x),
        design_y: parseInt(formData.design_y),
        use_mockup: formData.use_mockup
      };

      const { error } = await supabase
        .from('products')
        .insert([productToInsert]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Product published to store!' });
      fetchProducts(); // Refresh the list
      
      setFormData({
        name: '', brand: 'ORIGINAL', category: 'T-Shirts', price: '', description: '', image_url: '',
        design_scale: 50, design_x: 50, design_y: 35, use_mockup: true
      });
      setImageFile(null);
      setPreviewUrl(null);
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error adding product:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to add product.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Immediately refresh the list from the server to confirm deletion
      await fetchProducts();
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    }
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <Lock size={48} color="var(--accent-green)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Access</h2>
          <div style={{ width: '100%' }}>
            <input 
              type="password" 
              placeholder="Enter Passcode (admin123)" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Unlock Dashboard
          </button>
          <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </form>
      </div>
    );
  }

  // Render Upload Dashboard if authenticated
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Upload <span className="text-gradient">Design</span>
          </h1>
          <Link to="/" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={18} /> View Store
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
          <div className="glass-panel" style={{ padding: '40px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', marginBottom: '8px' }}>
                <label style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="use_mockup" checked={formData.use_mockup} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-green)' }} />
                  Use Auto-Mockup (T-Shirt Background)
                </label>
              </div>

              <div>
                <label style={labelStyle}>Design Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="e.g. Total Football Graphic Tee" />
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 150px' }}>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input required name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} style={inputStyle} placeholder="2999.00" />
                </div>
                <div style={{ flex: '1 1 150px' }}>
                  <label style={labelStyle}>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Retro Tees">Retro Tees</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Tell the story..." />
              </div>

              <div>
                <label style={labelStyle}>{formData.use_mockup ? 'Upload Logo/Design' : 'Upload Full Product Photo'}</label>
                <div style={{
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  background: imageFile ? 'rgba(0, 255, 102, 0.05)' : 'transparent',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('image-upload').click()}>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Upload size={24} color={imageFile ? 'var(--accent-green)' : 'var(--text-secondary)'} />
                  <div style={{ color: imageFile ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
                    {imageFile ? imageFile.name : 'Select file'}
                  </div>
                </div>
              </div>

              {imageFile && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-green)' }}>
                    {formData.use_mockup ? 'Design Alignment' : 'Photo Zoom & Framing'}
                  </h3>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <label>Scale / Zoom ({formData.design_scale}%)</label>
                    </div>
                    <input type="range" name="design_scale" min={formData.use_mockup ? "10" : "50"} max={formData.use_mockup ? "100" : "300"} value={formData.design_scale} onChange={handleChange} style={{ width: '100%' }} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <label>Position X ({formData.design_x}%)</label>
                    </div>
                    <input type="range" name="design_x" min="0" max="100" value={formData.design_x} onChange={handleChange} style={{ width: '100%' }} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <label>Position Y ({formData.design_y}%)</label>
                    </div>
                    <input type="range" name="design_y" min="0" max="100" value={formData.design_y} onChange={handleChange} style={{ width: '100%' }} />
                  </div>
                </div>
              )}

              {status.message && (
                <div style={{ 
                  padding: '16px', borderRadius: '8px', 
                  background: status.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,102,0.1)',
                  color: status.type === 'error' ? '#ff4444' : 'var(--accent-green)',
                  display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem'
                }}>
                  {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                  {status.message}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '16px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
                <Upload size={20} />
                {loading ? 'Publishing...' : 'Publish to Live Store'}
              </button>
            </form>
          </div>

          {/* Real-time Preview */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>{formData.use_mockup ? 'Mockup Preview' : 'Photo Framing Preview'}</h2>
            <div style={{ 
              aspectRatio: '1/1', 
              background: '#020617', 
              borderRadius: '24px',
              border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
              {formData.use_mockup && (
                <img src="/tshirt mockup.png" style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} alt="Mockup" />
              )}
              
              {previewUrl && (
                <div style={{
                  position: 'absolute',
                  top: `${formData.design_y}%`,
                  left: `${formData.design_x}%`,
                  width: `${formData.design_scale}%`,
                  height: formData.use_mockup ? 'auto' : `${formData.design_scale}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  mixBlendMode: formData.use_mockup ? 'multiply' : 'normal',
                  opacity: formData.use_mockup ? 0.9 : 1,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src={previewUrl} style={{ 
                    width: '100%', 
                    height: formData.use_mockup ? 'auto' : '100%',
                    objectFit: formData.use_mockup ? 'contain' : 'cover' 
                  }} alt="Design preview" />
                </div>
              )}
              
              {!previewUrl && (
                <div style={{ position: 'absolute', zIndex: 2, color: 'var(--text-secondary)', textAlign: 'center' }}>
                  <Shirt size={48} opacity={0.2} style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.875rem' }}>Upload file to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manage Products Section */}
        <div className="glass-panel" style={{ marginTop: '60px', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LayoutGrid size={24} color="var(--accent-green)" />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Manage Store Inventory</h2>
              {fetchingProducts && (
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--accent-green)', 
                  background: 'rgba(0, 255, 102, 0.1)', 
                  padding: '4px 12px', 
                  borderRadius: '20px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)' }} />
                  Refreshing...
                </span>
              )}
            </div>
            <button 
              onClick={fetchProducts} 
              disabled={fetchingProducts}
              className="btn-outline" 
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Manual Refresh
            </button>
          </div>

          {fetchingProducts && products.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
          ) : products.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No products in the store yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
              {products.map(product => (
                <div key={product.id} style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '12px', 
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ 
                    aspectRatio: '1/1', 
                    background: '#1a2233', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Shirt size={24} color="var(--text-secondary)" />
                    )}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                      ₹{product.price}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{ 
                      marginTop: '4px',
                      background: 'rgba(255, 68, 68, 0.1)',
                      color: '#ff4444',
                      border: '1px solid rgba(255, 68, 68, 0.2)',
                      borderRadius: '6px',
                      padding: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#ff4444'; e.currentTarget.style.color = '#fff' }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'; e.currentTarget.style.color = '#ff4444' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

// Inline styles
const labelStyle = {
  display: 'block',
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  marginBottom: '8px',
  fontWeight: 500
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  color: 'white',
  fontFamily: 'inherit',
  fontSize: '1rem',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  outline: 'none'
};

export default AdminPanel;
