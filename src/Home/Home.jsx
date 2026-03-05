import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <section className="home">
      <div className="hero-banner">
        <div className="hero-text">
          <h1>Stock up on daily essentials</h1>
          <p>
            Get fresh groceries, snacks, household items and more delivered to
            your doorstep in minutes.
          </p>

          <Link to="/Products" className="shop-btn">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="categories">
        <Link to="/Products" className="cat-card green">
          <h3>Pharmacy</h3>
          <p>Medicines & health essentials</p>
        </Link>

        <Link to="/Products" className="cat-card yellow">
          <h3>Pet Care</h3>
          <p>Food, treats & accessories</p>
        </Link>

        <Link to="/Products" className="cat-card blue">
          <h3>Baby Care</h3>
          <p>Diapers & baby essentials</p>
        </Link>
      </div>

      <div className="features">
        <div>
          <h4>⚡ Fast Delivery</h4>
          <p>Get your order delivered quickly</p>
        </div>
        <div>
          <h4>🛒 Smart Cart</h4>
          <p>Add, remove & update quantity easily</p>
        </div>
        <div>
          <h4>🔒 Secure</h4>
          <p>Safe and smooth checkout experience</p>
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 My Shopping Website. All Rights Reserved.</p>
      </footer>
    </section>
  );
};

export default Home;
