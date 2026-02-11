import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Modern SVG Icons
const Icons = {
  Status: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  Communities: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  NewChat: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Call: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  ),
  Emoji: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Attach: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  Mic: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
  ),
  Ice: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    </svg>
  )
};

const INITIAL_CHATS = [
  {
    id: 1,
    name: 'Elon Musk',
    lastMessage: 'Let\'s colonize Mars next week.',
    time: '10:45 AM',
    status: 'online',
    messages: [
      { text: 'Hey Elon, how\'s the Starship?', sent: false, time: '10:40 AM' },
      { text: 'It\'s going great! Let\'s colonize Mars next week.', sent: true, time: '10:45 AM' },
    ],
    avatar: 'EM'
  },
  {
    id: 2,
    name: 'Mark Zuckerberg',
    lastMessage: 'Metavarse is the future!',
    time: 'Yesterday',
    status: 'online',
    messages: [
      { text: 'Hey Mark!', sent: true, time: '9:00 AM' },
      { text: 'Metavarse is the future!', sent: false, time: '9:15 AM' },
    ],
    avatar: 'MZ'
  },
  {
    id: 3,
    name: 'Sam Altman',
    lastMessage: 'GPT-6 is almost ready.',
    time: 'Monday',
    status: 'away',
    messages: [
      { text: 'Is it true?', sent: true, time: '1:00 PM' },
      { text: 'GPT-6 is almost ready.', sent: false, time: '1:05 PM' },
    ],
    avatar: 'SA'
  },
  {
    id: 4,
    name: 'Bill Gates',
    lastMessage: 'Check out my new book.',
    time: 'Sunday',
    status: 'offline',
    messages: [
      { text: 'Have you seen the latest tech trends?', sent: false, time: '4:00 PM' },
    ],
    avatar: 'BG'
  }
];

