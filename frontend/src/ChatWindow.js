// src/ChatWindow.js
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FiX, FiCode, FiSun } from 'react-icons/fi';

const WidgetWelcomeScreen = ({ onPromptClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
    <h2 className="text-xl font-semibold mb-4 text-white">AI Assistant</h2>
    <p className="text-gray-400 mb-6 text-sm">How can I help you today?</p>
    <div className="space-y-3 w-full">
      <button 
        onClick={() => onPromptClick("Explain a for loop in Python")} 
        className="w-full text-left bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors text-sm"
      >
        <FiCode className="inline mr-2" />
        Explain a for loop in Python
      </button>
      <button 
        onClick={() => onPromptClick("What are the core principles of UI/UX design?")} 
        className="w-full text-left bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors text-sm"
      >
        <FiSun className="inline mr-2" />
        Suggest ideas for a new app
      </button>
    </div>
  </div>
);

export const ChatWindow = ({ messages, isLoading, onSend, onClose }) => {
  const chatViewRef = useRef(null);

  useEffect(() => {
    if (chatViewRef.current) {
      chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-24 right-5 z-50 w-full max-w-sm h-[70vh] flex flex-col bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700" aria-label="Close Chat">
          <FiX size={24} />
        </button>
      </div>

      {/* Chat View */}
      <div ref={chatViewRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        ) : (
          <WidgetWelcomeScreen onPromptClick={onSend} />
        )}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
           <ChatMessage message={{id: 'typing', role: 'model', content: '...'}}/>
        )}
      </div>
      
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
};