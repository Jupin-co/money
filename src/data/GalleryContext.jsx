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
        const response = await fetch('/catalog.json');
        if (!response.ok) throw new Error('Failed to fetch catalog');
        const data = await response.json();
        setItems(data.items || []);
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
