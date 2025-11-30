import { useState, useRef } from 'react';

const SYSTEM_PROMPT = `You are a helpful expert developer. Always format code using markdown.`;

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    stopGenerating();
    setMessages([]);
  };

  const sendMessage = async (input) => {
    if (!input.trim()) return;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const backendUrl = window.location.hostname === 'localhost' 
  ? 'http://127.0.0.1:8000' 
  : 'https://chatbot-backend-bhkw.onrender.com'; // Ensure this matches your backend
      const res = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: [...messages, userMessage].map(({ id, ...rest }) => rest),
          system_prompt: SYSTEM_PROMPT
        }),
        signal: controller.signal
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      const botId = Date.now() + 1;
      setMessages(prev => [...prev, { id: botId, role: 'model', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages(prev => prev.map(msg => 
          msg.id === botId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => [...prev, { id: Date.now(), role: 'model', content: 'Error: Could not reach the server.' }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return { messages, isLoading, sendMessage, stopGenerating, clearChat };
};