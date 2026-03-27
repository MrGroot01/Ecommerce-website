import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { add_cart, searchfunc, price_data } from "../App";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

const Navbar = ({ setShowLogin, user, setUser }) => {

  const cartItems = useContext(add_cart);
  const totalPrice = useContext(price_data);
  const searchProduct = useContext(searchfunc);

  const [showSidebar, setShowSidebar] = useState(false);

  const [city, setCity] = useState("Detecting location...");
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const dropdownRef = useRef();

  // CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowLocationPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // LOAD SAVED LOCATION
  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) setCity(saved);
  }, []);

  // 🔍 SEARCH LOCATION
  const searchLocation = async (value) => {
    setManualAddress(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
    );
    const data = await res.json();

    setSuggestions(data);
  };

  // 📍 SHORT ADDRESS FUNCTION
  const getShortAddress = (full) => {
    const parts = full.split(",");
    return `${parts[0]}, ${parts[2] || parts[1]}`;
  };

  // 📍 DETECT LOCATION
  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();

      const short = getShortAddress(data.display_name);

      setCity(short);
      localStorage.setItem("userLocation", short);
      setShowLocationPopup(false);
    });
  };

  const handleLoginClick = () => {
    if (user) alert("You are already logged in");
    else setShowLogin(true);
  };

  return (
    <>
      <nav className="navbar">

        <Link to="/" className="logo">MyShop</Link>

        {/* LOCATION */}
        <div className="location-wrapper" ref={dropdownRef}>
          <div
            className="location-box"
            onClick={() => setShowLocationPopup(!showLocationPopup)}
          >

            <h4>Delivery in 8 minutes</h4>

            <div className="location-bottom">
              <p>{city}</p>
              <span className="arrow">▼</span>
            </div>

          </div>

          {showLocationPopup && (
            <div className="location-dropdown">

              <div className="location-header">
                <span>Change Location</span>
                <button onClick={() => setShowLocationPopup(false)}>✕</button>
              </div>

              <div className="location-body">

                <button className="detect-btn" onClick={detectLocation}>
                  Detect my location
                </button>

                <span className="or-text">OR</span>

                <input
                  type="text"
                  placeholder="Search delivery location"
                  value={manualAddress}
                  onChange={(e) => searchLocation(e.target.value)}
                />

                <div className="suggestions">
                  {suggestions.map((item, i) => {
                    const short = getShortAddress(item.display_name);
                    return (
                      <div
                        key={i}
                        className="suggestion-item"
                        onClick={() => {
                          setCity(short);
                          localStorage.setItem("userLocation", short);
                          setShowLocationPopup(false);
                        }}
                      >
                        📍 {short}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}
        </div>

        {/* NAV LINKS */}
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