// src/ChatInput.js
import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';

// You'll want an icon for the stop button as well
import { FaStop } from 'react-icons/fa';

export const ChatInput = ({ onSend, isLoading, onStop }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // This container will now use flexbox to align the items
    <div className="input-container">
      <div className="input-wrapper">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message your AI assistant..."
          disabled={isLoading}
          rows="1"
          className="chat-input"
        />
        {/* The send button remains inside the wrapper */}
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          <IoSend />
        </button>
      </div>
      
      {/* The stop button appears next to the wrapper when loading */}
      {isLoading && (
        <button onClick={onStop} className="stop-button">
          <FaStop className="stop-icon" /> Stop
        </button>
      )}
    </div>
  );
};