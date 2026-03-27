import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { add_cart, searchfunc, price_data } from "../App";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

const Navbar = ({ setShowLogin, user, setUser }) => {

  const cartItems = useContext(add_cart);
  const totalPrice = useContext(price_data);
  const searchProduct = useContext(searchfunc);

  const [showSidebar, setShowSidebar] = useState(false);

  const handleLoginClick = () => {
    if (user) {
      alert("You are already logged in");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      <nav className="navbar">

        <Link to="/" className="logo">MyShop</Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/About">About</Link>
          <Link to="/Products">Products</Link>
          <Link to="/Contact">Contact</Link>
          <Link to="/Rondomimg">Gallery</Link>
        </div>

        {/* SEARCH */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => searchProduct(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        {/* USER */}
        <div className="user-section">

          {user ? (

            <div
              className="user-profile"
              onClick={() => setShowSidebar(true)}
            >
              <i className="fa-solid fa-user"></i>
              <span>Hello {user?.name || "User"}</span>
            </div>

          ) : (

            <button className="login-btn" onClick={handleLoginClick}>
              Login
            </button>

          )}

        </div>

        {/* CART */}
        <div className="cart-box">
          <Link to="/Addcart" className="cart-btn">
            <i className="fa-solid fa-cart-shopping"></i>

            <div className="cart-info">
              <span>{cartItems.length} items</span>
              <span>₹{totalPrice}</span>
            </div>
          </Link>
        </div>

      </nav>

      {/* SIDEBAR */}
      <ProfileSidebar
        show={showSidebar}
        setShow={setShowSidebar}
        user={user}
        setUser={setUser}
      />
    </>
  );
};

export default Navbar;