import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPrompt from "./components/AuthPrompt";
import "./App.css";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist"; 
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";

function App() {

   const [theme, setTheme] = useState( 
      localStorage.getItem("theme") || "dark"
   ); 

   useEffect(() => {
      document.body.className = theme;
      localStorage.setItem("theme", theme);
   }, [theme]);

  return (
    <div className="app">
      <AuthPrompt />
      <Navbar theme={theme} setTheme={setTheme}/>
      <Routes>
        <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile theme={theme} setTheme={setTheme} />} />
      </Routes>

      <Footer />

    </div>
  );
}

export default App;