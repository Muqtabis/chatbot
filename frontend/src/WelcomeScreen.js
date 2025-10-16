// src/WelcomeScreen.js
import React from 'react';
import { FaRobot } from 'react-icons/fa';

export const WelcomeScreen = ({ onPromptClick }) => (
  <div className="welcome-screen">
    <div className="welcome-icon">
      <FaRobot size={32} />
    </div>
    <h1>How can I help you today?</h1>
    <div className="example-prompts">
      <button 
        className="prompt-button" 
        onClick={() => onPromptClick("Explain recursion in JavaScript")}
      >
        "Explain recursion in JavaScript"
      </button>
      <button 
        className="prompt-button" 
        onClick={() => onPromptClick("What are the core principles of UI/UX design?")}
      >
        "What are UI/UX principles?"
      </button>
    </div>
  </div>
);