import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useGalleryData } from '../data/GalleryContext';
import ImageCard from './ImageCard';
import { motion } from 'framer-motion';

const filterLabels = {
  'all': 'همه',
  'paper_money': 'اسکناس',
  'coin': 'سکه',
  'stamp': 'تمبر'
};

const BATCH_SIZE = 50;

// Removed groupItems to show all items separately

const GalleryGrid = ({ onSelect }) => {
  const { items, loading } = useGalleryData();
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const observerTarget = useRef(null);

  // Filter and sort items
  const processedItems = useMemo(() => {
    const filtered = filter === 'all' ? items : items.filter(item => item.type === filter);
    // Sort alphabetically by country, then title
    return filtered.sort((a, b) => {
      if (a.country !== b.country) {
        return a.country.localeCompare(b.country, 'fa');
      }
      return a.title.localeCompare(b.title, 'fa');
    });
  }, [items, filter]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filter]);

  // Infinite Scroll Observer (Appending, not unmounting)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + BATCH_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--muted-foreground)' }}>
        در حال بارگذاری...
      </div>
    );
  }

  const visibleItems = processedItems.slice(0, visibleCount);

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
        {Object.entries(filterLabels).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              color: filter === type ? 'var(--foreground)' : 'var(--muted-foreground)',
              fontWeight: filter === type ? 500 : 400,
              padding: 0,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'calc(var(--space-4) * 2)',
          padding: '1rem 0'
        }}
      >
        {visibleItems.map(item => (
          <ImageCard key={item.id} item={item} onClick={onSelect} />
        ))}
      </motion.div>
      
      {/* Sentinel for infinite scroll */}
      {visibleCount < processedItems.length && (
        <div ref={observerTarget} style={{ height: '50px', marginTop: '1rem' }} />
      )}
    </div>
  );
};

export default GalleryGrid;
