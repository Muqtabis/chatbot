// src/ChatMessage.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaUser, FaRobot, FaClipboard, FaCheck } from 'react-icons/fa';

const CodeBlock = ({ className, children }) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return match ? (
    <div style={{ position: 'relative' }}>
      <button onClick={handleCopy} className="copy-button">
        {isCopied ? <FaCheck /> : <FaClipboard />}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code>{children}</code>
  );
};

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className="message-container">
      <div className={`avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? <FaUser /> : <FaRobot />}
      </div>
      <div className="message-content">
        {message.content === '...' ? (
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        ) : (
          <ReactMarkdown components={{ code: CodeBlock }}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};