import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiHome, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const banners = [
    {
        id: 1,
        title: "New Season Arrivals",
        subtitle: "Discover the latest trends — up to 50% off",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
        tag: "SHOP NOW",
    },
    {
        id: 2,
        title: "Top Electronics",
        subtitle: "Premium gadgets at unbeatable prices",
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1400&q=80",
        tag: "EXPLORE",
    },
    {
        id: 3,
        title: "Jewellery & More",
        subtitle: "Handpicked pieces for every occasion",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80",
        tag: "VIEW ALL",
    },
];

const categoryIcons = [
    { label: "Beauty", slug: "beauty", emoji: "💄" },
    { label: "Fragrances", slug: "fragrances", emoji: "🌸" },
    { label: "Furniture", slug: "furniture", emoji: "🛋️" },
    { label: "Groceries", slug: "groceries", emoji: "🛒" },
    { label: "Home Decor", slug: "home-decoration", emoji: "🏠" },
    { label: "Kitchen", slug: "kitchen-accessories", emoji: "🍳" },
    { label: "Laptops", slug: "laptops", emoji: "💻" },
    { label: "Mens Shirts", slug: "mens-shirts", emoji: "👔" },
    { label: "Mens Shoes", slug: "mens-shoes", emoji: "👟" },
    { label: "Mens Watches", slug: "mens-watches", emoji: "⌚" },
    { label: "Mobiles", slug: "mobile-accessories", emoji: "📱" },
    { label: "Motorcycle", slug: "motorcycle", emoji: "🏍️" },
    { label: "Skin Care", slug: "skin-care", emoji: "✨" },
    { label: "Smartphones", slug: "smartphones", emoji: "📲" },
    { label: "Sports", slug: "sports-accessories", emoji: "⚽" },
    { label: "Sunglasses", slug: "sunglasses", emoji: "🕶️" },
    { label: "Tablets", slug: "tablets", emoji: "📟" },
    { label: "Tops", slug: "tops", emoji: "👚" },
    { label: "Vehicles", slug: "vehicle", emoji: "🚗" },
    { label: "Womens Bags", slug: "womens-bags", emoji: "👜" },
    { label: "Womens Dresses", slug: "womens-dresses", emoji: "👗" },
    { label: "Womens Jewellery", slug: "womens-jewellery", emoji: "💍" },
    { label: "Womens Shoes", slug: "womens-shoes", emoji: "👠" },
    { label: "Womens Watches", slug: "womens-watches", emoji: "⌚" },
];

export default function Home() {
    const { filteredProducts, setSelectedCategory, selectedCategory } = useProducts();
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const [visibleCount, setVisibleCount] = useState(12);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % banners.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    setVisibleCount(12);
    window.scrollTo({ top: 420, behavior: "smooth" });
};
    
    const searchedProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const visibleProducts = searchedProducts.slice(0, visibleCount) ?? [];
   
    const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="home">
            <div className="hero-carousel">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`hero-slide ${index === currentSlide ? "active" : ""}`}
                        style={{ backgroundImage: `url(${banner.image})` }}
                    >
                        <div className="hero-overlay" />
                        <div className="hero-content">
                            <span className="hero-tag">TRENDING NOW</span>
                            <h1 className="hero-title">{banner.title}</h1>
                            <p className="hero-subtitle">{banner.subtitle}</p>
                            <button
                                className="hero-btn"
                                onClick={() => navigate("/")}
                            >
                                {banner.tag} →
                            </button>
                        </div>
                    </div>
                ))}

                <div className="hero-dots">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            className={`hero-dot ${i === currentSlide ? "active" : ""}`}
                            onClick={() => setCurrentSlide(i)}
                        />
                    ))}
                </div>
            </div>

            <div className="search-bar">
            <input type="text" placeholder="Search for products, brands and more.." value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
                   />
            </div>

            <div className="container">

                <div className="category-scroll-wrapper">
                    <div className="category-strip">
                        <button
                            className={`cat-pill ${selectedCategory === "all" ? "active" : ""}`}
                            onClick={() => {
                              setSelectedCategory("all");
                              setVisibleCount(12);
                        }}
                        >
                            🛍️ All
                        </button>
                        {categoryIcons.map(cat => (
                            <button
                                key={cat.slug}
                                className={`cat-pill ${selectedCategory === cat.slug ? "active" : ""}`}
                                onClick={() => handleCategoryClick(cat.slug)}
                            >
                                {cat.emoji} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="section-header">
                    <h2 className="section-title">
                        {selectedCategory === "all"
                            ? "All Products"
                            : categoryIcons.find(c => c.slug === selectedCategory)?.label || selectedCategory}
                    </h2>
                    <span className="section-count">
                       {searchedProducts.length} items
                    </span>
                </div>

                <div className="product-grid">
                    {visibleProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {visibleCount < searchedProducts.length && (
                    <button
                        className="show-more"
                        onClick={() => setVisibleCount(prev => prev + 12)}
                    >
                        Show More
                    </button>
                )}
            </div>

            <nav className="bottom-nav">
                <Link to="/" className={`bottom-nav-item ${location.pathname === "/" ? "active" : ""}`}>
                    <FiHome size={22} />
                    <span>Home</span>
                </Link>
                <Link to="/wishlist" className={`bottom-nav-item ${location.pathname === "/wishlist" ? "active" : ""}`}>
                    <div className="bottom-nav-icon-wrap">
                        <FiHeart size={22} />
                        {wishlistItems.length > 0 && (
                            <span className="bottom-badge">{wishlistItems.length}</span>
                        )}
                    </div>
                    <span>Wishlist</span>
                </Link>
                <Link to="/checkout" className={`bottom-nav-item ${location.pathname === "/checkout" ? "active" : ""}`}>
                    <div className="bottom-nav-icon-wrap">
                        <FiShoppingCart size={22} />
                        {totalCartItems > 0 && (
                            <span className="bottom-badge">{totalCartItems}</span>
                        )}
                    </div>
                    <span>Cart</span>
                </Link>
                <Link to="/auth" className={`bottom-nav-item ${location.pathname === "/auth" ? "active" : ""}`}>
                    <FiUser size={22} />
                    <span>Profile</span>
                </Link>
            </nav>
        </div>
    );
}