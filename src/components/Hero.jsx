import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { thumbnailQueue, lowResQueue, highResQueue } from '../utils/imageQueue';

const R2_BASE = 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/';

const Hero = () => {
  const { scrollY } = useScroll();
  
  // Progressive loading state
  const [frontSrc, setFrontSrc] = useState(null);
  const [backSrc, setBackSrc] = useState(null);
  const [isFrontLoaded, setIsFrontLoaded] = useState(false);
  const [isBackLoaded, setIsBackLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Load Front
    thumbnailQueue.add(`${R2_BASE}coin-front_thumb.png`, (thumbSrc) => {
      if (!mounted) return;
      setFrontSrc(prev => prev ? prev : thumbSrc);
      
      lowResQueue.add(`${R2_BASE}coin-front_lr.png`, (lrSrc) => {
        if (!mounted) return;
        setFrontSrc(lrSrc);
        setIsFrontLoaded(true);
        
        highResQueue.add(`${R2_BASE}coin-front_hr.png`, (hrSrc) => {
          if (mounted) setFrontSrc(hrSrc);
        });
      });
    });

    // Load Back
    thumbnailQueue.add(`${R2_BASE}coin-back_thumb.png`, (thumbSrc) => {
      if (!mounted) return;
      setBackSrc(prev => prev ? prev : thumbSrc);
      
      lowResQueue.add(`${R2_BASE}coin-back_lr.png`, (lrSrc) => {
        if (!mounted) return;
        setBackSrc(lrSrc);
        setIsBackLoaded(true);
        
        highResQueue.add(`${R2_BASE}coin-back_hr.png`, (hrSrc) => {
          if (mounted) setBackSrc(hrSrc);
        });
      });
    });

    return () => { mounted = false; };
  }, []);

  // Create parallax and rotation effects tied to scroll
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Rotate the coin from 0 to 180 degrees (Front to Back)
  const rotateY = useTransform(scrollY, [0, 400], [0, 180], { clamp: true });
  const scale = useTransform(scrollY, [0, 400], [1, 1.2], { clamp: true });

  // Ambient light "Sun" parallax effect (Right to Left arc)
  const lightX = useTransform(scrollY, [0, 600], ['300px', '-300px'], { clamp: true });
  const lightY = useTransform(scrollY, [0, 300, 600], ['100px', '-50px', '100px'], { clamp: true });

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
        
        {/* Visual elements container - positions everything relative to the exact center of the coin */}
        <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Ambient Sunset Light behind the coin */}
          <motion.div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 180, 70, 0.3) 0%, rgba(200, 100, 20, 0.1) 50%, rgba(0,0,0,0) 80%)',
            filter: 'blur(80px)',
            x: lightX,
            y: lightY,
            zIndex: 2, // Behind the coin and shadow
            pointerEvents: 'none'
          }} />

          {/* Static shadow behind the coin (incredibly fast to render) */}
          <div style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            zIndex: 5,
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
            backgroundImage: frontSrc ? `url(${frontSrc})` : 'none',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transform: 'translateZ(4px)',
            filter: isFrontLoaded ? 'none' : 'blur(5px)',
            transition: 'filter 0.3s ease',
            opacity: frontSrc ? 1 : 0
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
            backgroundImage: backSrc ? `url(${backSrc})` : 'none',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transform: 'rotateY(180deg) translateZ(4px)',
            filter: isBackLoaded ? 'none' : 'blur(5px)',
            transition: 'filter 0.3s ease',
            opacity: backSrc ? 1 : 0
          }} />
        </motion.div>
        </div>
        
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
