import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [savedUser, setSavedUser] = useState({});
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState("");
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [gender, setGender] = useState("");
  const [married, setMarried] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setSavedUser(user);
    setFormData(user);
    setGender(user.gender || "");
    setMarried(user.married || "");
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setImage(savedImage);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updated = { ...formData, gender, married };
    localStorage.setItem("user", JSON.stringify(updated));
    setSavedUser(updated);
    setEditPhone(false);
    setEditEmail(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  const initials = (savedUser.name || "U")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const navItems = [
    { key: "profile",   icon: "👤", label: "My Profile",     sub: "Personal info & settings" },
    { key: "orders",    icon: "📦", label: "Your Orders",     sub: "Track & manage orders"    },
    { key: "wishlist",  icon: "❤️", label: "Wishlist",        sub: "Saved for later"          },
    { key: "addresses", icon: "📍", label: "Addresses",       sub: "Delivery locations"       },
    { key: "rewards",   icon: "🎁", label: "Rewards",         sub: "840 pts available"        },
    { key: "devices",   icon: "📱", label: "Saved Devices",   sub: "Manage your devices"      },
    { key: "payments",  icon: "💳", label: "QuikPay",         sub: "Saved cards & UPI"        },
  ];

  return (
    <div className="pp-root">
      {/* ── SAVE TOAST ── */}
      {saved && (
        <div className="pp-toast">
          <span>✅</span> Profile saved successfully!
        </div>
      )}

      <div className="pp-wrap">
        {/* ════════ LEFT SIDEBAR ════════ */}
        <aside className="pp-sidebar">
          {/* User mini card */}
          <div className="pp-sb-user">
            <div className="pp-sb-avatar">
              {image
                ? <img src={image} alt="profile" />
                : <span>{initials}</span>
              }
            </div>
            <div className="pp-sb-info">
              <strong>{savedUser.name || "User"}</strong>
              <span>{savedUser.email || "user@email.com"}</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="pp-nav">
            <p className="pp-nav-label">Account</p>
            {navItems.map(item => (
              <button
                key={item.key}
                className={`pp-nav-item ${activeTab === item.key ? "pp-nav-active" : ""}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span className="pp-nav-icon">{item.icon}</span>
                <div className="pp-nav-text">
                  <span>{item.label}</span>
                  <small>{item.sub}</small>
                </div>
                {activeTab === item.key && (
                  <svg className="pp-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </button>
            ))}

            <div className="pp-nav-divider" />

            <button className="pp-nav-item pp-nav-logout" onClick={handleLogout}>
              <span className="pp-nav-icon">🚪</span>
              <div className="pp-nav-text"><span>Sign Out</span></div>
            </button>
          </nav>
        </aside>

        {/* ════════ RIGHT CONTENT ════════ */}
        <main className="pp-main">

          {/* Profile Header */}
          <div className="pp-profile-header">
            <div className="pp-avatar-wrap">
              <div className="pp-avatar">
                {image
                  ? <img src={image} alt="profile" />
                  : <span>{initials}</span>
                }
                <label className="pp-camera" title="Upload photo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="pp-header-info">
              <h1 className="pp-username">{savedUser.name || "User"}</h1>
              <p className="pp-useremail">{savedUser.email || "user@email.com"}</p>
              <div className="pp-badges">
                <span className="pp-badge pp-badge-green">✅ Verified</span>
                <span className="pp-badge pp-badge-amber">⭐ 840 Points</span>
                <span className="pp-badge pp-badge-blue">🔒 Secure Account</span>
              </div>
            </div>
          </div>

          {/* ── ACCOUNT DETAILS ── */}
          <div className="pp-section">
            <div className="pp-section-head">
              <h2>Account Details</h2>
              <p>Manage your contact information</p>
            </div>

            <div className="pp-form-grid">
              {/* Phone */}
              <div className="pp-field">
                <label>
                  <span className="pp-field-icon">📱</span>
                  Mobile Number
                </label>
                <div className="pp-input-row">
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    disabled={!editPhone}
                    placeholder="Enter mobile number"
                    className={editPhone ? "pp-input-active" : ""}
                  />
                  <button
                    className={`pp-edit-btn ${editPhone ? "pp-edit-done" : ""}`}
                    onClick={() => setEditPhone(e => !e)}
                  >
                    {editPhone ? (
                      <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg> Done</>
                    ) : (
                      <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> Edit</>
                    )}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="pp-field">
                <label>
                  <span className="pp-field-icon">✉️</span>
                  Email Address
                </label>
                <div className="pp-input-row">
                  <input
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled={!editEmail}
                    placeholder="Enter email address"
                    className={editEmail ? "pp-input-active" : ""}
                  />
                  <button
                    className={`pp-edit-btn ${editEmail ? "pp-edit-done" : ""}`}
                    onClick={() => setEditEmail(e => !e)}
                  >
                    {editEmail ? (
                      <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg> Done</>
                    ) : (
                      <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> Edit</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── PERSONAL DETAILS ── */}
          <div className="pp-section">
            <div className="pp-section-head">
              <h2>Personal Details</h2>
              <p>Your basic personal information</p>
            </div>

            <div className="pp-form-grid">
              <div className="pp-field">
                <label><span className="pp-field-icon">👤</span> First Name</label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="pp-input"
                />
              </div>

              <div className="pp-field">
                <label><span className="pp-field-icon">👤</span> Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="pp-input"
                />
              </div>

              <div className="pp-field">
                <label><span className="pp-field-icon">🎂</span> Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className="pp-input"
                />
              </div>

              <div className="pp-field">
                <label><span className="pp-field-icon">⚧</span> Gender</label>
                <div className="pp-toggle-group">
                  {["Woman", "Man", "Other"].map(g => (
                    <button
                      key={g}
                      className={`pp-toggle ${gender === g.toLowerCase() ? "pp-toggle-on" : ""}`}
                      onClick={() => setGender(g.toLowerCase())}
                    >
                      {g === "Woman" ? "👩 " : g === "Man" ? "👨 " : "🧑 "}{g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pp-field">
                <label><span className="pp-field-icon">💍</span> Marital Status</label>
                <div className="pp-toggle-group">
                  {["Yes", "No"].map(m => (
                    <button
                      key={m}
                      className={`pp-toggle ${married === m.toLowerCase() ? "pp-toggle-on" : ""}`}
                      onClick={() => setMarried(m.toLowerCase())}
                    >
                      {m === "Yes" ? "💍 " : "🙂 "}{m === "Yes" ? "Married" : "Single"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pp-field">
                <label><span className="pp-field-icon">📍</span> City</label>
                <input
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="pp-input"
                />
              </div>
            </div>
          </div>

          {/* ── SECURITY ── */}
          <div className="pp-section">
            <div className="pp-section-head">
              <h2>Security</h2>
              <p>Password and account protection</p>
            </div>
            <div className="pp-security-row">
              <div className="pp-security-item">
                <div className="pp-sec-icon">🔐</div>
                <div>
                  <strong>Password</strong>
                  <p>Last changed 3 months ago</p>
                </div>
                <button className="pp-sec-btn">Change</button>
              </div>
              <div className="pp-security-item">
                <div className="pp-sec-icon">📲</div>
                <div>
                  <strong>Two-Factor Auth</strong>
                  <p>Add an extra layer of security</p>
                </div>
                <button className="pp-sec-btn">Enable</button>
              </div>
            </div>
          </div>

          {/* ── SAVE BUTTON ── */}
          <div className="pp-save-bar">
            <button className="pp-save-btn" onClick={handleSave}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Changes
            </button>
            <button className="pp-cancel-btn" onClick={() => {
              setFormData(savedUser);
              setGender(savedUser.gender || "");
              setMarried(savedUser.married || "");
            }}>
              Discard
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;