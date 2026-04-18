import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart, FiHeart, FiMenu, FiUser } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Navbar({ theme, setTheme }) {
  const { user, logout, setShowAuthPrompt } = useAuth();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();
  const { setSearchTerm } = useProducts();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT */}
        <div className="navbar-left">
          {isMobile && (
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={22} />
            </button>
          )}
          <Link to="/" className="navbar-brand">ShopHub</Link>
        </div>

        {/* CENTER — desktop only */}
        {!isMobile && (
          <div className="navbar-center">
            <input
              className="search-input"
              placeholder="Search products..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link to="/wishlist" className="icon-wrapper">
              <FiHeart size={22} />
              {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
            </Link>
            <Link to="/checkout" className="icon-wrapper">
              <FiShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</span>
              )}
            </Link>
          </div>
        )}

        {/* RIGHT — desktop only */}
        {!isMobile && (
          <div className="navbar-right">
            {/* login/signup or user info */}
            {user ? (
              <>
                <span className="navbar-user">Hi, {user.name || user.email}</span>
                <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
                  Logout
                </button>
              </>
            ) : (
              <button
                className="navbar-login-btn"
                onClick={() => setShowAuthPrompt(true)}
              >
                <FiUser size={15} /> Login / Sign Up
              </button>
            )}
            {/* theme toggle */}
            <div
              className={`theme-toggle ${theme}`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <div className="toggle-circle">
                {theme === "dark" ? "🌙" : "☀️"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE SIDEBAR */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#ff7a00" }}>ShopHub</h3>
            {/* search inside sidebar for mobile */}
            <input
              placeholder="Search products..."
              className="sidebar-search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link to="/wishlist" onClick={() => setSidebarOpen(false)}>
              Wishlist ({wishlistItems.length})
            </Link>
            <Link to="/checkout" onClick={() => setSidebarOpen(false)}>
              Cart ({cartItems.length})
            </Link>
            {user ? (
              <button onClick={() => { logout(); setSidebarOpen(false); navigate("/"); }}>
                Logout
              </button>
            ) : (
              <button onClick={() => { setSidebarOpen(false); setShowAuthPrompt(true); }}>
                Login / Sign Up
              </button>
            )}
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}