import React, { useState, useRef, useEffect } from "react";
import Style from "../Style/ChatSupport.module.scss";
import { FaPaperPlane } from "react-icons/fa";

const ChatSupport = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today? 😊" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const endRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage = inputMessage;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInputMessage("");

    try {
      const res = await fetch("https://trippyjiffy.com/api/chatbot/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // ✅ FIX: backend returns { answer }
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.answer || "No response from server." },
      ]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong 😔" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={Style.chat_container}>
      <div className={Style.chat_header}>Chat Support</div>

      <div className={Style.chat_body}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? Style.user_message
                : Style.bot_message
            }
          >
            {msg.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className={Style.chat_footer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatSupport;
