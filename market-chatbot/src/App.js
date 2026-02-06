import { useState, useRef, useEffect } from "react";
import "./App.css";

const ghostPrompts = [
  "What’s Tesla’s stock price today?",
  "Explain inflation in simple terms",
  "What does GDP actually mean?",
  "Is the market up today?"
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ghostText, setGhostText] = useState("");
  const endRef = useRef(null);

  const hasMessages = messages.length > 0;

  /* ---------------- Ghost text typing animation ---------------- */
  useEffect(() => {
    if (hasMessages) return;

    let promptIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout;

    const type = () => {
      const current = ghostPrompts[promptIndex];

      if (!deleting && charIndex <= current.length) {
        setGhostText(current.slice(0, charIndex++));
      } else if (deleting && charIndex >= 0) {
        setGhostText(current.slice(0, charIndex--));
      } else if (!deleting) {
        deleting = true;
      } else {
        deleting = false;
        promptIndex = (promptIndex + 1) % ghostPrompts.length;
      }

      timeout = setTimeout(type, deleting ? 40 : 70);
    };

    type();
    return () => clearTimeout(timeout);
  }, [hasMessages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { role: "user", content: input },
      {
        role: "assistant",
        content:
          "I'm your AI-powered Market Insights assistant. I can help you understand stocks, inflation, GDP, market trends, and other financial concepts. What would you like to learn about?"
      }
    ]);

    setInput("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {!hasMessages ? (
        <div className="empty-root">
          {/* Logo */}
          <div className="logo-bubble">
            📈
          </div>

          <h1 className="empty-title">Market Insights Chatbot</h1>
          <p className="empty-subtitle">
            An AI-powered educational tool to explore financial concepts and market trends through natural language interaction
          </p>

          <div className="input-shell">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={ghostText || "Ask a market question…"}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      ) : (
        <div className="chat-root">
          <div className="chat-scroll">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a market question…"
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
