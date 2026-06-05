import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, weight) => {
    const kg = parseFloat(weight) || 1; 
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + kg } : item
        );
      }
      return [...prev, { ...product, qty: kg }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalAmount, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

// MANA SHU EKSPORT MUHIM:
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart Provider ichida bo'lishi kerak!");
  }
  return context;
};