import React, { useContext } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { add_cart } from "../App";

const Navbar = () => {
  const arr = useContext(add_cart);

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

      <div className="cart">
        <Link to="/Addcart">🛒 Cart</Link>
        <span className="cart-count">{arr.length}</span>
      </div>
    </nav>
  );
};

export default Navbar;
