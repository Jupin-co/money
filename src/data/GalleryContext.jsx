import React, { createContext, useContext, useState, useEffect } from 'react';

const GalleryContext = createContext();

export const useGalleryData = () => {
  return useContext(GalleryContext);
};

export const GalleryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        let response = await fetch('/api/catalog');
        let contentType = response.headers.get('content-type');
        
        if (!response.ok || !contentType || !contentType.includes('application/json')) {
          // Fallback to static catalog.json if running in standalone Vite dev server
          response = await fetch('/data/catalog.json');
        }
        
        if (!response.ok) throw new Error('Failed to fetch catalog');
        const data = await response.json();
        
        // Ensure items have a stable 'type' field matching the filter buttons
        const processedData = (data.items || []).map(item => ({
          ...item,
          type: item.type === 'coin' || item.type === 'coins' ? 'coin' : 
                item.type === 'paper_money' || item.type === 'banknote' ? 'banknote' : 
                item.type || 'all'
        }));
        
        setItems(processedData);
      } catch (error) {
        console.error('Error loading catalog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  return (
    <GalleryContext.Provider value={{ items, loading }}>
      {children}
    </GalleryContext.Provider>
  );
};
