import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSidebar.css";

const ProfileSidebar = ({ show, setShow, user, setUser }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setUser(null);
    setShow(false);
    navigate("/");
  };

  const go = (path) => {
    setActiveItem(path);
    setTimeout(() => {
      navigate(path);
      setShow(false);
      setActiveItem(null);
    }, 120);
  };

  /* Fake stats — replace with real data if available */
  const stats = [
    { label: "Orders", value: "12", icon: "📦" },
    { label: "Rewards", value: "840", icon: "⭐" },
    { label: "Wishlist", value: "5", icon: "❤️" },
  ];

  const menuGroups = [
    {
      title: "My Account",
      items: [
        { icon: "📦", label: "Orders History",  sub: "Track & manage orders",    path: "/orders"        },
        { icon: "❤️", label: "Wishlist",         sub: "Saved for later",          path: "/wishlist"      },
        { icon: "🎁", label: "Rewards & Points", sub: "840 pts available",        path: "/rewards"       },
        { icon: "📍", label: "Saved Addresses",  sub: "Manage delivery addresses", path: "/addresses"   },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "🔔", label: "Notifications",    sub: "Alerts & updates",        path: "/notifications" },
        { icon: "💬", label: "Customer Help",     sub: "Chat, call or email us",  path: "/help"          },
        { icon: "↩️", label: "Returns & Refunds", sub: "Easy 7-day returns",      path: "/returns"       },
      ],
    },
    {
      title: "Settings",
      items: [
        { icon: "⚙️", label: "Account Settings", sub: "Profile, password, email", path: "/profile"     },
        { icon: "📱", label: "Devices",           sub: "Manage logged-in devices", path: "/devices"     },
      ],
    },
  ];

  const initials = (user?.name || "G")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`psb-overlay ${show ? "psb-active" : ""}`}
      onClick={() => setShow(false)}
    >
      <div className="psb" onClick={(e) => e.stopPropagation()}>

        {/* ── TOP BAR ── */}
        <div className="psb-topbar">
          <span className="psb-logo">🛒 MyShop</span>
          <button className="psb-close" onClick={() => setShow(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── PROFILE HERO ── */}
        <div className="psb-profile">
          <div className="psb-avatar">
            <span>{initials}</span>
            <span className="psb-avatar-ring" />
          </div>
          <div className="psb-profile-info">
            <h3 className="psb-name">Hey, {user?.name || "Guest"}! 👋</h3>
            <p className="psb-email">{user?.email || "user@email.com"}</p>
            <button className="psb-edit-btn" onClick={() => go("/profile")}>
              Edit Profile →
            </button>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="psb-stats">
          {stats.map((s, i) => (
            <div key={i} className="psb-stat">
              <span className="psb-stat-icon">{s.icon}</span>
              <span className="psb-stat-val">{s.value}</span>
              <span className="psb-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── MENU ── */}
        <div className="psb-scroll">
          {menuGroups.map((group, gi) => (
            <div key={gi} className="psb-group">
              <p className="psb-group-title">{group.title}</p>
              {group.items.map((item, ii) => (
                <button
                  key={ii}
                  className={`psb-item ${activeItem === item.path ? "psb-item-active" : ""}`}
                  onClick={() => go(item.path)}
                >
                  <span className="psb-item-icon">{item.icon}</span>
                  <div className="psb-item-text">
                    <span className="psb-item-label">{item.label}</span>
                    <span className="psb-item-sub">{item.sub}</span>
                  </div>
                  <svg className="psb-item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div className="psb-footer">
          <div className="psb-offer-pill">
            🎉 Use <strong>FIRST20</strong> for 20% off your next order
          </div>
          <button className="psb-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileSidebar;