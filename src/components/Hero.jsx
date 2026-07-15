import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
// No queue needed

const R2_BASE = 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/';

const Hero = () => {
  const { scrollY } = useScroll();
  
  // Progressive loading state removed - browser handles lazy loading of progressive webp/jpeg natively
  const frontSrc = `${R2_BASE}coin-front.webp`;
  const backSrc = `${R2_BASE}coin-back.webp`;

  // Create parallax and rotation effects tied to scroll
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Rotate the coin from 0 to 180 degrees (Front to Back)
  const rotateY = useTransform(scrollY, [0, 400], [0, 180], { clamp: true });
  const scale = useTransform(scrollY, [0, 400], [1, 1.2], { clamp: true });

  // Ambient light "Sun" parallax effect (Right to Left arc)
  const lightX = useTransform(scrollY, [0, 600], ['25vw', '-25vw'], { clamp: true });
  const lightY = useTransform(scrollY, [0, 300, 600], ['10vw', '-5vw', '10vw'], { clamp: true });

  return (
    <div style={{
      position: 'relative',
      height: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderBottom: '1px solid var(--border)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10
      }}>
        <motion.div style={{ opacity, zIndex: 10, textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            کلکسیون تاریخ
          </h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.7, fontSize: '1.25rem', marginTop: '1rem', fontFamily: 'var(--font-sans)' }}>
            مجموعه‌ای بی‌نظیر از سکه، تمبر و اسکناس‌های کمیاب.
          </p>
        </motion.div>
        
        {/* Visual elements container - positions everything relative to the exact center of the coin */}
        <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Ambient Sunset Light behind the coin */}
          <motion.div style={{
            position: 'absolute',
            width: '150vw', // Responsive size
            height: '150vw',
            maxWidth: '1000px', // Don't let it get too huge on desktop
            maxHeight: '1000px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 180, 70, 0.4) 0%, rgba(200, 100, 20, 0.15) 40%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(60px)',
            x: lightX,
            y: lightY,
            zIndex: 2, // Behind the coin and shadow
            pointerEvents: 'none'
          }} />

          {/* The 3D Gamified Coin */}
          <motion.div
            style={{
              rotateY,
              scale,
              width: '250px',
              height: '250px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              perspective: '1000px',
              cursor: 'pointer',
              zIndex: 10
            }}
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
          >
          {/* Front Face (Lion and Sun) - 4px for an 8px thick coin */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundImage: `url(${frontSrc})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transform: 'translateZ(4px)'
          }} />

          {/* The Coin Edge (8 layers for an 8px thick coin) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: i % 2 === 0 ? '#5a5a5a' : '#3d3d3d', // Darker grey edge
              transform: `translateZ(${3.5 - i}px)` // 3.5 down to -3.5
            }} />
          ))}
          
          {/* Back Face (Ahmad Shah Qajar) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundImage: `url(${backSrc})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transform: 'rotateY(180deg) translateZ(4px)'
          }} />
        </motion.div>
        </div>
        
        <motion.div 
          style={{ marginTop: '4rem', color: 'var(--foreground)', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em' }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          تاریخ را ورق بزنید
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
