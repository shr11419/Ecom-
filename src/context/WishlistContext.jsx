import { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export default function WishlistProvider({children}) {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlistItems")) || [];
    } catch {
      return [];
    }
  });

 /* useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);*/
    useEffect(() => {
  if (!user) return;

  async function loadWishlist() {
    const docRef = doc(db, "users", user.uid);

    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      setWishlistItems(snapshot.data().wishlist || []);
    }
  }

  loadWishlist();
}, [user]);

useEffect(() => {
  if (!user) return;

  async function saveWishlist() {
    const docRef = doc(db, "users", user.uid);

    await setDoc(
      docRef,
      { wishlist: wishlistItems },
      { merge: true }
    );
  }

  saveWishlist();
}, [wishlistItems, user]);


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
