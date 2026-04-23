import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export default function WishlistProvider({children}) {
    const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlistItems")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);


    function toggleWishlist(id) {
        setWishlistItems(prev => 
            prev.includes(id) 
            ? prev.filter(item => item !== id)
            : [...prev, id]
        );
    }

    return (
        <WishlistContext.Provider value={{wishlistItems, toggleWishlist}}>
            {children}
        </WishlistContext.Provider>
    );
}

    export function useWishlist() {
        return useContext(WishlistContext);
    }
