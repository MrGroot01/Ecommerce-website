import React, { useEffect, useState, useContext } from "react";
import "./cold.css";
import { cart_data, searchvalue } from "../App";

const CATEGORIES = [
  { key: "all", label: "All", icon: "❄️" },
  { key: "beverages", label: "Beverages", icon: "🥤" },
  { key: "dessert", label: "Desserts", icon: "🍦" },
  { key: "dairy", label: "Dairy", icon: "🥛" },
];

const getRating = (item) => item.rating || (3.9 + ((item.id * 11) % 11) / 10).toFixed(1);
const getReviews = (id) => 70 + ((id || 1) * 53) % 2500;
const getOriginal = (price, id) => Math.round(price * (1.1 + ((id || 1) % 20) / 100));

const StarRating = ({ rating }) => {
  const full = Math.floor(Number(rating));
  const half = Number(rating) % 1 >= 0.5;
  return (
    <div className="cl-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`cl-star ${i < full ? "filled" : i === full && half ? "half" : "empty"}`}>
          <path d="M10 1l2.39 4.84L18 6.76l-4 3.9.94 5.5L10 13.77l-4.94 2.39.94-5.5-4-3.9 5.61-.92z" />
        </svg>
      ))}
      <span className="cl-rating-val">{Number(rating).toFixed(1)}</span>
    </div>
  );
};

const ClSkeleton = () => (
  <div className="cl-skeleton">
    <div className="cl-sk-img" />
    <div className="cl-sk-body">
      {[1, 2, 3, 4].map(i => <div key={i} className={`cl-sk-line ${i === 1 ? "short" : i === 3 ? "medium" : i === 4 ? "btn" : ""}`} />)}
    </div>
  </div>
);

const WishBtn = ({ id }) => {
  const [wished, setWished] = useState(false);
  return (
    <button className={`cl-wish ${wished ? "wished" : ""}`} onClick={e => { e.stopPropagation(); setWished(w => !w); }}>
      <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

const ColdCard = ({ el, onAddCart }) => {
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
    <div className="cl-card">
      <div className="cl-img-wrap">
        {!imgLoaded && <div className="cl-img-skeleton" />}
        <img
          src={el.image}
          alt={el.name}
          className={`cl-img ${imgLoaded ? "loaded" : ""}`}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; setImgLoaded(true); }}
        />
        <div className="cl-badges">
          {discount > 0 && <span className="cl-badge red">-{discount}%</span>}
          {el.is_cold && <span className="cl-badge cold">❄️ Cold</span>}
        </div>
        <WishBtn id={el.id} />
        <div className="cl-overlay"><span>Quick View</span></div>
      </div>

      <div className="cl-body">
        <span className="cl-cat-label">{el.category}</span>
        <h3 className="cl-name">{el.name}</h3>
        <StarRating rating={rating} />
        <span className="cl-reviews">({reviews.toLocaleString()} reviews)</span>
        <div className="cl-price-row">
          <span className="cl-price">₹{Number(el.price).toLocaleString()}</span>
          <span className="cl-orig">₹{origPrice.toLocaleString()}</span>
          <span className="cl-save">Save ₹{(origPrice - Number(el.price)).toLocaleString()}</span>
        </div>
        <p className="cl-desc">{el.description}</p>
        <div className="cl-chips">
          {el.is_cold && <span className="cl-chip cold">❄️ Chilled Fresh</span>}
          <span className="cl-chip">🚚 Fast Delivery</span>
        </div>
        <button className={`cl-add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
          {added ? "✓ Added to Cart!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
};

const Cold = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");

  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  useEffect(() => {
    setLoading(true);
    fetch("https://myproject-1-6l2h.onrender.com/api/products/")
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
    <div className="cl-page">
      <section className="cl-hero">
        <div className="cl-hero-inner">
          <div className="cl-hero-left">
            <span className="cl-hero-pill">❄️ Chilled & Fresh</span>
            <h1 className="cl-hero-title">Stay Cool with<br /><span className="cl-hero-accent">Refreshing Drinks</span></h1>
            <p className="cl-hero-sub">Beverages, dairy & desserts — delivered chilled to your door</p>
            <div className="cl-hero-trust">
              <span>❄️ Cold Chain Delivery</span>
              <span>🚚 Express Shipping</span>
              <span>✅ Quality Checked</span>
            </div>
          </div>
          <div className="cl-hero-stats">
            <div className="cl-stat"><span className="cl-stat-num">50+</span><span className="cl-stat-lbl">Products</span></div>
            <div className="cl-stat-div" />
            <div className="cl-stat"><span className="cl-stat-num">Fast</span><span className="cl-stat-lbl">Delivery</span></div>
            <div className="cl-stat-div" />
            <div className="cl-stat"><span className="cl-stat-num">Cold</span><span className="cl-stat-lbl">Always</span></div>
          </div>
        </div>
      </section>

      <nav className="cl-cat-nav">
        <div className="cl-cat-inner">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`cl-cat-btn ${category === c.key ? "active" : ""}`}
              onClick={() => setCategory(c.key)}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="cl-toolbar">
        <p className="cl-result-count">
          {loading ? "Loading..." : <><strong>{sorted.length}</strong> products found</>}
        </p>
        <div className="cl-toolbar-right">
          <div className="cl-view-toggle">
            <button className={`cl-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3H3v2h2V3zm0 4H3v2h2V7zm0 4H3v2h2v-2zm4-8H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm4-8h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2z" /></svg>
            </button>
            <button className={`cl-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" /></svg>
            </button>
          </div>
          <select className="cl-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="cl-grid">
          {[...Array(8)].map((_, i) => <ClSkeleton key={i} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="cl-empty">
          <div className="cl-empty-icon">❄️</div>
          <h3>No cold items found</h3>
          <p>Try a different category</p>
          <button onClick={() => setCategory("all")}>Clear Filters</button>
        </div>
      ) : (
        <div className={viewMode === "list" ? "cl-list" : "cl-grid"}>
          {sorted.map(el => <ColdCard key={el.id} el={el} onAddCart={cart1} />)}
        </div>
      )}
    </div>
  );
};

export default Cold;