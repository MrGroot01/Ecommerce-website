import React, { useState } from "react";
import "./Login.css";

const Login = ({ setShowLogin, setShowRegister, setUser }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!phone || !password) {
      alert("Enter phone and password");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      alert("Please register first");
      return;
    }

    if (phone === savedUser.phone && password === savedUser.password) {
      // store login status
      localStorage.setItem("isLoggedIn", true);

      const savedUser = JSON.parse(localStorage.getItem("user"));
      setUser(savedUser);

      alert("Login Successful");

      setShowLogin(false);
    } else {
      alert("Invalid phone or password");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        {/* CLOSE BUTTON */}
        <span className="close-btn" onClick={() => setShowLogin(false)}>
          ✕
        </span>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn-main">
            Login
          </button>
        </form>

        {/* OR DIVIDER */}

        <div className="divider">
          <span>OR</span>
        </div>

        {/* SOCIAL LOGIN */}

        <div className="social-login">
          <a
            href="https://accounts.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn google"
          >
            <i className="fa-brands fa-google"></i>
          </a>

          <a
            href="https://www.facebook.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn facebook"
          >
            <i className="fa-brands fa-facebook-f"></i>
          </a>
        </div>

        {/* REGISTER LINK */}

        <p className="register-text">
          Don't have an account?
          <span
            onClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
