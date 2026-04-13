export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">
          <h3>ShopHub</h3>
          <p>Your one-stop destination for amazing products at great prices.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>Wishlist</p>
          <p>Cart</p>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <p>Help Center</p>
          <p>Returns</p>
          <p>Privacy Policy</p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>support@shophub.com</p>
          <p>+91 98765 43210</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} ShopHub. All rights reserved.
      </div>

    </footer>
  );
}