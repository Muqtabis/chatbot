// src/ChatBubble.js
import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

export const ChatBubble = ({ onToggle }) => (
  <button
    onClick={onToggle}
    className="fixed bottom-5 right-5 z-50 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform duration-200"
    aria-label="Toggle Chat"
  >
    <FiMessageSquare size={32} />
  </button>
);