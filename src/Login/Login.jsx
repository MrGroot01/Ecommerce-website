import React, { useState } from "react";
import "./Login.css";
import { useGoogleLogin } from "@react-oauth/google"; 
const Login = ({ setShowLogin, setShowRegister, setUser }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  /* ── GOOGLE LOGIN FUNCTION ── */
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        const user = await res.json();

        console.log("Google User:", user);

        // store user
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setShowLogin(false);
      } catch (err) {
        console.log("Google fetch error", err);
      }
    },
    onError: () => console.log("Google Login Failed"),
  });
  /* ── inline validation ── */
  const validate = () => {
    const e = {};
    if (!/^[0-9]{10}$/.test(phone)) e.phone = "Enter a valid 10-digit number";
    if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      triggerShake();
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("https://accounts-tyt0.onrender.com/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();

      if (data.message === "Login Successful") {
        const userData = { phone, name: data.name || phone };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setShowLogin(false);
      } else if (data.message?.toLowerCase().includes("register")) {
        setErrors({ api: "Phone not registered. Please create an account." });
        triggerShake();
      } else {
        setErrors({ api: data.message || "Login failed. Try again." });
        triggerShake();
      }
    } catch {
      setErrors({ api: "Server error. Please try again." });
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-overlay"
      onClick={(e) =>
        e.target.classList.contains("auth-overlay") && setShowLogin(false)
      }
    >
      <div className={`auth-modal${shake ? " auth-modal--shake" : ""}`}>
        {/* ── LEFT BRAND PANEL ── */}
        <div className="auth-brand">
          <button
            className="auth-close auth-close--brand"
            onClick={() => setShowLogin(false)}
          >
            ✕
          </button>

          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo__icon">
              <svg
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="44"
                  height="44"
                  rx="12"
                  fill="white"
                  fillOpacity=".15"
                />
                <path d="M11 16h22l-3 14H14L11 16z" fill="white" />
                <path
                  d="M16.5 16c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle
                  cx="17.5"
                  cy="32"
                  r="1.8"
                  fill="rgba(255,255,255,0.6)"
                />
                <circle
                  cx="25.5"
                  cy="32"
                  r="1.8"
                  fill="rgba(255,255,255,0.6)"
                />
              </svg>
            </div>
            <span className="auth-logo__text">
              Quick<strong>Kart</strong>
            </span>
          </div>

          <h2 className="auth-brand__heading">
            India's fastest
            <br />
            grocery delivery
          </h2>
          <p className="auth-brand__sub">
            Fresh products delivered to your door in minutes.
          </p>

          {/* Perks */}
          <ul className="auth-perks">
            {[
              ["⚡", "8-minute delivery"],
              ["🛡️", "100% secure payments"],
              ["↩️", "7-day easy returns"],
              ["🌿", "Fresh & quality assured"],
            ].map(([icon, text]) => (
              <li key={text}>
                <span className="auth-perks__icon">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* Decorative circles */}
          <div className="auth-brand__deco auth-brand__deco--1" />
          <div className="auth-brand__deco auth-brand__deco--2" />
          <div className="auth-brand__deco auth-brand__deco--3" />
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="auth-form-panel">
          <button className="auth-close" onClick={() => setShowLogin(false)}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="auth-form-inner">
            <div className="auth-form-header">
              <h3>Welcome back 👋</h3>
              <p>Sign in to continue shopping</p>
            </div>

            {errors.api && (
              <div className="auth-error-banner">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                {errors.api}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>
              {/* PHONE */}
              <div
                className={`auth-field${errors.phone ? " auth-field--err" : ""}`}
              >
                <label>Phone Number</label>
                <div className="auth-input-wrap">
                  <span className="auth-prefix">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.82 19.79 19.79 0 01.1 2.18 2 2 0 012.08 0H5.08a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                    </svg>
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/, ""));
                      setErrors((p) => ({ ...p, phone: "" }));
                    }}
                  />
                  {phone.length === 10 && !errors.phone && (
                    <span className="auth-tick">✓</span>
                  )}
                </div>
                {errors.phone && (
                  <span className="auth-field__err">{errors.phone}</span>
                )}
              </div>

              {/* PASSWORD */}
              <div
                className={`auth-field${errors.password ? " auth-field--err" : ""}`}
              >
                <label>Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-prefix">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: "" }));
                    }}
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPass((v) => !v)}
                  >
                    {showPass ? (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="auth-field__err">{errors.password}</span>
                )}
                <button type="button" className="auth-forgot">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            {/* SOCIAL */}
            <div className="auth-social">
              <button className="auth-social-btn" onClick={()=>googleLogin()}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="auth-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <p className="auth-switch">
              New to QuickKart?
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Create account →
              </button>
            </p>

            {/* Trust */}
            <div className="auth-trust">
              <span>🔐 SSL Secured</span>
              <span>·</span>
              <span>🛡️ Privacy Protected</span>
              <span>·</span>
              <span>🔒 Safe Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
