import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const { scrollY } = useScroll();
  
  // Create parallax and rotation effects tied to scroll
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Rotate the coin from 0 to 180 degrees (Front to Back)
  // Spin is slightly faster now (completes in 400px of scrolling)
  const rotateY = useTransform(scrollY, [0, 400], [0, 180], { clamp: true });
  const scale = useTransform(scrollY, [0, 400], [1, 1.2], { clamp: true });

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
          <h1 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 600, letterSpacing: '-0.02em' }}>
            کلکسیون تاریخ
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '1.25rem', marginTop: '1rem', fontFamily: 'var(--font-sans)' }}>
            مجموعه‌ای بی‌نظیر از سکه، تمبر و اسکناس‌های کمیاب.
          </p>
        </motion.div>
        
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
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
        >
          {/* Front Face (Lion and Sun) - Pushed out to 10.5px to sit on top of edge layers */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'url(./images/coin-front.png) center/contain no-repeat',
            transform: 'translateZ(10.5px)',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))'
          }} />

          {/* The Coin Edge (Ultra-dense layers for 90-degree visibility) */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: i % 2 === 0 ? '#b0b0b0' : '#8a8a8a', // Creates a ridged edge texture
              transform: `translateZ(${(20 - i) * 0.5}px)`,
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
            }} />
          ))}
          
          {/* Back Face (Ahmad Shah Qajar) - Pushed out to 10.5px */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'url(./images/coin-back.png) center/contain no-repeat',
            transform: 'rotateY(180deg) translateZ(10.5px)',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))'
          }} />
        </motion.div>
        
        <motion.div 
          style={{ marginTop: '4rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          تاریخ را ورق بزنید
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