function App() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [activeView, setActiveView] = useState('chats'); // 'chats', 'status', 'profile'
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [callingState, setCallingState] = useState(null); // null, 'voice', 'video'
  const chatMessagesRef = useRef(null);

  const CONTACTS = [
    { id: 10, name: 'Jeff Bezos', avatar: 'JB', bio: 'Work hard, have fun, make history.' },
    { id: 11, name: 'Sundar Pichai', avatar: 'SP', bio: 'Building for everyone.' },
    { id: 12, name: 'Satya Nadella', avatar: 'SN', bio: 'Empowering every person.' },
    { id: 13, name: 'Jensen Huang', avatar: 'JH', bio: 'The more you buy, the more you save.' },
  ];

  const selectedChat = chats.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, { text: newMessage, sent: true, time }],
          lastMessage: newMessage,
          time: 'Just now'
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage('');
  };

  const startNewChat = (contact) => {
    const existingChat = chats.find(c => c.name === contact.name);
    if (existingChat) {
      setSelectedChatId(existingChat.id);
    } else {
      const newChat = {
        id: Date.now(),
        name: contact.name,
        lastMessage: 'Started a new conversation',
        time: 'Just now',
        status: 'online',
        messages: [],
        avatar: contact.avatar
      };
      setChats([newChat, ...chats]);
      setSelectedChatId(newChat.id);
    }
    setIsNewChatModalOpen(false);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="profile-pic"
              onClick={() => setActiveView(activeView === 'profile' ? 'chats' : 'profile')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              A
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.Ice />
              <h1
                style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-0.5px', cursor: 'pointer' }}
                onClick={() => setActiveView('chats')}
              >
                Viewchat
              </h1>
            </div>
          </div>
          <div className="header-icons">
            <span title="Status" onClick={() => setActiveView(activeView === 'status' ? 'chats' : 'status')} style={{ color: activeView === 'status' ? 'var(--accent-primary)' : '' }}>
              <Icons.Status />
            </span>
            <span title="Communities"><Icons.Communities /></span>
            <span title="New Chat" onClick={() => setIsNewChatModalOpen(true)}><Icons.NewChat /></span>
            <span title="Menu"><Icons.Menu /></span>
          </div>
        </div>

        {activeView === 'profile' ? (
          <div className="sidebar-overlay-content">
            <div className="overlay-header">
              <span onClick={() => setActiveView('chats')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Icons.Back /> Profile
              </span>
            </div>
            <div className="profile-details">
              <div className="profile-large-pic">A</div>
              <div className="profile-field">
                <label>Your name</label>
                <div className="field-value">Antigravity User</div>
                <p>This is not your username or pin. This name will be visible to your Viewchat contacts.</p>
              </div>
              <div className="profile-field">
                <label>About</label>
                <div className="field-value">Building the future of chat.</div>
              </div>
            </div>
          </div>
        ) : activeView === 'status' ? (
          <div className="sidebar-overlay-content">
            <div className="overlay-header">
              <span onClick={() => setActiveView('chats')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Icons.Back /> Status
              </span>
            </div>
            <div className="status-list">
              <div className="chat-item">
                <div className="chat-item-pic">A</div>
                <div className="chat-item-info">
                  <div className="chat-item-name">My Status</div>
                  <div className="chat-item-bottom">No updates</div>
                </div>
              </div>
              <p style={{ padding: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>RECENT UPDATES</p>
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No status updates from your contacts.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="search-container">
              <div className="search-box">
                <Icons.Search />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="chat-list">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`}
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  <div className="chat-item-pic">
                    {chat.avatar}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid var(--bg-sidebar)',
                      backgroundColor: chat.status === 'online' ? '#00e676' : (chat.status === 'away' ? '#ffc107' : '#64748b')
                    }}></div>
                  </div>
                  <div className="chat-item-info">
                    <div className="chat-item-top">
                      <span className="chat-item-name">{chat.name}</span>
                      <span className="chat-item-time">{chat.time}</span>
                    </div>
                    <div className="chat-item-bottom">
                      <span className="chat-item-msg">{chat.lastMessage}</span>
                      {chat.id === 1 && <span style={{ color: '#00e676', fontSize: '10px' }}>●</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isNewChatModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>New Chat</h2>
              <span className="close-btn" onClick={() => setIsNewChatModalOpen(false)}>×</span>
            </div>
            <div className="contacts-list">
              {CONTACTS.map(contact => (
                <div key={contact.id} className="chat-item" onClick={() => startNewChat(contact)}>
                  <div className="chat-item-pic">{contact.avatar}</div>
                  <div className="chat-item-info">
                    <div className="chat-item-name">{contact.name}</div>
                    <div className="chat-item-bottom">{contact.bio}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {callingState && (
        <div className="call-overlay">
          <div className="call-background">
            <div className="call-bg-avatar">{selectedChat?.avatar}</div>
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
      )}



      {/* Chat Panel */}
      <div className="chat-panel">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="chat-item-pic" style={{ width: '44px', height: '44px', marginRight: '15px', cursor: 'pointer' }}>
                {selectedChat.avatar}
              </div>
              <div style={{ flexGrow: 1, cursor: 'pointer' }}>
                <div className="chat-item-name">{selectedChat.name}</div>
                <div style={{ fontSize: '12px', color: selectedChat.status === 'online' ? '#00e676' : 'var(--text-muted)', fontWeight: '500' }}>
                  {selectedChat.status === 'online' ? 'online' : 'last seen recently'}
                </div>
              </div>
              <div className="header-icons">
                <span title="Search"><Icons.Search /></span>
                <span title="Call" onClick={() => setCallingState('voice')}><Icons.Call /></span>
                <span title="Video" onClick={() => setCallingState('video')}><Icons.Video /></span>
                <span title="Menu"><Icons.Menu /></span>
              </div>
            </div>

            <div className="chat-messages" ref={chatMessagesRef}>
              <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '8px', alignSelf: 'center' }}>
                TODAY
              </div>
              {selectedChat.messages.map((ms, index) => (
                <div key={index} className={`message ${ms.sent ? 'sent' : 'received'}`}>
                  <div className="message-content">{ms.text}</div>
                  <div className="message-time">
                    {ms.time} {ms.sent && <span style={{ marginLeft: '4px', color: 'rgba(255,255,255,0.8)' }}>✓✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-container" onSubmit={sendMessage}>
              <div className="input-actions">
                <span title="Emoji"><Icons.Emoji /></span>
                <span title="Attach"><Icons.Attach /></span>
              </div>
              <input
                type="text"
                className="chat-input"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-btn">
                {newMessage.trim() ? (
                  <Icons.Send />
                ) : (
                  <Icons.Mic />
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="welcome-container">
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '-25px', animation: 'spin 8s linear infinite' }}>
                <Icons.Ice />
              </div>
              <div className="welcome-logo" style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
                Viewchat
              </div>
            </div>
            <h2 className="welcome-title">Next-gen communication</h2>
            <p style={{ maxWidth: '420px', lineHeight: '1.6', fontSize: '15px' }}>
              Welcome to Viewchat. Experience seamless, secure, and beautiful messaging across all your workspaces.
              Your data is protected with military-grade encryption.
            </p>
            <div style={{ marginTop: 'auto', paddingBottom: '30px', fontSize: '12px', color: 'var(--text-muted)' }}>
              🔒 Secured by Viewchat Protocol
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
