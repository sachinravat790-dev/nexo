import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load saved cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nexo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('nexo_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Add Item to Cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item._id === product._id);
      if (existing) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // 2. Remove Item from Cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // 3. Update Quantity (+ / -)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 4. Clear Cart (Order place hone ke baad)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('nexo_cart');
  };

  // 5. Calculations (Totals & Student Savings)
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const normalSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const studentSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.studentPrice || item.price) * item.quantity,
    0
  );

  const totalSavings = Math.max(0, normalSubtotal - studentSubtotal);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        normalSubtotal,
        studentSubtotal,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
