import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { thumbnailQueue, lowResQueue } from '../utils/imageQueue';

const swipeConfidenceThreshold = 5000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const ImageCard = ({ item, onClick }) => {
  const isStack = item.isStack;
  const variants = isStack ? item.variants : [item];
  
  const [[page, direction], setPage] = useState([0, 0]);
  const activeIndex = Math.abs(page % variants.length);
  const currentVariant = variants[activeIndex];

  const [currentSrc, setCurrentSrc] = useState(null);
  const [isLowResLoaded, setIsLowResLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLowResLoaded(false);

    thumbnailQueue.add(currentVariant.thumbnailUrl, (src) => {
      if (mounted && !isLowResLoaded) {
        setCurrentSrc(src);
        
        lowResQueue.add(currentVariant.lowResUrl, (lowResSrc) => {
          if (mounted) {
            setCurrentSrc(lowResSrc);
            setIsLowResLoaded(true);
          }
        });
      }
    });

    return () => { mounted = false; };
  }, [currentVariant]);

  const paginate = (newDirection) => {
    if (!isStack) return;
    const nextIndex = page + newDirection;
    if (nextIndex < 0 || nextIndex >= variants.length) return; // Prevent swiping past edges
    setPage([nextIndex, newDirection]);
  };

  const variantsAnimation = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      zIndex: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    })
  };

  return (
    <motion.div
      whileHover={{ scale: 0.98, y: -5 }}
      style={{
        position: 'relative',
        cursor: isStack ? 'grab' : 'pointer',
      }}
    >
      {/* Visual Stack Effect Layers - stay still at the bottom */}
      {isStack && (
        <>
          <div style={{
            position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', zIndex: -2, rotate: '-3deg', borderRadius: '12px'
          }} />
          <div style={{
            position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', zIndex: -1, rotate: '1.5deg', borderRadius: '12px'
          }} />
        </>
      )}

      {/* Grid Stacking Trick: Prevents the wrapper from losing height during animation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variantsAnimation}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            drag={isStack ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onClick={() => onClick(item, activeIndex)}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            style={{
              gridColumn: 1, // Force into same grid cell
              gridRow: 1,    // Force into same grid cell
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0) 100%)',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderLeft: '1px solid rgba(255,255,255,0.3)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
            whileDrag={{ cursor: "grabbing" }}
          >
            {/* Miniature Navigation Dots */}
            {isStack && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px', zIndex: 10 }}>
                {variants.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: activeIndex === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Image Area */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
              {currentSrc && (
                <motion.img
                  src={currentSrc}
                  alt={currentVariant.title}
                  animate={{ filter: isLowResLoaded ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.5)) blur(0px)' : 'blur(5px)', opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute', top: '5%', left: '5%',
                    width: '90%', height: '90%', objectFit: 'contain',
                    pointerEvents: 'none'
                  }}
                  draggable="false"
                />
              )}
            </div>

            {/* Physical Paper Label */}
            <div style={{ 
              padding: '1rem', 
              background: '#EAE5D9', 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
              borderTop: '1px solid #D5CDBF',
              color: '#1F1A15',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#9B8563', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                  {currentVariant.country} • {currentVariant.year}
                </div>
                {isStack && (
                  <div style={{ fontSize: '0.7rem', background: '#110e0c', color: '#EAE5D9', padding: '0.1rem 0.4rem', borderRadius: '10px', fontFamily: 'var(--font-sans)' }}>
                    {variants.length} نسخه
                  </div>
                )}
              </div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '1rem', 
                fontWeight: 600, 
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentVariant.title}
              </h3>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ImageCard;
