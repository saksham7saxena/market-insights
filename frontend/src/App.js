import { useState, useRef, useEffect } from "react";
import "./App.css";
import { chatStream } from "./api";

const ghostPrompts = [
  "Explain the difference between stocks and bonds",
  "What is the S&P 500?",
  "How does compound interest work?",
  "What is a bear market?"
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ghostText, setGhostText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
        deleting = true;
      } else if (deleting && charIndex === 0) {
        isTransitioning = true;
        setGhostText("");
        deleting = false;
        promptIndex = (promptIndex + 1) % ghostPrompts.length;
        charIndex = 0;
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

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Placeholder for assistant message
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    await chatStream(
      userMsg.content,
      messages, // History (excluding current user msg, handled by backend usually, allows filtering)
      (chunk) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];

          if (chunk.type === "content") {
            // Append content
            lastMsg.content += chunk.content;
          } else if (chunk.type === "tool_start") {
            // Maybe show a status indicator? For now, just append a newline or similar if desired.
            // Or we could have a separate 'status' field in the message object.
            // Let's just ignore for now to keep UI simple, or maybe prepend "Checking [tool]..."
          } else if (chunk.type === "error") {
            lastMsg.content += `\n[Error: ${chunk.content}]`;
          }

          return newMessages;
        });
      },
      () => {
        setIsTyping(false);
      },
      (err) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          lastMsg.content += `\n[Error: ${err.message}]`;
          return newMessages;
        });
        setIsTyping(false);
      }
    );
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
          <div className="logo-bubble">📈</div>
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
                <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-root">
          <button className="back-button" onClick={resetChat} aria-label="Start over">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Start Over</span>
          </button>

          <div className="chat-scroll">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            {isTyping && messages[messages.length - 1].role !== "assistant" && (
              <div className="bubble assistant">Thinking...</div>
            )}
            <div ref={endRef} />
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a market question…"
              disabled={isTyping}
            />
            <button onClick={sendMessage} className="send-button" disabled={isTyping}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

