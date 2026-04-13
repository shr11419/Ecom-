import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export default function WishlistProvider({children}) {
    const [wishlistItems, setWishlistItems] = useState([]);

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
