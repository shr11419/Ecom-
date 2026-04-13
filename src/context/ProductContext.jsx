import { createContext, useContext, useEffect, useState } from "react";
const ProductContext = createContext(null);

export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then(res => res.json())
      .then(data => setProducts(data.products));

    fetch("https://dummyjson.com/products/categories")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setCategories(data.map(c => c.slug))
  });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function getProductById(id) {
    return products.find(p => p.id === Number(id));
  }

  return (
    <ProductContext.Provider value={{
      products,
      filteredProducts,
      categories,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      getProductById
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used inside ProductProvider");
  return context;
};