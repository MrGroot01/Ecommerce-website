// FILE: src/pages/Wishlist.jsx
// Place in: src/pages/Wishlist.jsx
// Route: /wishlist

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cart_data } from "../App";
import '/Pages.css'

// ── Persist wishlist in localStorage ──────────────────────────────────────
export const loadWishlist = () => {
  try { return JSON.parse(localStorage.getItem("myshop_wishlist") || "[]"); }
  catch { return []; }
};
export const saveWishlist = (items) => {
  localStorage.setItem("myshop_wishlist", JSON.stringify(items));
};

// ── Demo wishlist ─────────────────────────────────────────────────────────
const DEMO_WISHLIST = [
  { id: "himalaya-liv52", name: "Himalaya Liv.52 Tablets", price: 185, oldPrice: 250, image: "https://m.media-amazon.com/images/I/71WAtIqoUhL._SX679_.jpg", category: "pharmacy", rating: 4.6, reviews: 3200, inStock: true },
  { id: "pedigree-dog",   name: "Pedigree Adult Dog Food 3kg", price: 899, oldPrice: 1200, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM-OeDkbwAeQ_oydGi5D4v1Qpt1Rw79HN0bQ&s", category: "pet", rating: 4.3, reviews: 920, inStock: true },
  { id: "pampers-diapers",name: "Pampers Baby Diapers L40", price: 599, oldPrice: 899, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sdjE_9bLiQqzITfQgDjgbk9JQniKH0wfkw&s", category: "baby", rating: 4.8, reviews: 5100, inStock: true },
  { id: "vit-c-serum",    name: "Vitamin C Serum 30ml",  price: 349, oldPrice: 599, image: "https://m.media-amazon.com/images/I/61gI5zWkczL._SX679_.jpg", category: "pharmacy", rating: 4.7, reviews: 3200, inStock: false },
  { id: "organic-honey",  name: "Organic Honey 500g",   price: 299, oldPrice: 499, image: "https://zanducare.com/cdn/shop/articles/Zanducare_-_2024-04-23T160433.165.png?v=1756200527", category: "grocery", rating: 4.5, reviews: 1840, inStock: true },
];

const SORT_OPTIONS = ["Recently Added", "Price: Low to High", "Price: High to Low", "Rating"];

const Wishlist = () => {
  const navigate  = useNavigate();
  const addCart   = useContext(cart_data);

  const [items,    setItems]    = useState([]);
  const [sort,     setSort]     = useState("Recently Added");
  const [toast,    setToast]    = useState("");
  const [filterCat,setFilterCat]= useState("All");

  useEffect(() => {
    const stored = loadWishlist();
    setItems(stored.length ? stored : DEMO_WISHLIST);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const removeItem = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated); saveWishlist(updated);
    showToast("Removed from wishlist");
  };

  const moveToCart = (item) => {
    if (!item.inStock) return;
    addCart && addCart({ ...item, image: item.image });
    removeItem(item.id);
    showToast(`🛒 ${item.name.slice(0, 20)}… added to cart!`);
  };

  const moveAllToCart = () => {
    const inStock = items.filter(i => i.inStock);
    inStock.forEach(item => addCart && addCart(item));
    const outOfStock = items.filter(i => !i.inStock);
    setItems(outOfStock); saveWishlist(outOfStock);
    showToast(`🛒 ${inStock.length} item(s) added to cart!`);
  };

  const categories = ["All", ...new Set(items.map(i => i.category))];

  const sorted = [...items]
    .filter(i => filterCat === "All" || i.category === filterCat)
    .sort((a, b) => {
      if (sort === "Price: Low to High")  return a.price - b.price;
      if (sort === "Price: High to Low")  return b.price - a.price;
      if (sort === "Rating")              return b.rating - a.rating;
      return 0;
    });

  const totalSaving = sorted.filter(i => i.inStock).reduce((s, i) => s + (i.oldPrice - i.price), 0);

  return (
    <div className="page-root">
      {toast && <div className="page-toast">{toast}</div>}

      {/* HEADER */}
      <div className="page-hero wishlist-hero">
        <div className="page-hero-inner">
          <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
          <div className="page-hero-text">
            <h1>❤️ My Wishlist</h1>
            <p>{items.length} saved item{items.length !== 1 ? "s" : ""} · Save ₹{totalSaving.toLocaleString()} if you buy all</p>
          </div>
          {items.length > 0 && (
            <button className="hero-action-btn" onClick={moveAllToCart}>
              🛒 Move All to Cart
            </button>
          )}
        </div>
      </div>

      <div className="page-content">
        {/* CONTROLS */}
        <div className="wl-controls">
          <div className="wl-cats">
            {categories.map(c => (
              <button key={c} className={`wl-cat-btn ${filterCat === c ? "active" : ""}`}
                onClick={() => setFilterCat(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <select className="wl-sort" value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love and come back to them anytime.</p>
            <Link to="/Products" className="empty-cta">Discover Products →</Link>
          </div>
        ) : (
          <div className="wl-grid">
            {sorted.map(item => {
              const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
              return (
                <div key={item.id} className={`wl-card ${!item.inStock ? "wl-oos" : ""}`}>
                  {!item.inStock && <div className="wl-oos-badge">Out of Stock</div>}
                  <button className="wl-remove" onClick={() => removeItem(item.id)} title="Remove">✕</button>

                  <div className="wl-img-wrap">
                    <img src={item.image} alt={item.name}
                      onError={e => { e.target.src = "https://placehold.co/200x200?text=No+Image"; }} />
                    <span className="wl-discount-badge">-{discount}%</span>
                  </div>

                  <div className="wl-body">
                    <span className="wl-cat-tag">{item.category}</span>
                    <h4>{item.name}</h4>
                    <div className="wl-rating">
                      <span className="wl-stars">{"★".repeat(Math.floor(item.rating))}</span>
                      <span>{item.rating}</span>
                      <span className="wl-rev">({item.reviews.toLocaleString()})</span>
                    </div>
                    <div className="wl-price-row">
                      <span className="wl-price">₹{item.price}</span>
                      <span className="wl-old">₹{item.oldPrice}</span>
                      <span className="wl-save">Save ₹{item.oldPrice - item.price}</span>
                    </div>
                    <button
                      className={`wl-cart-btn ${!item.inStock ? "wl-cart-disabled" : ""}`}
                      onClick={() => moveToCart(item)}
                      disabled={!item.inStock}
                    >
                      {item.inStock ? "🛒 Move to Cart" : "Notify When Available"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;