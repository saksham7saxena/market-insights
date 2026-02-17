import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat';

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/chat', async (req, res) => {
    const { message, history } = req.body;

    // Setup generic SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const messages = [
        { role: 'system', content: 'You are a helpful financial assistant. You can answer questions based on your internal knowledge. Note that your knowledge about real-time stock prices might be outdated.' },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message }
    ];

    try {
        const payload = {
            model: "llama3.1",
            messages: messages,
            stream: true
        };

        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        // Handle node-fetch stream
        if (response.body) {
            for await (const chunk of response.body) {
                const text = new TextDecoder().decode(chunk);
                const lines = text.split('\n');
                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const json = JSON.parse(line);
                        if (json.message && json.message.content) {
                            res.write(`data: ${JSON.stringify({ type: 'content', content: json.message.content })}\n\n`);
                        }
                    } catch (e) { }
                }
            }
        }

    } catch (e) {
        res.write(`data: ${JSON.stringify({ type: 'error', content: e.message })}\n\n`);
    }

    res.end();
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});
