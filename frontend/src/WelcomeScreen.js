import React from 'react';

export const WelcomeScreen = ({ onPromptClick }) => {
  
  const containerStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', textAlign: 'center', paddingTop: '15vh'
  };

  const iconStyle = {
    width: '72px', height: '72px', marginBottom: '1.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6a82fb, #fc5c7d)',
    color: 'white', fontSize: '2rem'
  };

  const promptBtnStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    color: '#6e6e73', padding: '0.75rem 1.25rem', borderRadius: '12px',
    cursor: 'pointer', margin: '0 0.5rem'
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>👋</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Hello, Learner!</h1>
      <p style={{ color: '#6e6e73', marginBottom: '2rem', maxWidth: '500px' }}>
        I'm your AI assistant. I can help you debug code, explain complex topics, or just chat.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          "Explain Quantum Computing",
          "Debug this JavaScript",
          "Write a Poem"
        ].map((prompt, index) => (
          <button 
            key={index} 
            style={promptBtnStyle}
            onClick={() => onPromptClick(prompt)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};