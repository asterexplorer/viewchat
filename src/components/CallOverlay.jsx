import React from 'react';
import { Icons } from './Icons';

function CallOverlay({ selectedChat, callingState, setCallingState }) {
  if (!callingState) return null;

  return (
    <div className="call-overlay">
      <div className="call-background">
        <div className="call-bg-avatar pulsing">{selectedChat?.avatar}</div>
      </div>
      <div className="call-content">
        <div className="call-info">
          <div className="call-main-avatar">{selectedChat?.avatar}</div>
          <h2 className="call-name">{selectedChat?.name}</h2>
          <p className="call-status">{callingState === 'video' ? 'VIDEO CALLING...' : 'CALLING...'}</p>
        </div>

        <div className="call-actions">
          <div className="call-action-btn">
            <Icons.Mic />
          </div>
          <div className="call-action-btn hangup" onClick={() => setCallingState(null)}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" transform="rotate(135 12 12)" />
            </svg>
          </div>
          <div className="call-action-btn">
            {callingState === 'video' ? <Icons.Video /> : <span>🔊</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallOverlay;
