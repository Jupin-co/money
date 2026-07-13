import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { thumbnailQueue, lowResQueue } from '../utils/imageQueue';

// Extracted inner card component to render twice (Top and Bottom)
const CardContent = ({ variant, isStack, totalVariants }) => {
  const [currentSrc, setCurrentSrc] = useState(null);
  const [isLowResLoaded, setIsLowResLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLowResLoaded(false);

    thumbnailQueue.add(variant.thumbnailUrl, (src) => {
      if (mounted && !isLowResLoaded) {
        setCurrentSrc(src);
        lowResQueue.add(variant.lowResUrl, (lowResSrc) => {
          if (mounted) { setCurrentSrc(lowResSrc); setIsLowResLoaded(true); }
        });
      }
    });

    return () => { mounted = false; };
  }, [variant]);

  return (
    <div style={{
      width: '100%', height: '100%',
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
    }}>
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
        {currentSrc && (
          <motion.img
            src={currentSrc}
            alt={variant.title}
            animate={{ filter: isLowResLoaded ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.5)) blur(0px)' : 'blur(5px)', opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%', objectFit: 'contain', pointerEvents: 'none' }}
            draggable="false"
          />
        )}
      </div>
      <div style={{ 
        padding: '0.5rem 0.75rem', background: '#FDFBF7', 
        backgroundImage: 'radial-gradient(circle at top left, #FFFFFF 0%, #EAE5D9 100%), url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
        borderTop: '1px solid #D5CDBF', color: '#1F1A15', position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#9B8563', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
            {variant.country && variant.country !== 'Unknown' ? variant.country : ''}
            {variant.year && variant.year !== 'Unknown' ? (variant.country && variant.country !== 'Unknown' ? ` • ${variant.year}` : variant.year) : ''}
          </div>
          {isStack && (
            <div style={{ fontSize: '0.65rem', background: '#110e0c', color: '#EAE5D9', padding: '0.1rem 0.4rem', borderRadius: '10px', fontFamily: 'var(--font-sans)' }}>
              {totalVariants} نسخه
            </div>
          )}
        </div>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.4rem', 
          fontWeight: 400, 
          fontFamily: '"Noto Nastaliq Urdu", serif', 
          color: '#1c3b72', // Deep fountain pen blue ink
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          lineHeight: '1.6', // Nastaliq requires tall line height
          paddingTop: '0.1rem',
          paddingBottom: '0.1rem'
        }}>
          {variant.value}
        </h3>
      </div>
    </div>
  );
};

const ImageCard = ({ item, onClick }) => {
  const isStack = item.isStack;
  const variants = isStack ? item.variants : [item];
  
  const [[page, direction], setPage] = useState([0, 0]);
  const [dragOffset, setDragOffset] = useState(0);

  const len = variants.length;
  // Proper array wrapping for negative numbers
  const activeIndex = ((page % len) + len) % len;
  const currentVariant = variants[activeIndex];

  // The bottom card predicts which way the user is dragging!
  const bottomOffset = dragOffset > 0 ? -1 : 1;
  const bottomIndex = (((page + bottomOffset) % len) + len) % len;
  const bottomVariant = variants[bottomIndex];

  const paginate = (newDirection) => {
    if (!isStack) return;
    setPage([page + newDirection, newDirection]);
    setDragOffset(0);
  };

  const variantsAnimation = {
    enter: { scale: 0.95, opacity: 1, x: 0 },
    center: { scale: 1, opacity: 1, x: 0 },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 1,
      transition: { duration: 0.3 }
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
      {/* Visual Stack Effect Layers - dynamically generated based on card count */}
      {isStack && (
        <>
          {/* Card #3 (Behind Bottom Card) */}
          {variants.length >= 3 && (
            <div style={{
              position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
              background: '#EAE5D9', borderTop: '1px solid rgba(255,255,255,0.5)', 
              boxShadow: '0 10px 20px rgba(0,0,0,0.5)', zIndex: -1, 
              transform: 'scale(0.94) rotate(1deg) translateY(30px)', borderRadius: '12px'
            }} />
          )}
          {/* Card #4 */}
          {variants.length >= 4 && (
            <div style={{
              position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
              background: '#DCD6C8', borderTop: '1px solid rgba(255,255,255,0.4)', 
              boxShadow: '0 10px 20px rgba(0,0,0,0.5)', zIndex: -2, 
              transform: 'scale(0.91) rotate(-1.5deg) translateY(45px)', borderRadius: '12px'
            }} />
          )}
          {/* Card #5+ */}
          {variants.length >= 5 && (
            <div style={{
              position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
              background: '#D0C8B6', borderTop: '1px solid rgba(255,255,255,0.3)', 
              boxShadow: '0 10px 20px rgba(0,0,0,0.5)', zIndex: -3, 
              transform: 'scale(0.88) rotate(2deg) translateY(60px)', borderRadius: '12px'
            }} />
          )}
        </>
      )}

      {/* Container maintains exact height dictated by the static bottom card */}
      <div style={{ position: 'relative' }}>
        
        {/* BOTTOM CARD: Static, always rendered, provides height and acts as pre-loader. Also acts visually as Card #2 in the stack! */}
        {/* Increased translate to 15px and scale to 0.97 so it pokes out definitively */}
        <div style={{ opacity: isStack ? 1 : 0, transform: isStack ? 'scale(0.97) rotate(-1deg) translateY(15px)' : 'scale(0.97)', transition: 'transform 0.3s' }}>
          <CardContent variant={bottomVariant} isStack={isStack} totalVariants={variants.length} />
        </div>

        {/* TOP CARD: Draggable, flies off when swiped */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variantsAnimation}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, scale: { duration: 0.2 } }}
            drag={isStack ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onClick={() => onClick(item, activeIndex)}
            onDrag={(e, info) => setDragOffset(info.offset.x)}
            onDragEnd={(e, { offset }) => {
              // Strict distance threshold for flawless desktop and mobile swiping
              if (offset.x < -50) {
                paginate(1);
              } else if (offset.x > 50) {
                paginate(-1);
              } else {
                setDragOffset(0);
              }
            }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              cursor: isStack ? 'grab' : 'pointer',
              zIndex: 10
            }}
            whileDrag={{ cursor: "grabbing" }}
          >
            {isStack && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px', zIndex: 20 }}>
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
            <CardContent variant={currentVariant} isStack={isStack} totalVariants={variants.length} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ImageCard;
