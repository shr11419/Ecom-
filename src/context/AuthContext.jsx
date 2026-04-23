import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider();

  // 🔄 keep user logged in on refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 📧 Email signup
  async function signUp(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser({
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // 🔑 Email login
  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser({
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // 🌐 Google login (FIXED VERSION)
  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName
      });

      return { success: true };
    } catch (err) {
      console.error("Google login error:", err);

      return {
        success: false,
        error: "Google sign-in failed. Try again."
      };
    }
  }

  // ✏️ Save name after signup
  async function saveName(name) {
    try {
      if (!auth.currentUser) return;

      await updateProfile(auth.currentUser, {
        displayName: name
      });

      setUser((prev) => ({
        ...prev,
        name
      }));
    } catch (err) {
      console.error("Save name error:", err);
    }
  }

  // 🚪 Logout
  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        login,
        loginWithGoogle,
        logout,
        saveName
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}