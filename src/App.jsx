import React, { useState } from 'react';
import { GalleryProvider } from './data/GalleryContext';
import Hero from './components/Hero';
import GalleryGrid from './components/GalleryGrid';
import GlassModal from './components/GlassModal';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [selectedItem, setSelectedItem] = useState(null);

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
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 'var(--space-4)' }}>
              The Collection
            </h2>
            <GalleryGrid onSelect={setSelectedItem} />
          </motion.div>
        </div>

        <GlassModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    </GalleryProvider>
  );
}

export default App;
