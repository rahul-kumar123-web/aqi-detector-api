import { useState } from "react";
import "./AQIChatbot.css";
import api from "../api/axios";

const AQIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 Hi! I'm your AQI Assistant. Ask me about AQI, pollution, PM2.5, PM10 or any supported city.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customMessage = null) => {
    const trimmedMessage = (customMessage ?? input).trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chatbot", {
        message: trimmedMessage,
      });

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          response.data?.data?.reply ||
          "Sorry, I could not understand your question.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        botMessage,
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          "❌ Sorry, I couldn't connect to the AQI server. Please make sure the backend is running.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open AQI Assistant"
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="aqi-chatbot">

          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">

              <div className="chatbot-avatar">
                🤖
              </div>

              <div>
                <h3>AQI Assistant</h3>

                <span>
                  <span className="online-dot"></span>
                  Online
                </span>
              </div>

            </div>

            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender}`}
              >

                {message.sender === "bot" && (
                  <div className="message-avatar">
                    🤖
                  </div>
                )}

                <div className="message-bubble">
                  {message.text}
                </div>

              </div>
            ))}

            {loading && (
              <div className="chat-message bot">

                <div className="message-avatar">
                  🤖
                </div>

                <div className="message-bubble">
                  Typing...
                </div>

              </div>
            )}

          </div>

          {/* Quick Questions */}
          <div className="quick-questions">

            <button
              onClick={() => sendMessage("What is AQI?")}
            >
              What is AQI?
            </button>

            <button
              onClick={() => sendMessage("What is PM2.5?")}
            >
              PM2.5?
            </button>

            <button
              onClick={() => sendMessage("What is air pollution?")}
            >
              Air pollution?
            </button>

          </div>

          {/* Input */}
          <div className="chatbot-input-area">

            <input
              type="text"
              placeholder="Ask about air quality..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading}
              aria-label="Send message"
            >
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default AQIChatbot;