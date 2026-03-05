import React from 'react';
import { ArrowRight, Star, Shirt } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div id="home" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      paddingTop: '80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '400px',
        height: '400px',
        background: 'var(--accent-glow)',
        filter: 'blur(120px)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px',
        alignItems: 'center'
      }}>
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            <Star size={16} fill="var(--accent-green)" />
            <span>Football Inspired Tees</span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            WEAR THE <br />
            <span className="text-gradient">BEAUTIFUL GAME</span>
          </h1>
          
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.125rem', 
            maxWidth: '480px',
            lineHeight: 1.6 
          }}>
            Discover our exclusive collection of graphic t-shirts inspired by football culture. Premium streetwear designed for fans who live the game every day, on and off the pitch.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button className="btn-primary" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>
              Explore Designs <ArrowRight size={18} />
            </button>
            <button className="btn-outline">
              View Lookbook
            </button>
          </div>
          
          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--glass-border)' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>100%</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Original Art</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>50+</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Exclusive Designs</div>
            </div>
          </div>
        </motion.div>

        {/* Visual Content / Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          className="hero-image-container"
        >
          {/* Main 3D Card effect */}
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '420px',
            aspectRatio: '3/4',
            position: 'relative',
            background: 'linear-gradient(145deg, rgba(18,25,38,0.8) 0%, rgba(10,14,23,0.9) 100%)',
            border: '1px solid rgba(0, 255, 102, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 255, 102, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
            transition: 'transform 0.5s ease',
          }}>
            {/* The actual image would go here. Using a placeholder for now */}
            <div style={{ 
              width: '80%', 
              height: '80%', 
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px'
            }}>
               <Shirt size={120} color="var(--accent-green)" />
               <span style={{ fontWeight: 600, fontSize: '1.25rem', letterSpacing: '1px' }}>ULTRA-SOFT GRAPHIC TEE</span>
            </div>
            
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
               <div>
                 <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Featured</div>
                 <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>Classic Pitch Tee</div>
               </div>
               <div style={{ fontWeight: 800, color: 'var(--accent-green)', fontSize: '1.25rem' }}>₹2,999</div>
            </div>
          </div>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .container {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .container > div {
            align-items: center !important;
          }
          .hero-image-container {
            margin-top: 40px;
          }
        }
        .hero-image-container > div:hover {
          transform: perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(-10px) !important;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
