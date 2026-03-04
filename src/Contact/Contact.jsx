import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

const Contact = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_tebaxvm",
      "template_cuh2u0w",
      {
        name: form.name,
        email: form.email,
        message: form.message
      },
      "ryF8HWQaIgJro76An"
    )
    .then(() => {
      setStatus("✅ Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    })
    .catch((error) => {
      console.error(error);
      setStatus("❌ Failed to send message.");
    });
  };

  return (
    <section className="contact-page">

      <div className="contact-wrapper">


        <div className="contact-left">
          <h1>
            We would <span className="heart">❤</span> to <br />
            hear from you
          </h1>
        </div>


        <div className="contact-right">
          <p>
            For any queries or assistance, feel free to reach out
            to us at <strong>kirand09876@gmail.com</strong>
          </p>
        </div>

      </div>


      {status && <p className="status-msg">{status}</p>}


      <div className="contact-form-section">

        <form className="contact-form" onSubmit={sendEmail}>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>

        </form>

      </div>

      <footer className="contact-footer">

  <div className="social-icons">

    <a href="https://instagram.com" target="_blank" rel="noreferrer">
      <i className="fab fa-instagram"></i>
    </a>

    <a href="https://facebook.com" target="_blank" rel="noreferrer">
      <i className="fab fa-facebook"></i>
    </a>

    <a href="https://twitter.com" target="_blank" rel="noreferrer">
      <i className="fab fa-twitter"></i>
    </a>

  </div>

  <p>© 2026 QuickCart. All Rights Reserved.</p>

</footer>

    </section>
  );
};

export default Contact;