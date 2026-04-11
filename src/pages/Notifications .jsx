

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./pages.css"
// ── Load saved notifications from localStorage ─────────────────────────────
const loadNotifs = () => {
  try { return JSON.parse(localStorage.getItem("myshop_notifications") || "[]"); }
  catch { return []; }
};
const saveNotifs = (n) => localStorage.setItem("myshop_notifications", JSON.stringify(n));

// ── Demo notifications ─────────────────────────────────────────────────────
const DEMO_NOTIFS = [
  { id:"n1", type:"order",   icon:"📦", title:"Order Delivered!",           body:"Your order #ORD8F2A1C3D has been delivered. Enjoy your purchase!",         time:"2 hrs ago",  read:false, link:"/orders",  product:null },
  { id:"n2", type:"offer",   icon:"🔥", title:"Flash Sale Ends in 2 Hours", body:"Up to 50% off on Pharmacy products. Grab before it's gone!",               time:"4 hrs ago",  read:false, link:"/pharmacy",product:null },
  { id:"n3", type:"wishlist",icon:"🔔", title:"Vitamin C Serum Back in Stock",body:"An item you wishlisted is now available. Limited stock — order fast!",   time:"Yesterday",  read:false, link:"/wishlist",product:{ name:"Vitamin C Serum", price:349, image:"https://m.media-amazon.com/images/I/61gI5zWkczL._SX679_.jpg" } },
  { id:"n4", type:"offer",   icon:"🎁", title:"Earn 2x Points Today",        body:"Every order today earns double MyShop Points. Don't miss out!",           time:"Yesterday",  read:true,  link:"/rewards", product:null },
  { id:"n5", type:"order",   icon:"🚚", title:"Order Shipped",               body:"Your order #ORD3E9B7F12 is on the way. Expected delivery in 2 days.",     time:"3 days ago", read:true,  link:"/orders",  product:null },
  { id:"n6", type:"wishlist",icon:"💥", title:"Price Drop Alert!",           body:"Pedigree Dog Food price dropped from ₹1200 to ₹899. Buy now!",            time:"3 days ago", read:true,  link:"/petcare", product:{ name:"Pedigree Adult Dog Food", price:899, image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM-OeDkbwAeQ_oydGi5D4v1Qpt1Rw79HN0bQ&s" } },
  { id:"n7", type:"offer",   icon:"🎉", title:"Welcome Bonus Credited",      body:"200 MyShop Points have been added to your account. Start redeeming!",    time:"1 week ago", read:true,  link:"/rewards", product:null },
  { id:"n8", type:"system",  icon:"🔒", title:"Account Security Update",     body:"Your password was changed successfully. If this wasn't you, contact us.", time:"2 weeks ago",read:true,  link:"/profile", product:null },
];

const TYPE_COLORS = {
  order:    { bg:"rgba(34,197,94,0.1)",   border:"#22c55e", label:"Order"   },
  offer:    { bg:"rgba(245,158,11,0.1)",  border:"#f59e0b", label:"Offer"   },
  wishlist: { bg:"rgba(239,68,68,0.1)",   border:"#ef4444", label:"Wishlist"},
  system:   { bg:"rgba(99,102,241,0.1)",  border:"#6366f1", label:"System"  },
};

const FILTER_TABS = ["All","Orders","Offers","Wishlist","System"];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifs,    setNotifs]    = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const stored = loadNotifs();
    setNotifs(stored.length ? stored : DEMO_NOTIFS);
  }, []);

  const markRead = (id) => {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated); saveNotifs(updated);
  };

  const markAllRead = () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setNotifs(updated); saveNotifs(updated);
  };

  const deleteNotif = (id) => {
    const updated = notifs.filter(n => n.id !== id);
    setNotifs(updated); saveNotifs(updated);
  };

  const clearAll = () => { setNotifs([]); saveNotifs([]); };

  const filtered = notifs.filter(n => {
    if (activeTab === "All") return true;
    return n.type === activeTab.toLowerCase();
  });

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="page-root">
      <div className="page-hero notif-hero">
        <div className="page-hero-inner">
          <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
          <div className="page-hero-text">
            <h1>🔔 Notifications</h1>
            <p>{unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "All caught up!"}</p>
          </div>
          <div className="notif-header-actions">
            {unread > 0 && <button className="notif-action-btn" onClick={markAllRead}>✓ Mark All Read</button>}
            {notifs.length > 0 && <button className="notif-action-btn danger" onClick={clearAll}>🗑 Clear All</button>}
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* FILTER TABS */}
        <div className="notif-tabs">
          {FILTER_TABS.map(t => (
            <button key={t} className={`notif-tab ${activeTab === t ? "notif-tab-active" : ""}`}
              onClick={() => setActiveTab(t)}>
              {t}
              {t === "All" && unread > 0 && <span className="notif-badge">{unread}</span>}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div className="notif-list">
            {filtered.map(n => {
              const tc = TYPE_COLORS[n.type] || TYPE_COLORS.system;
              return (
                <div
                  key={n.id}
                  className={`notif-card ${!n.read ? "notif-unread" : ""}`}
                  style={{ borderLeft: `3px solid ${tc.border}` }}
                  onClick={() => markRead(n.id)}
                >
                  <div className="notif-icon-wrap" style={{ background: tc.bg }}>
                    <span>{n.icon}</span>
                  </div>
                  <div className="notif-body">
                    <div className="notif-top-row">
                      <div>
                        <span className="notif-type-label" style={{ color: tc.border }}>{tc.label}</span>
                        <h4>{n.title}</h4>
                      </div>
                      <div className="notif-meta">
                        <span className="notif-time">{n.time}</span>
                        {!n.read && <span className="notif-dot" />}
                      </div>
                    </div>
                    <p>{n.body}</p>

                    {/* Product preview for wishlist/price alerts */}
                    {n.product && (
                      <div className="notif-product">
                        <img src={n.product.image} alt={n.product.name}
                          onError={e => { e.target.src = "https://placehold.co/48x48?text=?"; }} />
                        <div>
                          <span>{n.product.name}</span>
                          <strong>₹{n.product.price}</strong>
                        </div>
                      </div>
                    )}

                    <div className="notif-actions">
                      {n.link && (
                        <Link to={n.link} className="notif-link-btn" onClick={e => e.stopPropagation()}>
                          View Details →
                        </Link>
                      )}
                      <button className="notif-del-btn" onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}>
                        Delete
                      </button>
                    </div>
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

export default Notifications;