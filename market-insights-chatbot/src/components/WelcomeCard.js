import React from 'react';
import '../App.css';

const WelcomeCard = ({ onSuggestionClick }) => {
  const suggestions = [
    "What are the latest market trends?",
    "Explain 'Bull Market' vs 'Bear Market'",
    "How does inflation affect stock prices?",
    "What is an ETF?"
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1 className="welcome-title">Market Insights AI</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          Your personal guide to understanding financial markets.
          Ask me anything about stocks, trends, or economic concepts.
        </p>
      </div>
    </div>
  );
};

export default WelcomeCard;
