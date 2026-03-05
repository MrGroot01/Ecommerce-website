import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about-container">
      <div className="about-header">
        <h1>About Our Company</h1>
        <p>
          Welcome to <strong>QuickCart</strong>, your trusted online shopping
          destination. We provide a seamless shopping experience with a wide
          variety of products including groceries, electronics, fashion,
          personal care, home essentials and more.
        </p>
      </div>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make everyday shopping easy, affordable and
          accessible for everyone. We aim to deliver high-quality products to
          customers quickly while maintaining the highest standards of service.
        </p>
      </div>

      <div className="about-section">
        <h2>Our Vision</h2>
        <p>
          We envision becoming one of the leading eCommerce platforms that
          connects customers with trusted brands and sellers across the world,
          providing a fast and reliable shopping experience.
        </p>
      </div>

      <div className="about-features">
        <div className="feature-card">
          <h3>🚚 Fast Delivery</h3>
          <p>
            Our advanced logistics network ensures that your products reach you
            quickly and safely.
          </p>
        </div>

        <div className="feature-card">
          <h3>🛍 Wide Product Range</h3>
          <p>
            Explore thousands of products from trusted brands across multiple
            categories.
          </p>
        </div>

        <div className="feature-card">
          <h3>🔒 Secure Payments</h3>
          <p>
            We offer multiple secure payment options including cards, UPI and
            online wallets.
          </p>
        </div>

        <div className="feature-card">
          <h3>⭐ Customer Satisfaction</h3>
          <p>
            Our dedicated support team ensures a smooth and reliable shopping
            experience.
          </p>
        </div>
      </div>

      <div className="stats">
        <div>
          <h2>1M+</h2>
          <p>Happy Customers</p>
        </div>

        <div>
          <h2>50K+</h2>
          <p>Products Available</p>
        </div>

        <div>
          <h2>10K+</h2>
          <p>Daily Orders</p>
        </div>

        <div>
          <h2>24/7</h2>
          <p>Customer Support</p>
        </div>
      </div>

      <footer className="about-footer">
        <p>© 2026 QuickCart. All Rights Reserved.</p>
      </footer>
    </section>
  );
};

export default About;
