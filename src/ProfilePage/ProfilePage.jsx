import React, { useState, useEffect } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {

  const [savedUser, setSavedUser] = useState({});
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState("");

  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [gender, setGender] = useState("");
  const [married, setMarried] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setSavedUser(user);
    setFormData(user);

    setGender(user.gender || "");
    setMarried(user.married || "");

    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setImage(savedImage);

  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // IMAGE UPLOAD
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

  // SAVE
  const handleSave = () => {
    const updated = {
      ...formData,
      gender,
      married
    };

    localStorage.setItem("user", JSON.stringify(updated));
    setSavedUser(updated);

    setEditPhone(false);
    setEditEmail(false);

    alert("Profile Saved ✅");
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <div className="profile-page">

      {/* LEFT SIDEBAR */}
      <div className="profile-left">

        <div className="left-header">
          <h3>My Account</h3>
          <span>✕</span>
        </div>

        <div className="left-menu active">👤 Profile</div>
        <div className="left-menu">📄 Your Orders</div>
        <div className="left-menu">💻 Saved Devices</div>

        <hr />

        <div className="left-menu">🎬 Stream Library</div>
        <div className="left-menu">💳 QuikPay</div>
        <div className="left-menu">🎁 Rewards</div>

        <div className="signout" onClick={handleLogout}>
          🚪 Sign Out
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="profile-right">

        {/* HEADER */}
        <div className="user-top">

         <div className="avatar-box">
  <img
    src={
      image ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
    alt="profile"
  />

  <label className="upload-icon">
    📷
    <input type="file" onChange={handleImageUpload} />
  </label>
</div>

          <h1>{savedUser.name || "User"}</h1>

        </div>

        {/* ACCOUNT DETAILS */}
        <h3>Account Details</h3>

        <div className="form-row">

          {/* PHONE */}
          <div className="input-box">
            <label>Mobile Number</label>

            <div className="edit-row">
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                disabled={!editPhone}
              />

              <span onClick={() => setEditPhone(true)}>
                ✏ Edit
              </span>
            </div>
          </div>

          {/* EMAIL */}
          <div className="input-box">
            <label>Email Address</label>

            <div className="edit-row">
              <input
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                disabled={!editEmail}
              />

              <span onClick={() => setEditEmail(true)}>
                ✏ Edit
              </span>
            </div>
          </div>

        </div>

        {/* PERSONAL DETAILS */}
        <h3>Personal Details</h3>

        <div className="form-row">

          <div className="input-box">
            <label>First Name</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <label>Last Name</label>
            <input placeholder="Enter last name" />
          </div>

        </div>

        <div className="form-row">

          <div className="input-box">
            <label>Birthday</label>
            <input type="date" />
          </div>

          <div className="input-box">
            <label>Identity</label>

            <div className="toggle-group">
              <button
                className={gender === "woman" ? "active" : ""}
                onClick={() => setGender("woman")}
              >
                Woman
              </button>

              <button
                className={gender === "man" ? "active" : ""}
                onClick={() => setGender("man")}
              >
                Man
              </button>
            </div>
          </div>

        </div>

        {/* MARRIED */}
        <div className="input-box">
          <label>Married?</label>

          <div className="toggle-group">
            <button
              className={married === "yes" ? "active" : ""}
              onClick={() => setMarried("yes")}
            >
              Yes
            </button>

            <button
              className={married === "no" ? "active" : ""}
              onClick={() => setMarried("no")}
            >
              No
            </button>
          </div>
        </div>

        {/* SAVE */}
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>

      </div>

    </div>
  );
};

export default ProfilePage;