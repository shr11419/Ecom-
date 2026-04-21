import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,  
  signOut,                   
  onAuthStateChanged,           
  GoogleAuthProvider,               
  signInWithPopup,                  
  updateProfile,                    
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // wait for Firebase to restore session
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // user is logged in — fetch their extra data from Firestore
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        const extraData = docSnap.exists() ? docSnap.data() : {};

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || extraData.name || null,
          address: extraData.address || "",
          photoURL: firebaseUser.photoURL || null,
        });
        setShowAuthPrompt(false);
      } else {
        setUser(null);
        setShowAuthPrompt(true);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  async function signUp(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        return { success: false, error: "Email already in use" };
      }
      return { success: false, error: err.message };
    }
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        return { success: false, error: "Invalid email or password" };
      }
      return { success: false, error: err.message };
    }
  }

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function saveName(name) {
    try {
      await updateProfile(auth.currentUser, { displayName: name });

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        name,
        email: auth.currentUser.email,
      }, { merge: true }); // merge:true means don't overwrite other fields

      setUser(prev => ({ ...prev, name }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function saveAddress(address) {
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        address
      }, { merge: true });
      setUser(prev => ({ ...prev, address }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setShowAuthPrompt(true);
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f0f",
        color: "#ff7a00",
        fontSize: "1.2rem",
        fontWeight: 600
      }}>
        Loading ShopHub...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user, signUp, login, loginWithGoogle,
      logout, saveName, saveAddress,
      showAuthPrompt, setShowAuthPrompt
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}