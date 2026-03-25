import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSidebar.css";

const ProfileSidebar = ({ show, setShow, user, setUser }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setUser(null);
    setShow(false);
    navigate("/");
  };

  return (
    <div
      className={`sidebar-overlay ${show ? "active" : ""}`}
      onClick={() => setShow(false)}   // ✅ close on outside click
    >

      <div
        className="sidebar"
        onClick={(e) => e.stopPropagation()} // ✅ prevent close inside
      >

        {/* HEADER */}
        <div className="sidebar-header">
          <h2>Hey!</h2>
          <p>{user?.name || "Guest"}</p>
          <span onClick={() => setShow(false)}>✕</span>
        </div>

        {/* MENU */}
        <div className="sidebar-menu">

          {/* NOTIFICATIONS */}
          <div
            className="menu-item"
            onClick={() => {
              navigate("/notifications");
              setShow(false);
            }}
          >
            🔔 Notifications
          </div>

          {/* ORDERS */}
          <div
            className="menu-item"
            onClick={() => {
              navigate("/orders");
              setShow(false);
            }}
          >
            📦 Orders History
          </div>

          {/* SETTINGS → PROFILE PAGE */}
          <div
            className="menu-item"
            onClick={() => {
              navigate("/profile");
              setShow(false);
            }}
          >
            ⚙ Settings
          </div>

          {/* HELP */}
          <div className="menu-item">
            💬 Customer Help
          </div>

          {/* DEVICES */}
          <div className="menu-item">
            📱 Devices
          </div>

          {/* REWARDS */}
          <div className="menu-item">
            🎁 Rewards
          </div>

        </div>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          Sign out
        </button>

      </div>

    </div>
  );
};

export default ProfileSidebar;