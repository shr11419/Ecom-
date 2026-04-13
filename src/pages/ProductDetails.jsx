import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { FiArrowLeft } from "react-icons/fi";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const product = getProductById(Number(id));
   const { addToCart, cartItems } = useCart();

  useEffect(() => {
  if (!product) {
    navigate("/");
  }
}, [product, navigate]);

  if (!product) {
    return <h1>Loading...</h1>;
  }

  const productInCart = cartItems.find((item) => item.id === product.id);

  const productQuantityLabel = productInCart
    ? `(${productInCart.quantity})`
    : "";

  return (
    <div className="page">

  <button
    className="back-btn"
    onClick={() => navigate(-1)}
  >
    ← Back
  </button>

  <div className="container">
    <div className="product-detail">

      <div className="product-detail-image">
        <img src={product.thumbnail} alt={product.title} />
      </div>

      <div className="product-detail-content">

        <h1 className="product-detail-name">
          {product.title}
        </h1>

        <p className="product-detail-price">
          ${product.price}
        </p>

        <p className="product-detail-description">
          {product.description}
        </p>

        <button
          className="btn btn-primary"
          onClick={() => addToCart(product.id)}
        >
          Add to Cart {productQuantityLabel}
        </button>

      </div>

    </div>
  </div>
</div>
  );
}