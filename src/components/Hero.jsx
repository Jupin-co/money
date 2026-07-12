import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Rotate based on scroll progress
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: '150vh', // Extra height to allow scrolling 
        position: 'relative' 
      }}
    >
      <div 
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <motion.div style={{ opacity, zIndex: 10, textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Numismatica</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '1.25rem', marginTop: '1rem' }}>
            A curated collection of rare history.
          </p>
        </motion.div>
        
        {/* The Gamified Object */}
        <motion.div
          style={{
            rotateY,
            scale,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1000px',
            border: '2px solid rgba(255,255,255,0.5)',
            position: 'relative'
          }}
        >
          {/* Mock content for the coin */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem',
            color: 'rgba(0,0,0,0.1)'
          }}>
            ♕
          </div>
        </motion.div>
        
        <motion.div 
          style={{ opacity, marginTop: '4rem', color: 'var(--muted-foreground)' }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Scroll to explore
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
