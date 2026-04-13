import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const productInCart = cartItems.find(item => item.id === product.id);
  const isWishlisted = wishlistItems.includes(product.id);
  const quantityLabel = productInCart ? `(${productInCart.quantity})` : "";

  return (
    <div className="product-card">
      <button className="wishlist-btn" onClick={() => toggleWishlist(product.id)}>
        {isWishlisted ? <FaHeart className="heart-filled" /> : <FiHeart />}
      </button>
      <img
        src={product.thumbnail}  
        alt={product.title}
        className="product-card-image"
      />
      <div className="product-card-content">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-price">${product.price}</p>
        <div className="product-card-actions">
          <Link className="btn view-btn" to={`/products/${product.id}`}>
            View Details
          </Link>
          <button className="btn cart-btn" onClick={() => addToCart(product.id)}>
            Add to Cart {quantityLabel}
          </button>
        </div>
      </div>
    </div>
  );
}