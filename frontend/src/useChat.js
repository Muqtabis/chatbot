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
// 2. Create a ref to hold the AbortController
  const abortControllerRef = useRef(null);
  // 3. Create the new "stop generating" function
  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel the fetch request
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };
  const sendMessage = async (input) => {
    if (!input.trim()) return;
// 4. Create a new AbortController for this specific request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    const updatedHistory = [...messages, userMessage];

    setMessages(updatedHistory);
    setIsLoading(true);

    try {
        // Use the environment variable for the backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedHistory.map(({ id, ...rest }) => rest),
          system_prompt: SYSTEM_PROMPT
        }),
        signal: controller.signal // 5. Pass the signal to fetch
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
        if (err.name === 'AbortError') {
        console.log('Fetch aborted by user.');
      } else {
      console.error('Failed to send message:', err);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'model',
        content: 'Error: Could not reach the chatbot.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }} finally {
      setIsLoading(false);
      abortControllerRef.current = null; // Clean up the controller
    }
  };

  return { messages, isLoading, sendMessage, stopGenerating };
};