import React from 'react';
import { Icons } from './Icons';

function Sidebar({ 
  chats, 
  selectedChatId, 
  setSelectedChatId, 
  searchQuery, 
  setSearchQuery, 
  activeView, 
  setActiveView,
  setIsNewChatModalOpen,
  user,
  onLogout,
  theme,
  setTheme,
  setActiveStory
}) {
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stories = chats.filter(c => c.hasStory);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div 
          className="profile-pic" 
          onClick={() => setActiveView(activeView === 'profile' ? 'chats' : 'profile')}
          title="Profile"
        >
          {user ? user.name[0].toUpperCase() : 'U'}
        </div>
        <div className="header-icons">
          <span title="Messages" onClick={() => setActiveView('chats')} style={{ color: activeView === 'chats' ? 'var(--accent-primary)' : 'inherit' }}><Icons.Chats /></span>
          <span title="New Chat" onClick={() => setIsNewChatModalOpen(true)}><Icons.NewChat /></span>
          <span title="Logout" onClick={onLogout}><Icons.Logout /></span>
        </div>
      </div>

      {activeView === 'chats' ? (
        <>
          <div className="stories-container">
            {stories.map(story => (
              <div 
                key={story.id} 
                className="story-item"
                onClick={() => setActiveStory(story)}
              >
                <div className="story-avatar-wrapper">
                  <div className="story-avatar">{story.avatar}</div>
                </div>
                <div className="story-name">{story.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>

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
                </div>
                <div className="chat-item-info">
                  <div className="chat-item-top">
                    <div className="chat-item-name">{chat.name}</div>
                    <div className="chat-item-time">{chat.time}</div>
                  </div>
                  <div className="chat-item-bottom">
                    <div className="chat-item-msg">{chat.lastMessage}</div>
                  </div>
                </div>
                {chat.status === 'online' && <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '10px', height: '10px', background: 'var(--accent-primary)', borderRadius: '50%', border: '2px solid var(--bg-sidebar)' }}></div>}
              </div>
            ))}
          </div>
        </>
      ) : activeView === 'status' ? (
        <div className="sidebar-overlay-content">
          <div className="overlay-header">Status</div>
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>Use the stories bar to view updates from your contacts.</p>
          </div>
        </div>
      ) : (
        <div className="sidebar-overlay-content">
          <div className="overlay-header">Profile</div>
          <div className="profile-details">
            <div className="profile-large-pic">{user ? user.name[0].toUpperCase() : 'U'}</div>
            
            <div className="profile-field">
              <label>Appearance Theme</label>
              <div className="theme-picker">
                <div 
                  className={`theme-option theme-midnight ${theme === 'midnight' ? 'active' : ''}`}
                  onClick={() => setTheme('midnight')}
                  title="Midnight"
                ></div>
                <div 
                  className={`theme-option theme-amethyst ${theme === 'amethyst' ? 'active' : ''}`}
                  onClick={() => setTheme('amethyst')}
                  title="Amethyst"
                ></div>
                <div 
                  className={`theme-option theme-forest ${theme === 'forest' ? 'active' : ''}`}
                  onClick={() => setTheme('forest')}
                  title="Forest"
                ></div>
              </div>
            </div>

            <div className="profile-field">
              <label>Your Name</label>
              <div className="field-value">{user?.name}</div>
              <p>This is not your username or pin. This name will be visible to your Viewchat contacts.</p>
            </div>
            
            <div className="profile-field">
              <label>Email</label>
              <div className="field-value">{user?.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
