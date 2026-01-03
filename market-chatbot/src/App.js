import { useState, useEffect, useRef } from 'react';
import { getStockPrice } from './financeApi';
import './App.css';

const samplePrompts = [
  'What is the stock price of Tesla?',
  'Tell me about inflation',
  'What is GDP?'
];

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const animationRef = useRef(null);
  const shouldAnimateRef = useRef(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const companyToSymbol = {
    'Tesla': 'TSLA',
    'Apple': 'AAPL',
    'Microsoft': 'MSFT',
    'Google': 'GOOGL',
    'Amazon': 'AMZN'
  };

  const extractCompanyName = (question) => {
    const lowerQuestion = question.toLowerCase();
    for (const [company, symbol] of Object.entries(companyToSymbol)) {
      if (lowerQuestion.includes(company.toLowerCase())) {
        return symbol;
      }
    }
    return null;
  };

  const handleAsk = async () => {
    const question = input.trim();
    if (!question) return;

    // Expand to full screen on first interaction
    if (!isFullScreen) {
      setIsFullScreen(true);
      shouldAnimateRef.current = false;
      setPlaceholder('');
    }

    // Add user message
    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));

    const lowerQuestion = question.toLowerCase();
    let botResponse = '';
    
    if (lowerQuestion.includes('price') || lowerQuestion.includes('stock')) {
      const symbol = extractCompanyName(question);
      if (symbol) {
        try {
          const priceInfo = await getStockPrice(symbol);
          botResponse = priceInfo;
        } catch (error) {
          botResponse = `Error: ${error.message}`;
        }
      } else {
        botResponse = 'Please specify a company name (e.g., "What is the stock price of Tesla?")';
      }
    } else {
      // Simple hardcoded finance explanations
      if (lowerQuestion.includes('inflation')) {
        botResponse = 'Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power over time. The Federal Reserve typically targets around 2% annual inflation.';
      } else if (lowerQuestion.includes('gdp')) {
        botResponse = 'GDP (Gross Domestic Product) measures the total value of all goods and services produced within a country in a specific time period. It\'s a key indicator of economic health and growth.';
      } else if (lowerQuestion.includes('market')) {
        botResponse = 'Financial markets are platforms where buyers and sellers trade assets like stocks, bonds, and commodities. They help determine prices and facilitate capital allocation in the economy.';
      } else {
        botResponse = 'I can help with stock prices (ask about price or stock), inflation, GDP, or markets. Try asking: "What is the stock price of Tesla?"';
      }
    }

    setIsLoading(false);
    setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  useEffect(() => {
    if (!shouldAnimateRef.current || isFullScreen) return;

    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    let promptIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typePrompt = () => {
      if (!shouldAnimateRef.current || isFullScreen) {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
        return;
      }

      const currentPrompt = samplePrompts[promptIndex];
      
      if (!isDeleting && charIndex <= currentPrompt.length) {
        setPlaceholder(currentPrompt.substring(0, charIndex));
        charIndex++;
        animationRef.current = setTimeout(typePrompt, 67);
      } else if (isDeleting && charIndex >= 0) {
        setPlaceholder(currentPrompt.substring(0, charIndex));
        charIndex--;
        animationRef.current = setTimeout(typePrompt, 33);
      } else if (!isDeleting && charIndex > currentPrompt.length) {
        animationRef.current = setTimeout(() => {
          if (shouldAnimateRef.current && !isFullScreen) {
            isDeleting = true;
            typePrompt();
          }
        }, 1375);
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        promptIndex = (promptIndex + 1) % samplePrompts.length;
        animationRef.current = setTimeout(typePrompt, 208);
      }
    };

    typePrompt();

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [input, isFullScreen]);

  return (
    <div className={`chatbot-container ${isFullScreen ? 'fullscreen' : ''}`}>
      <div className={`chatbot-wrapper ${isFullScreen ? 'fullscreen' : ''}`} ref={chatContainerRef}>
        {!isFullScreen ? (
          <>
            <div className="icon-container">
              <svg className="chatbot-icon" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#a855f7', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#818cf8', stopOpacity: 0.9}} />
                    <stop offset="100%" style={{stopColor: '#c084fc', stopOpacity: 0.7}} />
                  </linearGradient>
                  <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
                    <feOffset in="blur" dx="0" dy="6" result="offsetBlur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.25"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <path d="M 28 22 
                         C 22 22, 18 26, 18 32 
                         L 18 68 
                         C 18 74, 22 78, 28 78 
                         L 38 78 
                         L 38 88 
                         L 48 78 
                         L 82 78 
                         C 88 78, 92 74, 92 68 
                         L 92 32 
                         C 92 26, 88 22, 82 22 
                         Z" 
                      fill="url(#mainGradient)" 
                      filter="url(#softShadow)"/>
                
                <path d="M 30 25 
                         C 25 25, 22 28, 22 32 
                         L 22 68 
                         C 22 72, 25 75, 30 75 
                         L 40 75 
                         L 40 83 
                         L 48 75 
                         L 80 75 
                         C 85 75, 88 72, 88 68 
                         L 88 32 
                         C 88 28, 85 25, 80 25 
                         Z" 
                      fill="url(#highlightGradient)" 
                      opacity="0.6"/>
                
                <path d="M 38 58 L 46 55 L 54 50 L 62 45 L 70 40" 
                      stroke="rgba(255, 255, 255, 0.85)" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"/>
                
                <circle cx="38" cy="58" r="2.5" fill="rgba(255, 255, 255, 0.95)"/>
                <circle cx="46" cy="55" r="2.5" fill="rgba(255, 255, 255, 0.95)"/>
                <circle cx="54" cy="50" r="2.5" fill="rgba(255, 255, 255, 0.95)"/>
                <circle cx="62" cy="45" r="2.5" fill="rgba(255, 255, 255, 0.95)"/>
                <circle cx="70" cy="40" r="2.5" fill="rgba(255, 255, 255, 0.95)"/>
                
                <path d="M 30 25 L 80 25" 
                      stroke="rgba(255, 255, 255, 0.4)" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"/>
              </svg>
            </div>
            
            <h1 className="chatbot-title">Market Insights Chatbot</h1>
            <p className="chatbot-subtitle">Ask me about stocks, inflation, GDP, or markets</p>

            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  shouldAnimateRef.current = false;
                  setPlaceholder('');
                }}
                onBlur={() => {
                  if (!input) {
                    shouldAnimateRef.current = true;
                  }
                }}
                placeholder={input ? 'Ask a question...' : placeholder}
                className="chatbot-input"
              />
              <button onClick={handleAsk} className="chatbot-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="chat-interface">
            <div className="chat-messages-container">
              <div className="chat-messages" ref={chatContainerRef}>
                {messages.length === 0 && (
                  <div className="welcome-message">
                    <h1 className="chatbot-title">Market Insights Chatbot</h1>
                    <p className="chatbot-subtitle">Ask me about stocks, inflation, GDP, or markets</p>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.role}`}>
                    <div className="message-content">
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message assistant">
                    <div className="message-content">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <div className="chat-input-wrapper">
              <div className="chat-input-container">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question..."
                  className="chatbot-input fullscreen-input"
                  autoFocus
                />
                <button onClick={handleAsk} className="chatbot-button fullscreen-button" disabled={isLoading || !input.trim()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
