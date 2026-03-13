import React, { useState } from "react";
import "./Register.css";

const Register = ({ setShowRegister, setShowLogin }) => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !phone || !password) {
      alert("Please fill all fields");
      return;
    }

    if (phone.length !== 10) {
      alert("Enter valid phone number");
      return;
    }

    const user = {
      name,
      phone,
      password
    };

    // Save user in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    alert("Registration Successful");

    // Close register and open login
    setShowRegister(false);
    setShowLogin(true);
  };

  return (

    <div className="login-overlay">

      <div className="login-modal">

        {/* Close Button */}
        <span
          className="close-btn"
          onClick={() => setShowRegister(false)}
        >
          ✕
        </span>

        <h2>Register</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="register-btn">
            Register
          </button>

        </form>

        {/* Switch to Login */}
        <p className="register-text">
          Already have an account?{" "}
          <span
            onClick={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          >
            Login
          </span>
        </p>

      </div>

    </div>

  );
};

export default Register;