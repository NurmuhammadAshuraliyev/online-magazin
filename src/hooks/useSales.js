import { useState } from 'react';

export const useSales = () => {
  const [cart, setCart] = useState([]);

  // Savatga qo'shish
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Miqdorni o'zgartirish
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return { ...item, qty: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  // Savatdan o'chirish
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Jami summa
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return { cart, addToCart, updateQty, removeFromCart, totalAmount, setCart };
};