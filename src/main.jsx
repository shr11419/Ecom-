import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx';
import CartProvider from './context/CartContext.jsx';
import ProductProvider from './context/ProductContext.jsx';
import WishlistProvider from './context/WishlistContext.jsx';

createRoot(document.getElementById('root')).render(
  <ProductProvider>
  <WishlistProvider>
  <CartProvider>
  <AuthProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </AuthProvider>
  </CartProvider>
  </WishlistProvider>
  </ProductProvider>
)
