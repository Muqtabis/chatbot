// src/App.js
import React, { useEffect, useRef } from 'react';
import './App.css'; // Make sure to import the CSS file
import { useChat } from './useChat';
import { WelcomeScreen } from './WelcomeScreen';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

function App() {
  const { messages, isLoading, sendMessage } = useChat();
  const chatViewRef = useRef(null);

  // Auto-scroll to the bottom on new messages
  useEffect(() => {
    if (chatViewRef.current) {
      chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="app-container">
      <div ref={chatViewRef} className="chat-view">
        <div className="chat-content">
          {messages.length > 0 ? (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          ) : (
            <WelcomeScreen onPromptClick={sendMessage} />
          )}
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <ChatMessage message={{ id: 'typing', role: 'model', content: '...' }} />
          )}
        </div>
      </div>
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;