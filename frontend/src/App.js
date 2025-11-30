import React, { useState, useEffect, useRef } from 'react';
import { useChat } from './useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FiMenu, FiPlus, FiMessageSquare, FiSettings, FiUser } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

// --- INTEGRATED STYLES ---
const styles = `
:root {
  --bg-dark: #0f172a; /* Slate 900 */
  --bg-sidebar: #1e293b; /* Slate 800 */
  --bg-input: #334155; /* Slate 700 */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --accent: #3b82f6; /* Blue 500 */
  --accent-hover: #2563eb;
}
body { background-color: var(--bg-dark); color: var(--text-primary); margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
`;

function App() {
  const { messages, isLoading, sendMessage, stopGenerating, clearChat } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      <style>{styles}</style>
      <div className="flex h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
        
       {/* --- SIDEBAR (RESPONSIVE VERSION) --- */}
        <AnimatePresence mode='wait'>
          {isSidebarOpen && (
            <>
              {/* 1. MOBILE OVERLAY: Darkens the background on phones only */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 0.5 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)} // Clicking black space closes menu
                className="fixed inset-0 bg-black z-40 md:hidden"
              />

              {/* 2. THE SIDEBAR: Fixed on mobile, Relative on Desktop */}
              <motion.div 
                initial={{ x: -280 }} 
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed md:relative z-50 w-[260px] h-full bg-[var(--bg-sidebar)] border-r border-slate-700 flex flex-col shadow-2xl md:shadow-none"
              >
                {/* New Chat Button */}
                <div className="p-4">
                  <button 
                    onClick={() => {
                        clearChat();
                        if (window.innerWidth < 768) setIsSidebarOpen(false); // Close on mobile after clicking
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-lg text-white font-medium transition-colors shadow-lg"
                  >
                    <FiPlus /> New Chat
                  </button>
                </div>

                {/* Chat History List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent</div>
                  {['React Hooks Help', 'Python Debugging', 'Poem about AI'].map((chat, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors text-left truncate">
                      <FiMessageSquare className="shrink-0" />
                      <span className="truncate">{chat}</span>
                    </button>
                  ))}
                </div>

                {/* User Profile / Settings */}
                <div className="p-4 border-t border-slate-700">
                  <button className="flex items-center gap-3 w-full p-2 hover:bg-slate-700 rounded-md transition-colors text-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      <FiUser /> 
                    </div>
                    <div className="text-left">
                      <div className="font-medium">User Account</div>
                      <div className="text-xs text-slate-400">Free Plan</div>
                    </div>
                    <FiSettings className="ml-auto text-slate-400" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- MAIN CHAT AREA --- */}
        <div className="flex-1 flex flex-col h-full relative">
          
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-[var(--bg-dark)]">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-md text-slate-400 md:block hidden">
                <FiMenu size={20} />
              </button>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-sm font-medium border border-slate-700">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Gemini 2.5 Flash
              </div>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide">
            {messages.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-[70vh] text-center opacity-90">
                 <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-2xl border border-slate-700">
                   <span className="text-4xl">✨</span>
                 </div>
                 <h2 className="text-3xl font-bold mb-2">How can I help you?</h2>
                 <p className="text-slate-400 mb-8">I can help you code, write, and analyze data.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full px-4">
                    {["Write a Python script", "Explain Quantum Physics", "Debug my SQL", "Write a Tweet"].map(p => (
                       <button key={p} onClick={() => sendMessage(p)} className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-left text-sm transition-all hover:scale-[1.02]">
                          {p} →
                       </button>
                    ))}
                 </div>
               </div>
            ) : (
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
            )}
            {/* Loading State */}
            {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
              <div className="flex items-center gap-3 text-slate-500 text-sm ml-2">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gradient-to-t from-[var(--bg-dark)] via-[var(--bg-dark)] to-transparent">
             <div className="max-w-4xl mx-auto relative">
               {isLoading && (
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                   <button onClick={stopGenerating} className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-full text-xs font-semibold hover:bg-red-500/20 transition-all flex items-center gap-2 backdrop-blur-md">
                     ⏹ Stop Generating
                   </button>
                 </div>
               )}
               <ChatInput onSend={sendMessage} isLoading={isLoading} />
               <p className="text-center text-[10px] text-slate-500 mt-3">
                 AI can make mistakes. Consider checking important information.
               </p>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}
export default App;