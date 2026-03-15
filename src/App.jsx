import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import WelcomeScreen from './components/WelcomeScreen';
import CallOverlay from './components/CallOverlay';
import LoginPage from './components/LoginPage';
import { Icons } from './components/Icons';

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
    avatar: 'EM',
    hasStory: true,
    storyText: "Starship launch was a success! 🚀"
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
    avatar: 'MZ',
    hasStory: true,
    storyText: "Working on the next generation of VR. 🥽"
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
    avatar: 'SA',
    hasStory: true,
    storyText: "Artificial General Intelligence is closer than you think."
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
    avatar: 'BG',
    hasStory: false
  }
];

const CONTACTS = [
  { id: 10, name: 'Jeff Bezos', avatar: 'JB', bio: 'Work hard, have fun, make history.', hasStory: true, storyText: "Blue Origin is hiring! 🌍" },
  { id: 11, name: 'Sundar Pichai', avatar: 'SP', bio: 'Building for everyone.', hasStory: true, storyText: "AI for everyone, everywhere." },
  { id: 12, name: 'Satya Nadella', avatar: 'SN', bio: 'Empowering every person.', hasStory: false },
  { id: 13, name: 'Jensen Huang', avatar: 'JH', bio: 'The more you buy, the more you save.', hasStory: true, storyText: "NVIDIA H100s are shipping fast. ⚡" },
];

function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [activeView, setActiveView] = useState('chats'); // 'chats', 'status', 'profile'
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [callingState, setCallingState] = useState(null); // null, 'voice', 'video'
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('viewchat_theme') || 'midnight');
  const [activeStory, setActiveStory] = useState(null);
  const chatMessagesRef = useRef(null);

  // Check for persistent session
  useEffect(() => {
    const savedUser = localStorage.getItem('viewchat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Sync theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('viewchat_theme', theme);
  }, [theme]);

  const selectedChat = chats.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [selectedChat?.messages, isTyping]);

  // Simulate contact status fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['online', 'away', 'offline'];
      setChats(prevChats => prevChats.map(chat => {
        if (Math.random() > 0.8) {
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return { ...chat, status: newStatus };
        }
        return chat;
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('viewchat_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('viewchat_user');
    setSelectedChatId(null);
    setActiveView('chats');
  };

  const sendMessage = (e, attachment = null) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { 
      text: newMessage, 
      sent: true, 
      time,
      attachment: attachment ? { ...attachment } : null 
    };
    
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
          lastMessage: attachment ? `Sent a ${attachment.type}` : newMessage,
          time: 'Just now'
        };
      }
      return chat;
    }));

    setNewMessage('');

    // Simulate auto-reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let replyText = `Thanks for the message! I'm currently busy working on the future.`;
        
        if (attachment) {
          replyText = attachment.type === 'image' ? `Wow, that looks amazing! Thanks for sharing the photo.` : `Cool video! I'll check it out properly later.`;
        }

        const replyMessage = { text: replyText, sent: false, time: replyTime };
        
        setChats(prevChats => prevChats.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: [...chat.messages, replyMessage],
              lastMessage: replyMessage.text,
              time: 'Just now'
            };
          }
          return chat;
        }));
      }, 2000);
    }, 1000);
  };

  const handleClearChat = () => {
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === selectedChatId) {
        return { ...chat, messages: [], lastMessage: 'Messages cleared' };
      }
      return chat;
    }));
  };

  const handleDeleteChat = () => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== selectedChatId));
    setSelectedChatId(null);
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
        avatar: contact.avatar,
        hasStory: contact.hasStory,
        storyText: contact.storyText
      };
      setChats([newChat, ...chats]);
      setSelectedChatId(newChat.id);
    }
    setIsNewChatModalOpen(false);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        chats={chats}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        setIsNewChatModalOpen={setIsNewChatModalOpen}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        setActiveStory={setActiveStory}
      />

      {selectedChat ? (
        <ChatPanel 
          selectedChat={selectedChat}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          chatMessagesRef={chatMessagesRef}
          setCallingState={setCallingState}
          onClearChat={handleClearChat}
          onDeleteChat={handleDeleteChat}
          isTyping={isTyping}
        />
      ) : (
        <WelcomeScreen />
      )}

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

      {activeStory && (
        <div className="story-viewer">
          <div className="story-progress-bar">
            <div className="progress-segment">
              <div className="progress-fill" style={{ width: '100%', transition: 'width 5s linear' }}></div>
            </div>
          </div>
          <div className="story-header">
            <div className="story-avatar-small">{activeStory.avatar}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{activeStory.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Just now</div>
            </div>
            <div className="story-close" onClick={() => setActiveStory(null)}>×</div>
          </div>
          <div className="story-content">
            <p>{activeStory.storyText}</p>
          </div>
        </div>
      )}

      <CallOverlay 
        selectedChat={selectedChat}
        callingState={callingState}
        setCallingState={setCallingState}
      />
    </div>
  );
}

export default App;
