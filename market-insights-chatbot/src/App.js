import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeCard from './components/WelcomeCard';

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `This is a simulated response to: "${text}". The real AI API will be connected soon to provide market insights!`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const resetChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <div className="App">
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <h1>Market Insights AI</h1>
          {messages.length > 0 && (
            <button className="back-button" onClick={resetChat}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </header>



        {/* content area */}
        {messages.length === 0 ? (
          <WelcomeCard onSuggestionClick={handleSendMessage} />
        ) : (
          <div className="messages-area">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', marginLeft: '20px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}

export default App;
