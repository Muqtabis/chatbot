// src/useChat.js
import { useState } from 'react';

const SYSTEM_PROMPT = `You are CodeBot, a friendly and expert programming assistant.
Your goal is to help users understand complex programming topics.
Always provide clear, concise explanations. After explaining a concept,
always provide a relevant code example using a markdown code block.
Your tone should be encouraging and professional.`;

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    const updatedHistory = [...messages, userMessage];

    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedHistory.map(({ id, ...rest }) => rest),
          system_prompt: SYSTEM_PROMPT
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (!res.body) throw new Error('Response body is null');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      const botMessageId = Date.now() + 1;
      setMessages(prev => [...prev, { id: botMessageId, role: 'model', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'model',
        content: 'Error: Could not reach the chatbot.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};