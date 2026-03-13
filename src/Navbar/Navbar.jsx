import React, { useContext, useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { add_cart, searchfunc, price_data } from "../App";

const Navbar = ({ setShowLogin, user, setUser }) => {

  const cartItems = useContext(add_cart);
  const totalPrice = useContext(price_data);
  const searchProduct = useContext(searchfunc);

  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();

  /* CLOSE MENU WHEN CLICK OUTSIDE */

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    setShowMenu(false);
  };

  const handleLoginClick = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (loggedIn) {
      alert("You are already logged in");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        MyShop
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/About">About</Link>
        <Link to="/Products">Products</Link>
        <Link to="/Contact">Contact</Link>
        <Link to="/Rondomimg">Gallery</Link>
      </div>

      {/* SEARCH BAR */}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => searchProduct(e.target.value)}
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      {/* USER SECTION */}

      <div className="user-section">

        {user ? (

          <div className="user-dropdown" ref={menuRef}>

            <div
              className="user-profile"
              onClick={() => setShowMenu(!showMenu)}
            >
              <i className="fa-solid fa-user"></i>
              <span>Hello {user.name}</span>
              <i className="fa-solid fa-caret-down"></i>
            </div>

            {showMenu && (

              <div className="dropdown-menu">

                <Link to="/profile">Profile</Link>

                <Link to="/orders">Orders</Link>

                <button onClick={handleLogout}>
                  Logout
                </button>

              </div>

            )}

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
  );
};

export default Navbar;