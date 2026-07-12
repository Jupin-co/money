import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { thumbnailQueue, lowResQueue } from '../utils/imageQueue';

const ImageCard = ({ item, onClick }) => {
  // If this item is a stack, use the first variant as the cover
  const coverItem = item.isStack ? item.variants[0] : item;
  
  const [currentSrc, setCurrentSrc] = useState(null); // Start empty to wait for queue
  const [isLowResLoaded, setIsLowResLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Step 1: Queue the thumbnail
    thumbnailQueue.add(coverItem.thumbnailUrl, (src) => {
      if (mounted && !isLowResLoaded) {
        setCurrentSrc(src);
        
        // Step 2: Once thumbnail loads, queue the low-res
        lowResQueue.add(coverItem.lowResUrl, (lowResSrc) => {
          if (mounted) {
            setCurrentSrc(lowResSrc);
            setIsLowResLoaded(true);
          }
        });
      }
    });

    return () => { mounted = false; };
  }, [coverItem]);

  return (
    <motion.div
      layoutId={`card-${coverItem.id}`}
      onClick={() => onClick(item)}
      whileHover={{ scale: 0.98, y: -5 }}
      style={{
        cursor: 'pointer',
        background: 'var(--muted)',
        border: '1px solid var(--border)',
        overflow: 'visible', // Changed to visible for stack shadows
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Visual Stack Effect Layers */}
      {item.isStack && (
        <>
          <div style={{
            position: 'absolute', top: '-4px', left: '-4px', right: '4px', bottom: '4px',
            background: 'var(--border)', border: '1px solid var(--border)', zIndex: -2, rotate: '-2deg'
          }} />
          <div style={{
            position: 'absolute', top: '-2px', left: '-2px', right: '2px', bottom: '2px',
            background: 'var(--muted)', border: '1px solid var(--border)', zIndex: -1, rotate: '1deg'
          }} />
        </>
      )}

      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', background: 'var(--muted)' }}>
        {currentSrc && (
          <motion.img
            layoutId={`img-${coverItem.id}`}
            src={currentSrc}
            alt={coverItem.title}
            animate={{ filter: isLowResLoaded ? 'blur(0px)' : 'blur(5px)', opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
            }}
          />
        )}
      </div>

      <div style={{ padding: 'var(--space-4)', background: 'var(--background)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>
            {coverItem.country} • {coverItem.year}
          </div>
          {item.isStack && (
            <div style={{ fontSize: '0.7rem', background: 'var(--foreground)', color: 'var(--background)', padding: '0.1rem 0.4rem', borderRadius: '10px', fontFamily: 'var(--font-sans)' }}>
              {item.variants.length} نسخه
            </div>
          )}
        </div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>{coverItem.title}</h3>
      </div>
    </motion.div>
  );
};

export default ImageCard;
