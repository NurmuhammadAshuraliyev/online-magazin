// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { mockProducts } from '../data/mockProducts'; // Nomli import (curly braces bilan)

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage-ni tekshiramiz
    const savedData = localStorage.getItem('products');
    
    if (savedData) {
      setProducts(JSON.parse(savedData));
    } else {
      // Agar LocalStorage bo'sh bo'lsa, mock ma'lumotlarni yuklaymiz
      setProducts(mockProducts);
      localStorage.setItem('products', JSON.stringify(mockProducts));
    }
    setLoading(false);
  }, []);

  return { products, loading };
};