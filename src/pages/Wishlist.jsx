import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
    const { wishlistItems } = useWishlist();
    const { products } = useProducts();

    const wishlistProducts = products.filter(product => wishlistItems.includes(product.id));

    return ( 
        <div className="container">
            <h2>Your Wishlist</h2>

            <div className="product-grid">
                {wishlistProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}