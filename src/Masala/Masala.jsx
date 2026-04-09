import React, { useEffect, useState, useContext } from "react";
import "./Masala.css";
import { cart_data, searchvalue } from "../App";

const CATEGORIES = [
  { key: "all", label: "All", icon: "🌿" },
  { key: "oil", label: "Oils", icon: "🫙" },
  { key: "masala", label: "Masala", icon: "🌶️" },
  { key: "desighee", label: "Desi Ghee", icon: "🧈" },
  { key: "saltsugar", label: "Salt & Sugar", icon: "🧂" },
];

const getRating = (item) => item.rating || (3.8 + ((item.id * 9) % 12) / 10).toFixed(1);
const getReviews = (id) => 60 + ((id || 1) * 37) % 2000;
const getOriginal = (price, id) => Math.round(price * (1.12 + ((id || 1) % 25) / 100));

const StarRating = ({ rating }) => {
  const full = Math.floor(Number(rating));
  const half = Number(rating) % 1 >= 0.5;
  return (
    <div className="ms-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`ms-star ${i < full ? "filled" : i === full && half ? "half" : "empty"}`}>
          <path d="M10 1l2.39 4.84L18 6.76l-4 3.9.94 5.5L10 13.77l-4.94 2.39.94-5.5-4-3.9 5.61-.92z" />
        </svg>
      ))}
      <span className="ms-rating-val">{Number(rating).toFixed(1)}</span>
    </div>
  );
};

const MsSkeleton = () => (
  <div className="ms-skeleton">
    <div className="ms-sk-img" />
    <div className="ms-sk-body">
      {[1, 2, 3, 4].map(i => <div key={i} className={`ms-sk-line ${i === 1 ? "short" : i === 3 ? "medium" : i === 4 ? "btn" : ""}`} />)}
    </div>
  </div>
);

const WishBtn = ({ id }) => {
  const [wished, setWished] = useState(false);
  return (
    <button className={`ms-wish ${wished ? "wished" : ""}`} onClick={e => { e.stopPropagation(); setWished(w => !w); }}>
      <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

const MasalaCard = ({ el, onAddCart }) => {
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const rating = getRating(el);
  const reviews = getReviews(el.id);
  const origPrice = getOriginal(Number(el.price), el.id);
  const discount = Math.round(((origPrice - Number(el.price)) / origPrice) * 100);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddCart({ ...el, title: el.name, image: el.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="ms-card">
      <div className="ms-img-wrap">
        {!imgLoaded && <div className="ms-img-skeleton" />}
        <img
          src={el.image}
          alt={el.name}
          className={`ms-img ${imgLoaded ? "loaded" : ""}`}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; setImgLoaded(true); }}
        />
        {discount > 0 && <span className="ms-badge">{discount}% OFF</span>}
        <WishBtn id={el.id} />
        <div className="ms-overlay"><span>Quick View</span></div>
      </div>

      <div className="ms-body">
        <span className="ms-cat-label">{el.category}</span>
        <h3 className="ms-name">{el.name}</h3>
        <StarRating rating={rating} />
        <span className="ms-reviews">({reviews.toLocaleString()} reviews)</span>
        <div className="ms-price-row">
          <span className="ms-price">₹{Number(el.price).toLocaleString()}</span>
          <span className="ms-orig">₹{origPrice.toLocaleString()}</span>
          <span className="ms-save">Save ₹{(origPrice - Number(el.price)).toLocaleString()}</span>
        </div>
        <p className="ms-desc">{el.description}</p>
        <div className="ms-chips">
          <span className="ms-chip">🌿 100% Natural</span>
          <span className="ms-chip">🚚 Free Delivery</span>
        </div>
        <button className={`ms-add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
          {added ? "✓ Added to Cart!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
};

const Masala = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");

  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  useEffect(() => {
    setLoading(true);
    fetch("https://masalaitems.onrender.com/api/products/")
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes((search || "").toLowerCase());
    const matchCat = category === "all" || item.category?.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
    if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  return (
    <div className="ms-page">
      <section className="ms-hero">
        <div className="ms-hero-inner">
          <div className="ms-hero-left">
            <span className="ms-hero-pill">🌶️ Farm Fresh Spices</span>
            <h1 className="ms-hero-title">Authentic Indian<br /><span className="ms-hero-accent">Masala & Spices</span></h1>
            <p className="ms-hero-sub">Premium quality oils, masalas & ghee — sourced from the best farms</p>
            <div className="ms-hero-trust">
              <span>🌿 100% Natural</span>
              <span>🏆 Premium Quality</span>
              <span>🚚 Free Delivery</span>
            </div>
          </div>
          <div className="ms-hero-stats">
            <div className="ms-stat"><span className="ms-stat-num">200+</span><span className="ms-stat-lbl">Products</span></div>
            <div className="ms-stat-div" />
            <div className="ms-stat"><span className="ms-stat-num">25%</span><span className="ms-stat-lbl">Max Off</span></div>
            <div className="ms-stat-div" />
            <div className="ms-stat"><span className="ms-stat-num">Pure</span><span className="ms-stat-lbl">Quality</span></div>
          </div>
        </div>
      </section>

      <nav className="ms-cat-nav">
        <div className="ms-cat-inner">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`ms-cat-btn ${category === c.key ? "active" : ""}`}
              onClick={() => setCategory(c.key)}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="ms-toolbar">
        <p className="ms-result-count">
          {loading ? "Loading..." : <><strong>{sorted.length}</strong> products found</>}
        </p>
        <div className="ms-toolbar-right">
          <div className="ms-view-toggle">
            <button className={`ms-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3H3v2h2V3zm0 4H3v2h2V7zm0 4H3v2h2v-2zm4-8H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm4-8h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2z" /></svg>
            </button>
            <button className={`ms-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" /></svg>
            </button>
          </div>
          <select className="ms-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="ms-grid">
          {[...Array(8)].map((_, i) => <MsSkeleton key={i} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="ms-empty">
          <div className="ms-empty-icon">🌶️</div>
          <h3>No products found</h3>
          <p>Try a different category</p>
          <button onClick={() => setCategory("all")}>Clear Filters</button>
        </div>
      ) : (
        <div className={viewMode === "list" ? "ms-list" : "ms-grid"}>
          {sorted.map(el => <MasalaCard key={el.id} el={el} onAddCart={cart1} />)}
        </div>
      )}
    </div>
  );
};

export default Masala;