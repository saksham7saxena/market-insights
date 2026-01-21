# OpenAI API Setup Guide

This chatbot is designed to use the OpenAI API to provide intelligent market insights. Currently, it runs in a simulated mode. Follow these steps to connect the real API.

## 1. Get an API Key

1.  Log in to the [OpenAI Platform](https://platform.openai.com/).
2.  Navigate to **Dashboard** -> **API keys**.
3.  Click **Create new secret key**.
4.  Copy the key (starts with `sk-...`). **Do not share this key.**

## 2. Secure Implementation (Recommended)

**IMPORTANT:** Never store your API key directly in the React frontend code (e.g., in `App.js`). If you do, it will be visible to anyone who visits your site, and OpenAI will likely revoke it automatically.

### Option A: Use a Backend Proxy (Best Practice)
1.  Set up a small backend server (Node.js/Express, Python/Flask, or Next.js API Routes).
2.  Store the API Key in a `.env` file on the backend: `OPENAI_API_KEY=sk-...`
3.  Create an endpoint (e.g., `/api/chat`) that forwards requests to OpenAI.
4.  Call your backend endpoint from `App.js`.

### Option B: Local Testing Only (Frontend)
If you are only running this locally for testing:
1.  Create a `.env` file in the project root.
2.  Add: `REACT_APP_OPENAI_API_KEY=sk-...`
3.  Restart your server.

## 3. Integrating the API

In `src/App.js`, replace the `handleSendMessage` simulation with the actual API call:

```javascript
const handleSendMessage = async (text) => {
  // Add user message to state
  const userMessage = { id: Date.now(), text, sender: 'user' };
  setMessages(prev => [...prev, userMessage]);
  setIsTyping(true);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` 
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful financial market assistant." },
            ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    const botResponseText = data.choices[0].message.content;

    const botMessage = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
    setMessages(prev => [...prev, botMessage]);

  } catch (error) {
    console.error("Error:", error);
    // Handle error UI
  } finally {
    setIsTyping(false);
  }
};
```
