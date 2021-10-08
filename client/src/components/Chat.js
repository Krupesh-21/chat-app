import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socket = io.connect("http://localhost:5000");
  useEffect(() => {
    socket.on("chatMessage", (payload) => {
      setChat([...chat, payload]);
      console.log("client payload", payload);
    });
    socket.on("chatMessage", (payload) => console.log(payload));
  }, [chat, socket]);
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat", message);
    setMessage("");
  };
  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-room-name">
          <p>Room Name</p>
        </div>
        <div className="chat-leave-btn">
          <button>Leave</button>
        </div>
        <div className="chat-friends">
          <h2>Members</h2>
          <div className="chat-usernames-list">
            <p>Ram</p>
            <p>Lakshman</p>
            <p>Bharat</p>
            <p>Shatrughna</p>
          </div>
        </div>
        <div className="chat-display">
          <div className="message">
            <p className="user-name">Ram</p>
            <p className="user-message">Hello</p>
          </div>
          <div className="message">
            <p className="user-name">Ram</p>
            <p className="user-message">adafafwefu qf qgqfrg qtfrqfg9qyr qr02 g3t2 g2y 2t2t820h23t2h3t2t239to</p>
          </div>
        </div>
        <form className="chat-send-box" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={handleMessage}
            placeholder="Send Message.."
          />
          <button type="submit">
            <i class="far fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
