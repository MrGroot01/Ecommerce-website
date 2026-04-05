import React, { useState } from "react";
import "./Register.css"

const Register = ({ setShowRegister, setShowLogin }) => {
  const [name,          setName]          = useState("");
  const [phone,         setPhone]         = useState("");
  const [password,      setPassword]      = useState("");
  const [confirmPass,   setConfirmPass]   = useState("");
  const [showPass,      setShowPass]      = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [errors,        setErrors]        = useState({});
  const [shake,         setShake]         = useState(false);
  const [agreed,        setAgreed]        = useState(false);

  /* ── password strength ── */
  const getStrength = (p) => {
    if (!p)           return { score: 0, label: "", color: "" };
    if (p.length < 6) return { score: 1, label: "Weak",   color: "#ef4444" };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p))
                      return { score: 2, label: "Fair",   color: "#f97316" };
    return            { score: 3, label: "Strong", color: "#10b981" };
  };
  const strength = getStrength(password);

  const validate = () => {
    const e = {};
    if (!name.trim())                                    e.name        = "Full name is required";
    if (!/^[0-9]{10}$/.test(phone))                     e.phone       = "Enter a valid 10-digit number";
    if (password.length < 6)                             e.password    = "Minimum 6 characters required";
    if (password !== confirmPass)                        e.confirmPass = "Passwords do not match";
    if (!agreed)                                         e.agreed      = "Please accept terms to continue";
    return e;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); triggerShake(); return; }
    setErrors({});
    setLoading(true);

    try {
      const res  = await fetch("https://accounts-tyt0.onrender.com/api/register/", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: name.trim(), phone, password }),
      });
      const data = await res.json();

      if (res.ok || data.message?.toLowerCase().includes("success")) {
        setShowRegister(false);
        setShowLogin(true);
      } else {
        setErrors({ api: data.message || "Registration failed. Try again." });
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
    <div className="auth-overlay" onClick={(e) => e.target.classList.contains("auth-overlay") && setShowRegister(false)}>
      <div className={`auth-modal auth-modal--register${shake ? " auth-modal--shake" : ""}`}>

        {/* ── LEFT BRAND PANEL ── */}
        <div className="auth-brand auth-brand--register">
          <button className="auth-close auth-close--brand" onClick={() => setShowRegister(false)}>✕</button>

          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo__icon">
              <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="44" height="44" rx="12" fill="white" fillOpacity=".15"/>
                <path d="M11 16h22l-3 14H14L11 16z" fill="white"/>
                <path d="M16.5 16c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
                <circle cx="17.5" cy="32" r="1.8" fill="rgba(255,255,255,0.6)"/>
                <circle cx="25.5" cy="32" r="1.8" fill="rgba(255,255,255,0.6)"/>
              </svg>
            </div>
            <span className="auth-logo__text">Quick<strong>Kart</strong></span>
          </div>

          <h2 className="auth-brand__heading">Join millions<br/>of happy shoppers</h2>
          <p className="auth-brand__sub">Create your free account in under 60 seconds.</p>

          {/* Benefits */}
          <ul className="auth-perks">
            {[
              ["🎁", "₹100 off on your first order"],
              ["⚡", "8-minute express delivery"],
              ["📦", "Track orders in real-time"],
              ["💳", "Exclusive member deals"],
            ].map(([icon, text]) => (
              <li key={text}>
                <span className="auth-perks__icon">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="auth-brand__badge">
            <span>🏆</span>
            <div>
              <strong>4.8★ rated app</strong>
              <span>5M+ happy customers</span>
            </div>
          </div>

          <div className="auth-brand__deco auth-brand__deco--1" />
          <div className="auth-brand__deco auth-brand__deco--2" />
          <div className="auth-brand__deco auth-brand__deco--3" />
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="auth-form-panel">
          <button className="auth-close" onClick={() => setShowRegister(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <div className="auth-form-inner auth-form-inner--register">
            <div className="auth-form-header">
              <h3>Create account ✨</h3>
              <p>Start your shopping journey today</p>
            </div>

            {errors.api && (
              <div className="auth-error-banner">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                {errors.api}
              </div>
            )}

            <form onSubmit={handleRegister} noValidate>

              {/* NAME */}
              <div className={`auth-field${errors.name ? " auth-field--err" : ""}`}>
                <label>Full Name</label>
                <div className="auth-input-wrap">
                  <span className="auth-prefix">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(p=>({...p,name:""})); }}
                  />
                  {name.trim().length > 1 && !errors.name && (
                    <span className="auth-tick">✓</span>
                  )}
                </div>
                {errors.name && <span className="auth-field__err">{errors.name}</span>}
              </div>

              {/* PHONE */}
              <div className={`auth-field${errors.phone ? " auth-field--err" : ""}`}>
                <label>Phone Number</label>
                <div className="auth-input-wrap">
                  <span className="auth-prefix">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.82 19.79 19.79 0 01.1 2.18 2 2 0 012.08 0H5.08a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    maxLength={10}
                    onChange={e => { setPhone(e.target.value.replace(/\D/,"")); setErrors(p=>({...p,phone:""})); }}
                  />
                  {phone.length === 10 && !errors.phone && (
                    <span className="auth-tick">✓</span>
                  )}
                </div>
                {errors.phone && <span className="auth-field__err">{errors.phone}</span>}
              </div>

              {/* PASSWORD */}
              <div className={`auth-field${errors.password ? " auth-field--err" : ""}`}>
                <label>Create Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-prefix">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p=>({...p,password:""})); }}
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPass(v=>!v)}>
                    {showPass
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>

                {/* STRENGTH BAR */}
                {password && (
                  <div className="auth-strength">
                    <div className="auth-strength__bars">
                      {[1,2,3].map(s => (
                        <div
                          key={s}
                          className="auth-strength__bar"
                          style={{ background: strength.score >= s ? strength.color : "#e2e8f0" }}
                        />
                      ))}
                    </div>
                    <span className="auth-strength__label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
                {errors.password && <span className="auth-field__err">{errors.password}</span>}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className={`auth-field${errors.confirmPass ? " auth-field--err" : ""}`}>
                <label>Confirm Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-prefix">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPass}
                    onChange={e => { setConfirmPass(e.target.value); setErrors(p=>({...p,confirmPass:""})); }}
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowConfirm(v=>!v)}>
                    {showConfirm
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                  {confirmPass && password === confirmPass && (
                    <span className="auth-tick">✓</span>
                  )}
                </div>
                {errors.confirmPass && <span className="auth-field__err">{errors.confirmPass}</span>}
              </div>

              {/* TERMS */}
              <label className={`auth-terms${errors.agreed ? " auth-terms--err" : ""}`}>
                <input type="checkbox" checked={agreed} onChange={() => { setAgreed(v=>!v); setErrors(p=>({...p,agreed:""})); }} />
                <span>
                  I agree to the <button type="button" className="auth-link">Terms of Service</button> and{" "}
                  <button type="button" className="auth-link">Privacy Policy</button>
                </span>
              </label>
              {errors.agreed && <span className="auth-field__err" style={{marginTop:-8, display:"block"}}>{errors.agreed}</span>}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading
                  ? <span className="auth-spinner" />
                  : <><span>Create My Account</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                }
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?
              <button onClick={() => { setShowRegister(false); setShowLogin(true); }}>
                Sign in →
              </button>
            </p>

            <div className="auth-trust">
              <span>🔐 SSL Secured</span>
              <span>·</span>
              <span>🛡️ Privacy Protected</span>
              <span>·</span>
              <span>✅ Free to join</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;