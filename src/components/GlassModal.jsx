import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TelegramLogo, Phone } from 'phosphor-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const AlbumModal = ({ item: initialItem, initialIndex = 0, onClose }) => {
  const isStack = initialItem?.isStack;
  const variants = isStack ? initialItem.variants : [initialItem];
  
  const [[page, direction], setPage] = useState([initialIndex, 0]);

  // Wrap index to always stay within bounds
  const activeIndex = Math.abs(page % variants.length);
  const item = initialItem ? variants[activeIndex] : null;

  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
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

  const variantsAnimation = {
    enter: (direction) => ({
      y: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      rotateZ: direction > 0 ? -5 : 5
    }),
    center: {
      zIndex: 1,
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateZ: 0
    },
    exit: (direction) => ({
      zIndex: 0,
      y: direction < 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      rotateZ: direction < 0 ? 5 : -5
    })
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Smoked Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(244, 240, 230, 0.65)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              zIndex: 100, cursor: 'zoom-out',
              touchAction: 'none', // Prevents iOS Safari from capturing scroll gestures
              overscrollBehavior: 'none' // Prevents scroll chaining on modern browsers
            }}
          />
          
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 101, pointerEvents: 'none', padding: 'var(--space-4)'
          }}>
            <motion.div
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0) 100%)',
                backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
                borderTop: '1px solid rgba(255,255,255,0.5)',
                borderLeft: '1px solid rgba(255,255,255,0.5)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                width: '100%', maxWidth: '800px', height: '90vh',
                display: 'flex', flexDirection: 'column',
                pointerEvents: 'auto', position: 'relative',
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8), inset 0 0 100px rgba(255,255,255,0.1)',
                overflow: 'hidden'
              }}
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: '1.5rem', left: '1.5rem',
                  background: 'rgba(30, 26, 22, 0.8)', color: '#FDFBF7',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                  backdropFilter: 'blur(10px)',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                <X size={18} weight="bold" />
              </button>

              <div className="modal-content-layout" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                
                {/* Top Half: Tangible Image Swiping & Zooming Area */}
                <div style={{ flex: '1 1 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden' }}>
                  
                  <TransformWrapper
                    initialScale={1}
                    minScale={1}
                    maxScale={5}
                    centerOnInit={true}
                    wheel={{ step: 0.1 }}
                    doubleClick={{ disabled: true }}
                    pinch={{ step: 5 }}
                    panning={{ disabled: false }}
                    onPinchingStop={(ref) => ref.resetTransform(300, "easeOut")}
                    onPanningStop={(ref) => ref.resetTransform(300, "easeOut")}
                  >
                    {({ state, resetTransform }) => (
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key={page}
                          custom={direction}
                          variants={variantsAnimation}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ y: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                          // Only allow Y drag (swapping) if the user is completely zoomed out!
                          drag={isStack && state.scale === 1 ? "y" : false}
                          dragConstraints={{ top: 0, bottom: 0 }}
                          dragElastic={1}
                          onDragEnd={(e, { offset, velocity }) => {
                            if (state.scale !== 1) return;
                            const swipe = swipePower(offset.y, velocity.y);
                            if (swipe < -swipeConfidenceThreshold) {
                              paginate(1); // Swiping UP shows NEXT item
                            } else if (swipe > swipeConfidenceThreshold) {
                              paginate(-1); // Swiping DOWN shows PREV item
                            }
                          }}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: state.scale > 1 ? 'auto' : (isStack ? 'grab' : 'auto')
                          }}
                          whileDrag={{ cursor: "grabbing", scale: state.scale === 1 ? 0.95 : 1 }}
                        >
                          <motion.div
                            animate={isStack && state.scale === 1 ? {
                              y: [0, -20, 0],
                              transition: { delay: 0.6, duration: 1.5, ease: "easeInOut" }
                            } : {}}
                            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <TransformComponent 
                              wrapperStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <motion.img
                                loading="lazy"
                                decoding="async"
                                animate={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
                                src={item.imageUrl}
                                alt={item.title}
                                style={{ 
                                  width: '100%', height: '100%', objectFit: 'contain', 
                                  pointerEvents: 'auto',
                                  userSelect: 'none', WebkitUserSelect: 'none'
                                }}
                                draggable="false"
                              />
                            </TransformComponent>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </TransformWrapper>

                  {/* Physical Navigation Dots */}
                  {isStack && (
                    <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 10 }}>
                      {variants.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPage([idx, idx > page ? 1 : -1])}
                          style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: activeIndex === idx ? '#1F1A15' : 'rgba(31, 26, 21, 0.2)',
                            border: '1px solid rgba(255,255,255,0.5)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            cursor: 'pointer', padding: 0, transition: 'all 0.3s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Zoom Hint Removed */}
                </div>

                {/* Bottom Half: Acrylic Glass Placard (Label) Section */}
                {/* Notice the padding/background is gone, letting the placard float on the album paper */}
                <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
                  
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: '#EAE5D9', // Warmer, slightly darker physical paper
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
                        padding: '1.5rem',
                        border: '1px solid #D5CDBF', // Natural cardstock border
                        borderBottom: '2px solid #C4BCAE', // Give it a little physical thickness
                        borderRadius: '12px',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)', // Ground the paper heavily
                        position: 'relative'
                      }}
                    >
                      {/* Faux Tape/Pin graphic at top center (now transparent frosty tape) */}
                      <div style={{
                        position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                        width: '45px', height: '22px', background: 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.6)', 
                        borderRadius: '2px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                      }} />

                      <div style={{ color: '#9B8563', fontSize: '0.85rem', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.country} — {item.year}
                      </div>
                      
                      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-sans)', color: '#1F1A15', fontWeight: 600, borderBottom: '1px solid rgba(31, 26, 21, 0.1)', paddingBottom: '0.5rem' }}>
                        {item.title}
                      </h2>
                      
                      <div style={{ margin: '1rem 0', display: 'flex', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#9B8563', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>کیفیت</span>
                          <strong style={{ fontFamily: 'var(--font-sans)', color: '#1F1A15' }}>{item.quality}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#9B8563', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>ارزش</span>
                          <strong style={{ fontFamily: 'var(--font-sans)', color: '#1F1A15' }}>{item.value}</strong>
                        </div>
                        {item.serialNumber && (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#9B8563', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>شماره سریال</span>
                            <strong style={{ fontFamily: 'var(--font-sans)', color: '#1F1A15', letterSpacing: '0.1em' }}>{item.serialNumber}</strong>
                          </div>
                        )}
                      </div>

                      <p style={{ color: '#4A433A', marginTop: '1rem', lineHeight: 1.6, fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>
                        {item.description}
                      </p>
                      
                      {/* Interactive Buttons moved inside the glass card for cleanliness */}
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <a href="https://t.me/yourusername" target="_blank" rel="noreferrer" style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          background: '#1F1A15', color: '#FDFBF7', border: 'none',
                          padding: '0.75rem', fontWeight: 400, fontFamily: 'var(--font-sans)', borderRadius: '6px',
                          transition: 'all 0.2s', textDecoration: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <TelegramLogo size={20} weight="light" />
                          تلگرام
                        </a>
                        <a href="tel:+1234567890" style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          background: 'rgba(255,255,255,0.5)', color: '#1F1A15', border: '1px solid rgba(31, 26, 21, 0.2)',
                          padding: '0.75rem', fontWeight: 400, fontFamily: 'var(--font-sans)', borderRadius: '6px',
                          transition: 'all 0.2s', textDecoration: 'none'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)' }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)' }}
                        >
                          <Phone size={20} weight="light" />
                          تماس
                        </a>
                      </div>

                    </motion.div>
                  </AnimatePresence>

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
