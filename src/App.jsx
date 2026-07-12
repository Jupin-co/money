import React, { useState } from 'react';
import { GalleryProvider } from './data/GalleryContext';
import Hero from './components/Hero';
import GalleryGrid from './components/GalleryGrid';
import GlassModal from './components/GlassModal';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [selected, setSelected] = useState({ item: null, index: 0 });

  return (
    <GalleryProvider>
      <div className="app-container">
        <Hero />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-8) 0' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 'var(--space-4)', fontFamily: 'var(--font-sans)' }}>
              مجموعه
            </h2>
            <GalleryGrid onSelect={(item, index = 0) => setSelected({ item, index })} />
          </motion.div>
        </div>

        <GlassModal 
          item={selected.item} 
          initialIndex={selected.index} 
          onClose={() => setSelected({ item: null, index: 0 })} 
        />
      </div>
    </GalleryProvider>
  );
}

export default App;
