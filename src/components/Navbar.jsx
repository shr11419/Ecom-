import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart, FiHeart, FiMenu } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Navbar({ theme, setTheme }) {

  const { user, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();
  const { setSearchTerm } = useProducts();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="navbar-container">
        <div className="navbar-left">

          {isMobile && (
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={22} />
            </button>
          )}

          <Link to="/" className="navbar-brand">
            ShopHub
          </Link>

        </div>

        {!isMobile && (
          <>
            <div className="navbar-center">

              <Link to="/wishlist" className="icon-wrapper">
                <FiHeart size={22} />
                {wishlistItems.length > 0 && (
                  <span className="badge">{wishlistItems.length}</span>
                )}
              </Link>

              <Link to="/checkout" className="icon-wrapper">
                <FiShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span className="badge">
                    {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                )}
              </Link>

              <input
                className="search-input"
                placeholder="Search products..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />

            </div>


            <div className="navbar-right">

            <div
           className={`theme-toggle ${theme}`}
           onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
            }
          >
          <div className="toggle-circle">
           {theme === "dark" ? "🌙" : "☀️"}
          </div>
         </div>

        {user && (
           <span className="navbar-user">
             Hello, {user.email}
           </span>
        )}

        {user && (
        <button
           className="logout-btn"
          onClick={() => {
         logout();
         navigate("/auth");
        }}
       >
       Logout
      </button>
      )}

      </div>
          </>
        )}

      </div>


      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="sidebar"
            onClick={(e) => e.stopPropagation()}
          >

            <h3>Menu</h3>

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

            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            >
              Toggle Theme
            </button>

            {user && (
              <button
                onClick={() => {
                  logout();
                  navigate("/auth");
                }}
              >
                Logout
              </button>
            )}

          </div>
        </div>
      )}

    </nav>
  );
}