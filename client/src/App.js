import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const ws = new WebSocket("ws://localhost:5000");

function App() {
  const [userId, setUserId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatRef = useRef([]);

  useEffect(() => {
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "message") {
        chatRef.current = [...chatRef.current, data];
        setChat([...chatRef.current]);
      }
    };
  }, []);

  const register = () => {
    if (userId.trim()) {
      ws.send(JSON.stringify({ type: "register", userId }));
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !targetId.trim()) return;
    const msg = {
      type: "message",
      from: userId,
      to: targetId,
      text: message,
      time: new Date().toLocaleTimeString(),
    };
    ws.send(JSON.stringify(msg));
    chatRef.current = [...chatRef.current, msg];
    setChat([...chatRef.current]);
    setMessage("");
  };

  return (
    <div className="chat-app">
      <header>
        <h1>Real-Time Chat</h1>
      </header>

      <div className="user-panel">
        <input
          className="small-input"
          placeholder="Your ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={register}>Register</button>
        <input
          className="small-input"
          placeholder="Recipient ID"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        />
      </div>

      <div className="chat-window">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              msg.from === userId ? "sent" : "received"
            }`}
          >
            <span className="sender">{msg.from}</span>
            <p>{msg.text}</p>
            <span className="time">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="input-panel">
        <input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
