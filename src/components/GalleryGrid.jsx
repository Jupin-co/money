import React, { useState } from 'react';
import { useGalleryData } from '../data/GalleryContext';
import ImageCard from './ImageCard';
import { motion } from 'framer-motion';

const GalleryGrid = ({ onSelect }) => {
  const { items, loading } = useGalleryData();
  const [filter, setFilter] = useState('all');

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--muted-foreground)' }}>
        Loading archives...
      </div>
    );
  }

  const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter);

  return (
    <div style={{ paddingTop: 'var(--space-16)' }}>
      {/* Minimalist filter controls */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-4)', 
        marginBottom: 'var(--space-8)',
        borderBottom: '1px solid var(--border)',
        paddingBottom: 'var(--space-4)'
      }}>
        {['all', 'paper_money', 'coin', 'stamp'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              textTransform: 'capitalize',
              color: filter === type ? 'var(--foreground)' : 'var(--muted-foreground)',
              fontWeight: filter === type ? 500 : 400,
              padding: 0,
            }}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-4)'
        }}
      >
        {filteredItems.map(item => (
          <ImageCard key={item.id} item={item} onClick={onSelect} />
        ))}
      </motion.div>
    </div>
  );
};

export default GalleryGrid;
