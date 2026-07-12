import React from 'react';
import { motion } from 'framer-motion';

const ImageCard = ({ item, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${item.id}`}
      onClick={() => onClick(item)}
      whileHover={{ scale: 0.98, y: -5 }}
      style={{
        cursor: 'pointer',
        background: 'var(--muted)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
        <motion.img
          layoutId={`img-${item.id}`}
          src={item.thumbnailUrl}
          alt={item.title}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          {item.country} • {item.year}
        </div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>{item.title}</h3>
      </div>
    </motion.div>
  );
};

export default ImageCard;
