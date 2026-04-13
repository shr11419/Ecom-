import ProductCard from "../components/ProductCard";
import { useProducts  } from "../context/ProductContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const {
  filteredProducts,
  categories,
  selectedCategory,
  setSelectedCategory
} = useProducts();

  const [visibleCount, setVisibleCount] = useState(10);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

   /* const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(data => setProducts(data));
    }, []);*/

    if (!filteredProducts.length) {
  return <p className="loading">Loading products...</p>;
}
    return (
    <div className="page" >
        <div className="home-hero">
            <h1 className="home-title"> Welcome to ShopHub</h1>
            <p className="home-subtitle">
                Discover amazing products at great prices
            </p>
            </div>
        <div className="container">
             <h2 className="page-title"> Our Products </h2>
            <div className="category-filter"> 
                <button className={selectedCategory === "all" ? "category-btn active" : "category-btn"} 
                onClick={() => { setSelectedCategory("all"); setVisibleCount(10);}}> All </button> 
                {categories.map(category => (
                    <button key={category} className={selectedCategory === category ? "category-btn active" : "category-btn"} onClick={() => { setSelectedCategory(category); setVisibleCount(10);}}> {category}</button>
                ))}
            </div>
            <div className="product-grid">
          {visibleProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
        {visibleCount < filteredProducts.length && (
          <button
            className="show-more"
            onClick={() =>
              setVisibleCount(prev => prev + 10)
            }
          >
            Show More
          </button>
        )}


             </div>
            </div>
    );
}