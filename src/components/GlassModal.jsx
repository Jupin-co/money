import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TelegramLogo, Phone } from 'phosphor-react';

const GlassModal = ({ item, onClose }) => {
  // Prevent body scroll when modal is open
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

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 100,
              cursor: 'zoom-out'
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 101,
            pointerEvents: 'none',
            padding: 'var(--space-4)'
          }}>
            <motion.div
              layoutId={`card-${item.id}`}
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                width: '100%',
                maxWidth: '1200px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
              >
                <X size={20} />
              </button>

              <div className="modal-content-layout">
                {/* Image Section */}
                <div style={{ flex: '1 1 auto', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
                  <motion.img
                    layoutId={`img-${item.id}`}
                    src={item.imageUrl || item.thumbnailUrl} // Fallback to thumb if high-res not available
                    alt={item.title}
                    style={{
                      maxHeight: '60vh',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Info Section */}
                <div style={{ flex: '0 0 350px', padding: 'var(--space-8)', borderLeft: '1px solid var(--border)', overflowY: 'auto' }}>
                  <div style={{ textTransform: 'uppercase', color: 'var(--muted-foreground)', fontSize: '0.875rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    {item.country} • {item.year}
                  </div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.title}</h2>
                  
                  <div style={{ margin: '2rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--muted-foreground)' }}>Quality</span>
                      <strong>{item.quality}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--muted-foreground)' }}>Value</span>
                      <strong>{item.value}</strong>
                    </div>
                    {item.serialNumber && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--muted-foreground)' }}>Serial No.</span>
                        <strong>{item.serialNumber}</strong>
                      </div>
                    )}
                  </div>

                  <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                    <a href="https://t.me/yourusername" target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#0088cc', color: 'white', padding: '0.75rem', fontWeight: 500 }}>
                      <TelegramLogo size={20} />
                      Telegram
                    </a>
                    <a href="tel:+1234567890" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--foreground)', color: 'var(--background)', padding: '0.75rem', fontWeight: 500 }}>
                      <Phone size={20} />
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlassModal;
