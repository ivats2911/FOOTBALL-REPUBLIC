import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ScrollingFootball = () => {
  const { scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Roll from left to right across the screen
  // -100px start to 100% width - 100px end
  const x = useTransform(smoothProgress, [0, 1], ['-5%', '95%']);
  
  // Rotate based on progress (multiple full turns)
  const rotate = useTransform(smoothProgress, [0, 1], [0, 1080]);

  // Subtle bounce as it "rolls"
  const y = useTransform(smoothProgress, (p) => Math.sin(p * 50) * 5);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: 0,
      right: 0,
      height: '80px',
      zIndex: 50,
      pointerEvents: 'none',
      overflow: 'hidden', // Contain the ball to the bottom track
    }}>
      {/* Visual track / "grass" hint (Optional, very subtle) */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '24px',
        right: '24px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--accent-green), transparent)',
        opacity: 0.1
      }} />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '20px',
          x,
          y,
          rotate,
          filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.4))'
        }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent-green, #10b981)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main Ball Outer */}
          <circle cx="12" cy="12" r="10" strokeWidth="1"></circle>
          
          {/* Soccer Ball Hexagon pattern */}
          <path d="M12 12l3-2.5 1.5 3-2 3H9.5l-2-3 1.5-3z" fill="rgba(0, 255, 102, 0.05)"></path>
          <path d="M12 12V6.5" stroke="var(--accent-green)"></path>
          <path d="M15 9.5l4-1.5"></path>
          <path d="M16.5 12.5l3.5 2.5"></path>
          <path d="M12 15l-1 5"></path>
          <path d="M7.5 12.5L4 15"></path>
          <path d="M9 9.5L5 8"></path>
          
          {/* Subtle inner lines to define panels better */}
          <circle cx="12" cy="12" r="4" stroke="var(--accent-green)" strokeDasharray="1 2" opacity="0.3"></circle>
        </svg>
        
        {/* Dynamic Shadow that scales with the bounce */}
        <motion.div 
          style={{
            width: '40px',
            height: '6px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            position: 'absolute',
            bottom: '-12px',
            left: '10px',
            scale: useTransform(smoothProgress, (p) => 1 + Math.sin(p * 50) * 0.1),
            filter: 'blur(3px)'
          }}
        />
      </motion.div>
    </div>
  );
};

export default ScrollingFootball;
