import React, { useState } from "react";
import "./Login.css";

const Login = ({ setShowLogin, setShowRegister, setUser }) => {

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      alert("Enter phone and password");
      return;
    }

    try {
      const response = await fetch("https://accounts-tyt0.onrender.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password })
      });

      const data = await response.json();

      if (data.message === "Login Successful") {

        // ✅ Dynamic user
        const userData = {
          phone: phone,
          name: data.name || phone   // 🔥 FIX
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        alert("Login Successful ✅");
        setShowLogin(false);

      } else if (data.message.includes("register")) {

        alert("Phone number not registered. Please register first.");
        setShowLogin(false);
        setShowRegister(true);

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">

        <span className="close-btn" onClick={() => setShowLogin(false)}>✕</span>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <i
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-pass`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button type="submit">Login</button>

        </form>

        <p className="register-text">
          Don't have an account?
          <span onClick={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}>
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;