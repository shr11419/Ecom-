import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiX, FiSend, FiMessageCircle } from "react-icons/fi";

export default function ChatBot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name || "there"}! 👋 I'm ShopHub's assistant. Ask me anything about products, orders, returns or sizing!`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMessage = { role: "user", content: userText };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.role !== "system")
        .map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{
                text: `You are ShopHub's friendly customer assistant.
ShopHub sells electronics, beauty, clothing, jewellery, furniture and groceries.
Current user: ${user?.name || "Guest"} (${user?.email || "not logged in"}).
Keep all replies under 3 sentences. Be friendly and use emojis occasionally.
For orders: tell them to check their email for tracking info.
For returns: ShopHub has a 30-day return policy.
For sizing: suggest checking the product description page.`
              }]
            },
            contents: [
              ...history,
              { role: "user", parts: [{ text: userText }] }
            ],
            generationConfig: {
              maxOutputTokens: 300,
              temperature: 0.7,
            }
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Gemini error:", data.error);
        throw new Error(data.error.message);
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
        || "Sorry, I couldn't respond right now.";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Oops! Something went wrong 😅 Please try again."
      }]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🛍️</div>
              <div>
                <p className="chatbot-name">ShopHub Assistant</p>
                <p className="chatbot-status">● Online</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-bubble ${msg.role === "user" ? "user" : "bot"}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chatbot-bubble bot">
                <div className="chatbot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              className="chatbot-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chatbot-send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        className="chatbot-fab"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>
    </>
  );
}