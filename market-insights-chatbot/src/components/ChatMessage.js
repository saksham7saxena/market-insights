import React from 'react';
import '../App.css';

const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';

    const messageStyle = {
        maxWidth: '80%',
        padding: '16px 24px',
        borderRadius: '20px',
        marginBottom: '20px',
        animation: 'messagePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        alignSelf: isUser ? 'flex-start' : 'flex-end', // User Left, Bot Right
        backgroundColor: isUser
            ? 'rgba(255, 255, 255, 0.6)'
            : 'var(--primary-accent)',
        border: isUser
            ? '1px solid rgba(255, 255, 255, 0.4)'
            : 'none',
        color: isUser ? 'var(--text-primary)' : '#fff',
        backdropFilter: 'blur(5px)',
        borderBottomLeftRadius: isUser ? '4px' : '20px',
        borderBottomRightRadius: isUser ? '20px' : '4px',
        lineHeight: '1.6',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    };

    const senderLabelStyle = {
        fontSize: '0.75rem',
        marginBottom: '6px',
        opacity: 0.6,
        textAlign: isUser ? 'left' : 'right',
        marginLeft: isUser ? '12px' : 0,
        marginRight: isUser ? 0 : '12px',
        color: 'var(--text-secondary)'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={senderLabelStyle}>
                {isUser ? 'You' : 'Market Bot'}
            </div>
            <div style={messageStyle}>
                {message.text}
            </div>
        </div>
    );
};

export default ChatMessage;
