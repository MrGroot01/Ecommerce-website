import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {

  const [messages, setMessages] = useState([
    { text: "Hi 👋 I am your shopping assistant!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);

    try {

      const res = await fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      const botMsg = {
        text: data.reply || "Something went wrong",
        sender: "bot"
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      setMessages(prev => [...prev, { text: "Server error", sender: "bot" }]);
    }

    setInput("");
  };

  return (
    <div>

      {/* FLOAT BUTTON */}
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="chatbot">

          <div className="chat-header">AI Assistant</div>

          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      )}

    </div>
  );
};

export default Chatbot;