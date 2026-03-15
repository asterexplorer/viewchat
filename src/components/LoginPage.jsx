import React, { useState } from 'react';
import { Icons } from './Icons';

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    onLogin({ name: isLogin ? 'Antigravity User' : name, email });
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-flex', padding: '15px', background: 'var(--glass-bg)', borderRadius: '18px', marginBottom: '20px' }}>
            <Icons.AppLogo />
          </div>
          <h1 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Join the Future'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            {isLogin ? 'Enter your details to access your chats' : 'Create an account to start messaging'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {!isLogin && (
            <div className="form-group">
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="chat-input"
                style={{ width: '100%', padding: '14px 18px' }}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="chat-input"
              style={{ width: '100%', padding: '14px 18px' }}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifySelf: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', flexGrow: 1 }}>Password</label>
              {isLogin && <a href="#" style={{ color: 'var(--accent-primary)', fontSize: '12px', textDecoration: 'none' }}>Forgot password?</a>}
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="chat-input"
              style={{ width: '100%', padding: '14px 18px' }}
              required
            />
          </div>

          <button type="submit" className="send-btn" style={{ width: '100%', height: '54px', fontSize: '16px', fontWeight: '600', marginTop: '10px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '15px' }}>
            <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Or continue with</span>
            <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="chat-input" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', padding: '12px' }}>
              <Icons.Google /> <span style={{ fontSize: '14px', fontWeight: '500' }}>Google</span>
            </button>
            <button className="chat-input" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', padding: '12px' }}>
              <Icons.Apple /> <span style={{ fontSize: '14px', fontWeight: '500' }}>Apple</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '35px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
