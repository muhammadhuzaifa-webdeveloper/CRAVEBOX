import { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();


export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cravebox_cart_v2");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("LocalStorage load error:", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cravebox_cart_v2", JSON.stringify(cartItems));
    } catch (error) {
      console.error("LocalStorage save error:", error);
    }
  }, [cartItems]);

  // Add item with drink & custom instructions support
  const addToCart = (product, quantity = 1, drink = null, instructions = "") => {
    if (!product || (!product.id && !product._id)) {
      console.error("Invalid product provided!");
      return;
    }

    const itemQuantity = Number(quantity) || 1;
    const productId = product.id || product._id;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          (item.id || item._id) === productId &&
          item.drink?.id === drink?.id &&
          item.instructions === instructions
      );

      if (existingIndex > -1) {
        return prevItems.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              quantity: item.quantity + itemQuantity,
            };
          }
          return item;
        });
      } else {
        return [
          ...prevItems,
          { ...product, id: productId, quantity: itemQuantity, drink, instructions },
        ];
      }
    });
  };

  // Update quantity directly (Increment / Decrement)
  const updateQuantity = (index, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item, i) => {
          if (i === index) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove specific item by index or ID
  const removeCartItem = (target) => {
    setCartItems((prevItems) =>
      prevItems.filter((item, index) => {
        if (typeof target === "number" && target < prevItems.length) {
          return index !== target;
        }
        const targetId = typeof target === "object" ? target.id || target._id : target;
        return (item.id || item._id) !== targetId;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Calculate Total Items Count
  const cartCount = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0
  );

  // Calculate Total Subtotal Price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        isCartOpen,
        addToCart,
        updateQuantity,
        openCart,
        closeCart,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

export default CartProvider;