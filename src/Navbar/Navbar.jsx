import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { add_cart, searchfunc, price_data } from "../App";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

const Navbar = ({ setShowLogin, user, setUser }) => {
  const cartItems = useContext(add_cart);
  const totalPrice = useContext(price_data);
  const searchProduct = useContext(searchfunc);
  const location = useLocation();

  const [showSidebar, setShowSidebar] = useState(false);
  const [city, setCity] = useState("Detecting location...");
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowLocationPopup(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) setCity(saved);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const searchLocation = async (value) => {
    setManualAddress(value);
    if (value.length < 3) { setSuggestions([]); return; }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
    const data = await res.json();
    setSuggestions(data);
  };

  const getShortAddress = (full) => {
    const parts = full.split(",");
    return `${parts[0]}, ${parts[2] || parts[1]}`;
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await res.json();
      const short = getShortAddress(data.display_name);
      setCity(short);
      localStorage.setItem("userLocation", short);
      setShowLocationPopup(false);
    });
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/About", label: "About" },
    { to: "/Products", label: "Products" },
    { to: "/Contact", label: "Contact" },
    { to: "/Rondomimg", label: "Gallery" },
  ];

  return (
    <>
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <span>🚀 Free delivery on orders above ₹499</span>
          <span className="divider">|</span>
          <span>⚡ 15-min delivery in select areas</span>
          <span className="divider">|</span>
          <span>🔒 100% Secure Payments</span>
          <span className="divider">|</span>
          <span>↩️ 7-day easy returns</span>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar__inner">

          {/* LOGO */}
          <Link to="/" className="logo">
            <div className="logo__icon">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" fill="#10b981"/>
                <path d="M10 13h16l-2 10H12L10 13z" fill="white" opacity="0.95"/>
                <path d="M14 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="15" cy="25" r="1.2" fill="#10b981"/>
                <circle cx="22" cy="25" r="1.2" fill="#10b981"/>
              </svg>
            </div>
            <span className="logo__text">
              Quick<span>Kart</span>
            </span>
          </Link>

          {/* LOCATION */}
          <div className="location-wrapper" ref={dropdownRef}>
            <button
              className="location-box"
              onClick={() => setShowLocationPopup(!showLocationPopup)}
              aria-label="Change delivery location"
            >
              <div className="location-box__top">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="location-box__label">Deliver to</span>
              </div>
              <div className="location-box__city">
                <span>{city}</span>
                <svg className={`chevron${showLocationPopup ? " chevron--up" : ""}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </button>

            {showLocationPopup && (
              <div className="location-dropdown">
                <div className="location-dropdown__header">
                  <span>Change Location</span>
                  <button onClick={() => setShowLocationPopup(false)} className="close-btn">✕</button>
                </div>
                <div className="location-dropdown__body">
                  <button className="detect-btn" onClick={detectLocation}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>
                    Use my current location
                  </button>
                  <div className="or-divider"><span>OR</span></div>
                  <input
                    type="text"
                    placeholder="Search your area, city..."
                    value={manualAddress}
                    onChange={(e) => searchLocation(e.target.value)}
                    className="location-input"
                  />
                  <div className="suggestions">
                    {suggestions.map((item, i) => {
                      const short = getShortAddress(item.display_name);
                      return (
                        <div key={i} className="suggestion-item" onClick={() => {
                          setCity(short);
                          localStorage.setItem("userLocation", short);
                          setShowLocationPopup(false);
                          setSuggestions([]);
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {short}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NAV LINKS — desktop */}
          <ul className="nav-links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={location.pathname === to ? "active" : ""}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* SEARCH */}
          <div className={`search-container${searchOpen ? " search-container--open" : ""}`} ref={searchRef}>
            <button className="search-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
            <input
              type="text"
              placeholder="Search products, brands..."
              onChange={(e) => searchProduct(e.target.value)}
              onFocus={() => setSearchOpen(true)}
            />
          </div>

          {/* USER */}
          <div className="user-section">
            {user ? (
              <button className="user-profile-btn" onClick={() => setShowSidebar(true)}>
                <div className="avatar">{(user?.name || "U")[0].toUpperCase()}</div>
                <div className="user-profile-btn__text">
                  <span className="user-profile-btn__hello">Hello,</span>
                  <span className="user-profile-btn__name">{user?.name?.split(" ")[0] || "User"}</span>
                </div>
              </button>
            ) : (
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Login
              </button>
            )}
          </div>

          {/* CART */}
          <Link to="/Addcart" className="cart-btn">
            <div className="cart-btn__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </div>
            <div className="cart-btn__info">
              <span className="cart-btn__count">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
              <span className="cart-btn__price">₹{totalPrice}</span>
            </div>
          </Link>

          {/* HAMBURGER */}
          <button
            className={`hamburger${menuOpen ? " hamburger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`}>
          <div className="mobile-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => searchProduct(e.target.value)}
            />
          </div>
          <ul className="mobile-nav-links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={location.pathname === to ? "active" : ""}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {!user && (
            <button className="mobile-login-btn" onClick={() => { setShowLogin(true); setMenuOpen(false); }}>
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      <ProfileSidebar show={showSidebar} setShow={setShowSidebar} user={user} setUser={setUser} />
    </>
  );
};

export default Navbar;