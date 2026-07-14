import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { thumbnailQueue, lowResQueue } from '../utils/imageQueue';

// Extracted inner card component to render twice (Top and Bottom)
const currencyDict = {
  'ایران': 'ریال',
  'امارات': 'درهم',
  'قطر': 'دینار',
  'افغانستان': 'افغانی',
  'سوئیس': 'فرانک',
  'عراق': 'دینار',
  'آلمان': 'مارک',
  'عربستان': 'ریال',
  'پاکستان': 'روپیه',
  'نیجریه': 'نایرا',
  'تایلند': 'بات',
  'روسیه': 'روبل',
  'انگلستان': 'پوند',
  'یوگسلاوی': 'دینار',
  'ایتالیا': 'لیر',
  'فرانسه': 'فرانک'
};

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
        padding: '0.5rem 0.75rem 1rem 0.75rem', background: '#FDFBF7',
        backgroundImage: 'radial-gradient(circle at top left, #FFFFFF 0%, #EAE5D9 100%), url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
        borderTop: '1px solid #D5CDBF', color: '#1F1A15', position: 'relative'
      }}>
        {isStack && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.15rem' }}>
            <div style={{ fontSize: '0.65rem', background: '#110e0c', color: '#EAE5D9', padding: '0.1rem 0.4rem', borderRadius: '10px', fontFamily: 'var(--font-sans)' }}>
              {totalVariants} نسخه
            </div>
          </div>
        )}
        <h3 style={{
          margin: 0,
          fontSize: '1.4rem',
          fontWeight: 400,
          fontFamily: '"Noto Nastaliq Urdu", serif',
          color: '#1c3b72', // Deep fountain pen blue ink
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.8', // Nastaliq requires exceptionally tall line height
          paddingTop: '0.1rem',
          paddingBottom: '0.4rem' // Extra space for deep descenders
        }}>
          {variant.country && variant.country !== 'Unknown'
            ? `${variant.country} - ${variant.value} ${currencyDict[variant.country] || ''}`
            : variant.value}
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

  const renderPagination = () => {
    if (!isStack || len <= 1) return null;

    let windowStart = 0;
    let windowEnd = len - 1;
    const maxVisible = 7;

    if (len > maxVisible) {
      if (activeIndex <= 3) {
        windowStart = 0;
        windowEnd = 6;
      } else if (activeIndex >= len - 4) {
        windowStart = len - maxVisible;
        windowEnd = len - 1;
      } else {
        windowStart = activeIndex - 3;
        windowEnd = activeIndex + 3;
      }
    }

    const dots = [];
    for (let idx = windowStart; idx <= windowEnd; idx++) {
      let scale = 1;
      let opacity = activeIndex === idx ? 0.9 : 0.3;

      if (len > maxVisible) {
        if (idx === windowStart && windowStart > 0) {
          scale = 0.5;
          opacity = 0.2;
        } else if (idx === windowStart + 1 && windowStart > 0) {
          scale = 0.8;
          opacity = 0.25;
        }

        if (idx === windowEnd && windowEnd < len - 1) {
          scale = 0.5;
          opacity = 0.2;
        } else if (idx === windowEnd - 1 && windowEnd < len - 1) {
          scale = 0.8;
          opacity = 0.25;
        }
      }

      dots.push(
        <div
          key={idx}
          style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'rgba(255,255,255,1)',
            opacity: opacity,
            transform: `scale(${scale})`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
        />
      );
    }

    return (
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px', zIndex: 20, alignItems: 'center', height: '6px' }}>
        {dots}
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 0.98, y: -5 }}
      style={{
        position: 'relative',
        cursor: isStack ? 'grab' : 'pointer',
      }}
    >
      {/* Visual Stack Effect Layers - permanently behind everything */}
      {isStack && (
        <>
          {variants.length >= 4 && (
            <div style={{
              position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
              background: '#DCD6C8', borderTop: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.5)', zIndex: -2,
              transform: 'scale(0.91) rotate(-1.5deg) translateY(45px)', borderRadius: '12px'
            }} />
          )}
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

      {/* Invisible static card to maintain exact container height */}
      <div style={{ opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}>
        <CardContent variant={variants[0]} isStack={isStack} totalVariants={variants.length} />
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {renderPagination()}
        <AnimatePresence initial={false} custom={direction}>
          {variants
            .map((variant, idx) => {
              let depth = -1;
              if (idx === activeIndex) depth = 0;
              else if (idx === (activeIndex + 1) % len) depth = 1;
              else if (idx === (activeIndex + 2) % len) depth = 2;

              if (!isStack) depth = 0;
              return { variant, idx, depth };
            })
            .filter(item => item.depth !== -1)
            .map(({ variant, idx, depth }) => {
            const isTop = depth === 0;

            return (
              <motion.div
                key={idx}
                custom={direction}
                initial={
                  direction > 0
                    ? { scale: 0.9, y: 40, opacity: 0, x: 0 }
                    : { scale: 1, y: 0, opacity: 0, x: -300 }
                }
                animate={{
                  scale: depth === 0 ? 1 : depth === 1 ? 0.97 : 0.94,
                  y: depth === 0 ? 0 : depth === 1 ? 15 : 30,
                  rotate: depth === 0 ? 0 : depth === 1 ? -1 : 1,
                  opacity: 1,
                  zIndex: 10 - depth,
                  x: 0
                }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ 
                  type: 'spring', stiffness: 300, damping: 30,
                  zIndex: { delay: depth === 0 ? 0 : 0.15 } 
                }}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  cursor: isStack && isTop ? 'grab' : (isTop ? 'pointer' : 'default'),
                  pointerEvents: isTop ? 'auto' : 'none'
                }}
                drag={isStack ? "x" : false}
                dragListener={isTop}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onClick={() => isTop && onClick(item, activeIndex)}
                onDrag={(e, info) => setDragOffset(info.offset.x)}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -50) paginate(1);
                  else if (offset.x > 50) paginate(-1);
                  else setDragOffset(0);
                }}
                whileDrag={isTop ? { cursor: "grabbing" } : {}}
              >
                <CardContent variant={variant} isStack={isStack} totalVariants={variants.length} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ImageCard;
