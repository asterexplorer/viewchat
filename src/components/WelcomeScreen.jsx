import React from 'react';
import { Icons } from './Icons';

function WelcomeScreen() {
  return (
    <div className="welcome-container">
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-15px', right: '-25px' }}>
          <Icons.AppLogo />
        </div>
        <div 
          className="welcome-logo" 
          style={{ 
            background: 'var(--accent-gradient)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            fontWeight: '800',
            fontSize: '120px'
          }}
        >
          Viewchat
        </div>
      </div>
      <h2 className="welcome-title" style={{ fontSize: '32px', marginBottom: '15px' }}>Next-gen communication</h2>
      <p style={{ maxWidth: '450px', lineHeight: '1.6', fontSize: '15.5px', color: 'var(--text-secondary)' }}>
        Welcome to the future of messaging. Experience seamless, secure, and beautiful communication across all your devices and themes.
      </p>
      <div style={{ marginTop: 'auto', paddingBottom: '40px', fontSize: '12px', color: 'var(--text-muted)' }}>
        🔒 Secured by Viewchat Protocol v2.0
      </div>
    </div>
  );
}

export default WelcomeScreen;
