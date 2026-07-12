import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TelegramLogo, Phone } from 'phosphor-react';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const AlbumModal = ({ item: initialItem, onClose }) => {
  const isStack = initialItem?.isStack;
  const variants = isStack ? initialItem.variants : [initialItem];
  
  const [[page, direction], setPage] = useState([0, 0]);

  // Wrap index to always stay within bounds
  const activeIndex = Math.abs(page % variants.length);
  const item = initialItem ? variants[activeIndex] : null;

  const [currentSrc, setCurrentSrc] = useState(null);
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
      setCurrentSrc(item.lowResUrl);
      setIsHighResLoaded(false);

      const img = new Image();
      img.src = item.highResUrl;
      img.onload = () => {
        setCurrentSrc(item.highResUrl);
        setIsHighResLoaded(true);
      };
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [item]);

  const paginate = (newDirection) => {
    if (!isStack) return;
    const nextIndex = page + newDirection;
    if (nextIndex < 0 || nextIndex >= variants.length) return;
    setPage([nextIndex, newDirection]);
  };

  // Card slide-to-bottom animation (like dealing money)
  const variantsAnimation = {
    enter: (direction) => {
      return {
        y: direction > 0 ? -300 : 300,
        opacity: 0,
        scale: 0.9,
        rotateZ: direction > 0 ? -5 : 5
      };
    },
    center: {
      zIndex: 1,
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateZ: 0
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        y: direction < 0 ? -300 : 300, // Slide down/up to swap
        opacity: 0,
        scale: 0.8,
        rotateZ: direction < 0 ? 5 : -5
      };
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(15, 15, 15, 0.85)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              zIndex: 100, cursor: 'zoom-out'
            }}
          />
          
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 101, pointerEvents: 'none', padding: 'var(--space-4)'
          }}>
            <motion.div
              layoutId={isStack ? `card-${initialItem.id}` : `card-${item.id}`}
              style={{
                background: '#FDFBF7',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
                border: '1px solid #EAE3D5',
                borderRadius: '4px',
                width: '100%', maxWidth: '800px', height: '90vh',
                display: 'flex', flexDirection: 'column', // VERTICAL LAYOUT
                pointerEvents: 'auto', position: 'relative',
                boxShadow: '0 30px 60px -10px rgba(0,0,0,0.6), inset 0 0 100px rgba(0,0,0,0.03)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: '1.5rem', left: '1.5rem',
                  background: '#2A2A2A', color: '#FDFBF7',
                  border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)'
                }}
              >
                <X size={16} weight="bold" />
              </button>

              <div className="modal-content-layout" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                
                {/* Top Half: Tangible Image Swiping Area */}
                <div style={{ flex: '1 1 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden' }}>
                  
                  {/* Subtle shake animation on mount to hint at draggability */}
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={page}
                      custom={direction}
                      variants={variantsAnimation}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ y: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                      drag={isStack ? "y" : false} // VERTICAL DRAG
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.y, velocity.y);
                        if (swipe < -swipeConfidenceThreshold) {
                          paginate(-1); // swipe up
                        } else if (swipe > swipeConfidenceThreshold) {
                          paginate(1); // swipe down
                        }
                      }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isStack ? 'grab' : 'auto'
                      }}
                      whileDrag={{ cursor: "grabbing", scale: 0.95 }}
                    >
                      {/* Inner wrapper for the shake hint */}
                      <motion.div
                        animate={isStack ? {
                          y: [0, -20, 0],
                          transition: { delay: 0.6, duration: 1.5, ease: "easeInOut" }
                        } : {}}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <motion.img
                          initial={{ filter: 'blur(2px)' }}
                          animate={{ filter: isHighResLoaded ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.3)) blur(0px)' : 'drop-shadow(0 20px 40px rgba(0,0,0,0.3)) blur(2px)' }}
                          src={currentSrc}
                          alt={item.title}
                          style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', pointerEvents: 'none' }}
                          draggable="false"
                        />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Physical Navigation Dots */}
                  {isStack && (
                    <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 10 }}>
                      {variants.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPage([idx, idx > page ? 1 : -1])}
                          style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: activeIndex === idx ? '#4A4A4A' : '#C4C4C4',
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                            cursor: 'pointer', padding: 0, transition: 'all 0.3s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Half: Physical Placard (Label) Section */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#EFEBE2', borderTop: '1px solid #D8CFC0' }}>
                  
                  {/* We add a key here so Framer Motion animates the text change when swapping! */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: '#FDFBF7',
                        padding: '1.5rem',
                        border: '1px solid #D8CFC0',
                        borderRadius: '2px',
                        boxShadow: '2px 2px 10px rgba(0,0,0,0.05), inset 0 0 20px rgba(0,0,0,0.02)',
                        position: 'relative'
                      }}
                    >
                      {/* Faux Tape/Pin graphic at top center */}
                      <div style={{
                        position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                        width: '40px', height: '20px', background: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }} />

                      <div style={{ color: '#8C7F6B', fontSize: '0.85rem', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.country} — {item.year}
                      </div>
                      
                      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-sans)', color: '#2C2C2C', fontWeight: 600, borderBottom: '1px solid #D8CFC0', paddingBottom: '0.5rem' }}>
                        {item.title}
                      </h2>
                      
                      <div style={{ margin: '1rem 0', display: 'flex', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#8C7F6B', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>کیفیت</span>
                          <strong style={{ fontFamily: 'var(--font-sans)', color: '#2C2C2C' }}>{item.quality}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#8C7F6B', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>ارزش</span>
                          <strong style={{ fontFamily: 'var(--font-sans)', color: '#2C2C2C' }}>{item.value}</strong>
                        </div>
                        {item.serialNumber && (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#8C7F6B', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>شماره سریال</span>
                            <strong style={{ fontFamily: 'var(--font-sans)', color: '#2C2C2C', letterSpacing: '0.1em' }}>{item.serialNumber}</strong>
                          </div>
                        )}
                      </div>

                      <p style={{ color: '#5C5446', marginTop: '1rem', lineHeight: 1.6, fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>
                        {item.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <a href="https://t.me/yourusername" target="_blank" rel="noreferrer" style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      background: '#2C2C2C', color: '#FDFBF7', border: 'none',
                      padding: '0.75rem', fontWeight: 400, fontFamily: 'var(--font-sans)', borderRadius: '2px',
                      transition: 'all 0.2s', textDecoration: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <TelegramLogo size={20} weight="light" />
                      تلگرام
                    </a>
                    <a href="tel:+1234567890" style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      background: 'transparent', color: '#2C2C2C', border: '1px solid #2C2C2C',
                      padding: '0.75rem', fontWeight: 400, fontFamily: 'var(--font-sans)', borderRadius: '2px',
                      transition: 'all 0.2s', textDecoration: 'none'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <Phone size={20} weight="light" />
                      تماس
                    </a>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlbumModal;
