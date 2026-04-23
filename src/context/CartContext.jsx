import { createContext, useState, useContext, useEffect } from "react";
import { useProducts } from "./ProductContext";
/* eslint-disable react-refresh/only-export-components */
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);


export default function CartProvider({ children }) {
  const { getProductById } = useProducts();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(()  => {
    try {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
      return [];
    }
  }); 

  /*useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);*/
  useEffect(() => {
  if (!user) return;

  async function loadCart() {
    const docRef = doc(db, "users", user.uid);

    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      setCartItems(snapshot.data().cart || []);
    }
  }

  loadCart();
}, [user]);

useEffect(() => {
  if (!user) return;

  async function saveCart() {
    const docRef = doc(db, "users", user.uid);

    await setDoc(
      docRef,
      { cart: cartItems },
      { merge: true }
    );
  }

  saveCart();
}, [cartItems, user]);


  function addToCart(productId) {
    console.log("Buttin clcked")
  setCartItems((prevItems) => {
    const existing = prevItems.find((item) => item.id === productId);

    if (existing) {
      return prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prevItems, { id: productId, quantity: 1 }];
  });
}

  function getCartItemsWithProducts() {
    return cartItems
      .map((item) => ({
        ...item,
        product: getProductById(item.id),
      }))
      .filter((item) => item.product);
  }

  function removeFromCart(productId) {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function getCartTotal() {
    const total = cartItems.reduce((total, item) => {
      const product = getProductById(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
    return total;
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        getCartItemsWithProducts,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  return context;
}