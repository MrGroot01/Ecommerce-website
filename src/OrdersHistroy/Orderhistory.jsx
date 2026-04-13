// FILE: src/pages/OrderHistory.jsx
// Place in: src/pages/OrderHistory.jsx
// Route: /orders

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { add_cart } from "../App";
import "./OrderHistroy.css";
// ── Utility: load orders from localStorage (saved by Checkout on success) ──
const loadOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("myshop_orders") || "[]");
  } catch {
    return [];
  }
};

// ── Status config ──────────────────────────────────────────────────────────
const STATUS = {
  SUCCESS:    { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,0.1)",   icon: "✓" },
  PENDING:    { label: "Processing", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: "⏳" },
  FAILED:     { label: "Failed",     color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: "✕" },
  REFUNDED:   { label: "Refunded",   color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", icon: "↩" },
  PROCESSING: { label: "In Transit", color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  icon: "🚚" },
};

// ── Demo orders (shown when localStorage is empty) ─────────────────────────
const DEMO_ORDERS = [
  {
    id: "ORD8F2A1C3D",
    date: "2026-03-28T10:30:00",
    status: "SUCCESS",
    total: 1248,
    delivery: 0,
    paymentMethod: "UPI",
    address: "42, 3rd Cross, Indiranagar, Bengaluru",
    items: [
      { name: "Himalaya Liv.52 Tablets", price: 185, quantity: 2, image: "https://m.media-amazon.com/images/I/71WAtIqoUhL._SX679_.jpg", category: "pharmacy" },
      { name: "Pedigree Adult Dog Food", price: 899, quantity: 1, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM-OeDkbwAeQ_oydGi5D4v1Qpt1Rw79HN0bQ&s", category: "pet" },
    ],
  },
  {
    id: "ORD3E9B7F12",
    date: "2026-03-15T14:22:00",
    status: "SUCCESS",
    total: 599,
    delivery: 0,
    paymentMethod: "Card",
    address: "Office Block B, Koramangala, Bengaluru",
    items: [
      { name: "Pampers Baby Diapers", price: 599, quantity: 1, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sdjE_9bLiQqzITfQgDjgbk9JQniKH0wfkw&s", category: "baby" },
    ],
  },
  {
    id: "ORD1D4C8A09",
    date: "2026-02-20T09:05:00",
    status: "REFUNDED",
    total: 349,
    delivery: 49,
    paymentMethod: "UPI",
    address: "42, 3rd Cross, Indiranagar, Bengaluru",
    items: [
      { name: "Vitamin C Serum", price: 349, quantity: 1, image: "https://m.media-amazon.com/images/I/61gI5zWkczL._SX679_.jpg", category: "pharmacy" },
    ],
  },
];

// ── Filter tabs ─────────────────────────────────────────────────────────────
const TABS = ["All", "Delivered", "Processing", "In Transit", "Failed", "Refunded"];

const OrderHistory = () => {
  const navigate = useNavigate();
  const addToCart = useContext(add_cart);

  const [orders,      setOrders]      = useState([]);
  const [activeTab,   setActiveTab]   = useState("All");
  const [expandedId,  setExpandedId]  = useState(null);
  const [search,      setSearch]      = useState("");
  const [reorderMsg,  setReorderMsg]  = useState("");

  useEffect(() => {
    const stored = loadOrders();
    setOrders(stored.length ? stored : DEMO_ORDERS);
  }, []);

  const filteredOrders = orders.filter(o => {
    const statusLabel = STATUS[o.status]?.label || o.status;
    const matchTab  = activeTab === "All" || statusLabel === activeTab;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  const handleReorder = (order) => {
    order.items.forEach(item => addToCart && addToCart({ ...item, id: item.name.toLowerCase().replace(/\s/g, "-") }));
    setReorderMsg(`${order.items.length} item(s) added to cart!`);
    setTimeout(() => setReorderMsg(""), 2500);
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  const totalSpent = orders.filter(o => o.status === "SUCCESS").reduce((s, o) => s + o.total, 0);
  const delivered  = orders.filter(o => o.status === "SUCCESS").length;

  return (
    <div className="page-root">
      {/* Reorder toast */}
      {reorderMsg && <div className="page-toast">🛒 {reorderMsg}</div>}

      {/* ── HEADER ── */}
      <div className="page-hero orders-hero">
        <div className="page-hero-inner">
          <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
          <div className="page-hero-text">
            <h1>Order History</h1>
            <p>Track, manage and reorder your past purchases</p>
          </div>
          <div className="oh-stats">
            <div className="oh-stat"><span>{orders.length}</span><small>Total Orders</small></div>
            <div className="oh-stat"><span>{delivered}</span><small>Delivered</small></div>
            <div className="oh-stat"><span>₹{totalSpent.toLocaleString()}</span><small>Total Spent</small></div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* ── SEARCH + FILTER ── */}
        <div className="oh-controls">
          <div className="oh-search-wrap">
            <span className="oh-search-icon">🔍</span>
            <input
              className="oh-search"
              placeholder="Search by order ID or product name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="oh-tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`oh-tab ${activeTab === t ? "oh-tab-active" : ""}`}
                onClick={() => setActiveTab(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* ── ORDER LIST ── */}
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>{search ? "Try a different search term." : "You haven't placed any orders yet."}</p>
            <Link to="/Products" className="empty-cta">Start Shopping →</Link>
          </div>
        ) : (
          <div className="oh-list">
            {filteredOrders.map(order => {
              const st = STATUS[order.status] || STATUS.PENDING;
              const isExpanded = expandedId === order.id;
              return (
                <div key={order.id} className={`oh-card ${isExpanded ? "oh-card-open" : ""}`}>
                  {/* Card header */}
                  <div className="oh-card-header" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                    <div className="oh-card-meta">
                      <div className="oh-order-id">#{order.id}</div>
                      <div className="oh-order-date">📅 {formatDate(order.date)}</div>
                      <div className="oh-order-pay">💳 {order.paymentMethod}</div>
                    </div>
                    <div className="oh-card-right">
                      <div className="oh-status-badge" style={{ color: st.color, background: st.bg }}>
                        <span>{st.icon}</span> {st.label}
                      </div>
                      <div className="oh-total">₹{order.total.toLocaleString()}</div>
                      <button className="oh-expand-btn">{isExpanded ? "▲" : "▼"}</button>
                    </div>
                  </div>

                  {/* Item thumbnails (always visible) */}
                  <div className="oh-thumbs">
                    {order.items.map((item, i) => (
                      <img key={i} src={item.image} alt={item.name}
                        onError={e => { e.target.src = "https://placehold.co/48x48?text=?"; }} />
                    ))}
                    <span className="oh-thumb-count">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="oh-details">
                      <div className="oh-items-list">
                        {order.items.map((item, i) => (
                          <div key={i} className="oh-item-row">
                            <img src={item.image} alt={item.name}
                              onError={e => { e.target.src = "https://placehold.co/56x56?text=?"; }} />
                            <div className="oh-item-info">
                              <h4>{item.name}</h4>
                              <span className="oh-item-cat">{item.category}</span>
                              <span className="oh-item-qty">Qty: {item.quantity}</span>
                            </div>
                            <div className="oh-item-price">₹{item.price * item.quantity}</div>
                          </div>
                        ))}
                      </div>

                      <div className="oh-detail-footer">
                        <div className="oh-addr">
                          <span>📍</span>
                          <p>{order.address}</p>
                        </div>
                        <div className="oh-pricing">
                          <div className="ohp-row"><span>Subtotal</span><span>₹{order.total - order.delivery}</span></div>
                          <div className="ohp-row"><span>Delivery</span><span style={{ color:"#22c55e" }}>{order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</span></div>
                          <div className="ohp-row ohp-total"><span>Total</span><span>₹{order.total}</span></div>
                        </div>
                      </div>

                      <div className="oh-actions">
                        {order.status === "SUCCESS" && (
                          <>
                            <button className="oh-action-btn primary" onClick={() => handleReorder(order)}>🔄 Reorder</button>
                            <button className="oh-action-btn">⬇ Download Invoice</button>
                            <Link to="/returns" className="oh-action-btn">↩ Return / Refund</Link>
                          </>
                        )}
                        {order.status === "PENDING" || order.status === "PROCESSING" ? (
                          <button className="oh-action-btn primary">🚚 Track Order</button>
                        ) : null}
                        {order.status === "FAILED" && (
                          <Link to="/Products" className="oh-action-btn primary">🛒 Shop Again</Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;