import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiUser, FiCpu } from 'react-icons/fi';

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`flex gap-4 w-full max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
        isUser ? 'bg-blue-600' : 'bg-green-600'
      }`}>
        {isUser ? <FiUser className="text-white" /> : <FiCpu className="text-white" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`prose prose-invert max-w-none ${isUser ? 'text-slate-100' : 'text-slate-300'}`}>
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group rounded-lg overflow-hidden my-4 border border-slate-700">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] text-xs text-slate-400 border-b border-slate-700">
                      <span>{match[1]}</span>
                      <button 
                        onClick={() => copyToClipboard(String(children))}
                        className="hover:text-white transition-colors flex items-center gap-1"
                      >
                        <FiCopy size={12} /> Copy
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, borderRadius: 0 }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm text-pink-400 font-mono" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};