import React, { useState, useRef } from 'react';
import { Icons } from './Icons';

function ChatPanel({ 
  selectedChat, 
  newMessage, 
  setNewMessage, 
  sendMessage, 
  chatMessagesRef, 
  setCallingState,
  onClearChat,
  onDeleteChat,
  isTyping
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  if (!selectedChat) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : 'file');
      const url = URL.createObjectURL(file);
      setAttachment({ file, type, url, name: file.name });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;
    
    sendMessage(e, attachment);
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Extract shared media
  const sharedMedia = selectedChat.messages.filter(m => m.attachment && (m.attachment.type === 'image' || m.attachment.type === 'video'));

  return (
    <div className="chat-panel" style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="chat-header">
          <div 
            className="chat-item-pic" 
            style={{ width: '44px', height: '44px', marginRight: '15px', cursor: 'pointer' }}
            onClick={() => setIsInfoOpen(!isInfoOpen)}
          >
            {selectedChat.avatar}
          </div>
          <div style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => setIsInfoOpen(!isInfoOpen)}>
            <div className="chat-item-name">{selectedChat.name}</div>
            <div style={{ fontSize: '12px', color: selectedChat.status === 'online' ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '500' }}>
              {isTyping ? <span className="typing-indicator">typing...</span> : (selectedChat.status === 'online' ? 'online' : 'last seen recently')}
            </div>
          </div>
          <div className="header-icons">
            <span title="Search"><Icons.Search /></span>
            <span title="Call" onClick={() => setCallingState('voice')}><Icons.Call /></span>
            <span title="Video" onClick={() => setCallingState('video')}><Icons.Video /></span>
            <div style={{ position: 'relative' }}>
              <span title="Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}><Icons.Menu /></span>
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <div className="menu-item" onClick={() => { onClearChat(); setIsMenuOpen(false); }}>
                    <Icons.Clear /> Clear Messages
                  </div>
                  <div className="menu-item delete" onClick={() => { onDeleteChat(); setIsMenuOpen(false); }}>
                    <Icons.Trash /> Delete Chat
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '8px', alignSelf: 'center' }}>
            TODAY
          </div>
          {selectedChat.messages.map((ms, index) => (
            <div key={index} className={`message ${ms.sent ? 'sent' : 'received'}`}>
               {ms.attachment && (
                <div className="message-attachment">
                  {ms.attachment.type === 'image' ? (
                    <img src={ms.attachment.url} alt="attachment" className="chat-img" onClick={() => window.open(ms.attachment.url, '_blank')} />
                  ) : ms.attachment.type === 'video' ? (
                    <video src={ms.attachment.url} controls className="chat-video" />
                  ) : (
                    <div className="file-attachment">
                      <Icons.Attach /> <span>{ms.attachment.name}</span>
                    </div>
                  )}
                </div>
              )}
              {ms.text && <div className="message-content">{ms.text}</div>}
              <div className="message-time">
                {ms.time} {ms.sent && <span style={{ marginLeft: '4px', color: 'rgba(255,255,255,0.8)' }}>✓✓</span>}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="message received">
               <div className="message-content typing-dots">
                 <span></span><span></span><span></span>
               </div>
             </div>
          )}
        </div>

        <form className="chat-input-container" onSubmit={handleFormSubmit}>
          {attachment && (
            <div className="attachment-preview-bar">
              <div className="preview-item">
                {attachment.type === 'image' ? (
                  <img src={attachment.url} alt="preview" />
                ) : (
                  <div className="preview-file-icon"><Icons.Attach /></div>
                )}
                <span className="preview-name">{attachment.name}</span>
                <span className="remove-preview" onClick={removeAttachment}>×</span>
              </div>
            </div>
          )}
          <div className="input-actions">
            <span title="Emoji"><Icons.Emoji /></span>
            <span title="Attach" onClick={() => fileInputRef.current?.click()}><Icons.Attach /></span>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
          </div>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="send-btn">
            {(newMessage.trim() || attachment) ? (
              <Icons.Send />
            ) : (
              <Icons.Mic />
            )}
          </button>
        </form>
      </div>

      {isInfoOpen && (
        <div 
          className="sidebar-overlay-content" 
          style={{ 
            width: '320px', 
            borderLeft: '1px solid var(--border-color)', 
            animation: 'none', 
            transition: 'width 0.3s ease' 
          }}
        >
          <div className="overlay-header" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
            <span>Contact Info</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setIsInfoOpen(false)}>×</span>
          </div>
          <div className="profile-details" style={{ overflowY: 'auto' }}>
            <div className="profile-large-pic" style={{ width: '120px', height: '120px', fontSize: '40px', margin: '20px 0' }}>
              {selectedChat.avatar}
            </div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px' }}>{selectedChat.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{selectedChat.status}</p>
            </div>

            <div className="profile-field">
              <label>Shared Media</label>
              {sharedMedia.length > 0 ? (
                <div className="media-gallery-grid">
                  {sharedMedia.map((m, idx) => (
                    <div key={idx} className="gallery-item">
                      {m.attachment.type === 'image' ? (
                        <img src={m.attachment.url} alt="Shared" />
                      ) : (
                        <video src={m.attachment.url} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '13px', textAlign: 'center' }}>No media shared in this chat yet.</p>
              )}
            </div>

            <div className="profile-field">
              <label>Bio</label>
              <div className="field-value" style={{ fontSize: '14px' }}>{selectedChat.bio || 'Product designer and tech enthusiast.'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPanel;
