import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';

export const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text);
      setText("");
      textareaRef.current.style.height = 'auto'; // Reset height
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  return (
    <div className="relative bg-[var(--bg-input)] rounded-xl border border-slate-600 shadow-xl focus-within:ring-2 focus-within:ring-[var(--accent)] transition-all">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message..."
        rows={1}
        className="w-full bg-transparent text-white px-4 py-4 pr-12 outline-none resize-none max-h-[200px] min-h-[56px] scrollbar-hide"
        disabled={isLoading}
      />
      <button 
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
        className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all ${
          text.trim() ? 'bg-[var(--accent)] text-white' : 'bg-transparent text-slate-500'
        }`}
      >
        <FiSend size={18} />
      </button>
    </div>
  );
};