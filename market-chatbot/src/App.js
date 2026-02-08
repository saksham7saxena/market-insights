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
    if (hasMessages) {
      setGhostText("");
      return;
    }

    let promptIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout;
    let isMounted = true;
    let isTransitioning = false;

    const type = () => {
      if (!isMounted || isTransitioning) return;

      const current = ghostPrompts[promptIndex];

      if (!deleting && charIndex < current.length) {
        setGhostText(current.slice(0, charIndex + 1));
        charIndex++;
      } else if (deleting && charIndex > 0) {
        charIndex--;
        setGhostText(current.slice(0, charIndex));
      } else if (!deleting && charIndex === current.length) {
        // Wait at end before deleting
        deleting = true;
      } else if (deleting && charIndex === 0) {
        // Finished deleting, move to next prompt
        isTransitioning = true;
        setGhostText(""); // Clear immediately
        deleting = false;
        promptIndex = (promptIndex + 1) % ghostPrompts.length;
        charIndex = 0;
        // Small delay before starting next prompt
        timeout = setTimeout(() => {
          isTransitioning = false;
          type();
        }, 400);
        return;
      }

      if (!isTransitioning) {
        timeout = setTimeout(type, deleting ? 40 : 70);
      }
    };

    type();
    return () => {
      isMounted = false;
      isTransitioning = false;
      clearTimeout(timeout);
    };
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

  const resetChat = () => {
    setMessages([]);
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
              placeholder={ghostText || ""}
              data-ghost-text={ghostText}
            />
            <button onClick={sendMessage} className="send-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-root">
          <button className="back-button" onClick={resetChat} aria-label="Start over">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Start Over</span>
          </button>
          
          <div className="chat-scroll">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`} style={{ animationDelay: `${i * 0.05}s` }}>
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
            <button onClick={sendMessage} className="send-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
