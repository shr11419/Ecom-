import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const banners = [
    {
        id: 1,
        title: "New Season Arrivals",
        subtitle: "Discover the latest trends — up to 50% off",
        bg: "#1a1a2e",
        accent: "#ff7a00",
        tag: "SHOP NOW",
    },
    {
        id: 2,
        title: "Top Electronics",
        subtitle: "Premium gadgets at unbeatable prices",
        bg: "#0f3460",
        accent: "#ff7a00",
        tag: "EXPLORE",
    },
    {
        id: 3,
        title: "Jewellery & More",
        subtitle: "Handpicked pieces for every occasion",
        bg: "#2d1b4e",
        accent: "#ff7a00",
        tag: "VIEW ALL",
    },
];

const categoryIcons = [
    { label: "Men's Clothing", slug: "men's clothing", emoji: "👔" },
    { label: "Women's Clothing", slug: "women's clothing", emoji: "👗" },
    { label: "Electronics", slug: "electronics", emoji: "📱" },
    { label: "Jewellery", slug: "jewelery", emoji: "💍" },
];

export default function Home() {
    const { filteredProducts, setSelectedCategory, selectedCategory } = useProducts();
    const [visibleCount, setVisibleCount] = useState(12);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    // Auto-slide every 3.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % banners.length);
        }, 3500);
        return () => clearInterval(timer); // cleanup on unmount
    }, []);

    const handleCategoryClick = (slug) => {
        setSelectedCategory(slug);
        window.scrollTo({ top: 400, behavior: "smooth" });
    };

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    return (
        <div className="home">

            {/* ===== HERO CAROUSEL ===== */}
            <div className="hero-carousel">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`hero-slide ${index === currentSlide ? "active" : ""}`}
                        style={{ background: banner.bg }}
                    >
                        <div className="hero-content">
                            <span className="hero-tag" style={{ background: banner.accent }}>
                                TRENDING NOW
                            </span>
                            <h1 className="hero-title">{banner.title}</h1>
                            <p className="hero-subtitle">{banner.subtitle}</p>
                            <button
                                className="hero-btn"
                                style={{ background: banner.accent }}
                                onClick={() => navigate("/products")}
                            >
                                {banner.tag} →
                            </button>
                        </div>
                    </div>
                ))}

                {/* Dots */}
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

            {/* ===== CATEGORY QUICK LINKS ===== */}
            <div className="container">
                <div className="category-strip">
                    <button
                        className={`cat-pill ${selectedCategory === "all" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("all")}
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

                {/* ===== PRODUCTS SECTION ===== */}
                <div className="section-header">
                    <h2 className="section-title">
                        {selectedCategory === "all" ? "All Products" : selectedCategory}
                    </h2>
                    <span className="section-count">{filteredProducts.length} items</span>
                </div>

                <div className="product-grid">
                    {visibleProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Show more */}
                {visibleCount < filteredProducts.length && (
                    <button
                        className="show-more"
                        onClick={() => setVisibleCount(prev => prev + 12)}
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
}