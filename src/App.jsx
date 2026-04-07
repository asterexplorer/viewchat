import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  doc, 
  serverTimestamp, 
  where,
  updateDoc
} from 'firebase/firestore';
import './index.css';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import WelcomeScreen from './components/WelcomeScreen';
import CallOverlay from './components/CallOverlay';
import LoginPage from './components/LoginPage';
import { Icons } from './components/Icons';

const INITIAL_CHATS = [];

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

  // Check for persistent session and sync profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Anonymous',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || firebaseUser.displayName?.[0] || 'U',
          status: 'online',
          lastSeen: serverTimestamp()
        };
        
        setUser(userData);

        // Sync user to Firestore
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), userData, { merge: true });
        } catch (err) {
          console.error("Error syncing user profile:", err);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch real-time stories (Phase 5)
  const [stories, setStories] = useState([]);
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch real-time chats (Phase 2)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'conversations'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch real-time messages for selected chat
  useEffect(() => {
    if (!selectedChatId) return;
    const q = query(
      collection(db, 'conversations', selectedChatId.toString(), 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => doc.data());
      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          return { ...chat, messages };
        }
        return chat;
      }));
    });
    return () => unsubscribe();
  }, [selectedChatId]);

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

  // Fetch live users for "New Chat" modal
  const [availableUsers, setAvailableUsers] = useState([]);
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map(doc => doc.data())
        .filter(u => u.uid !== user.uid);
      setAvailableUsers(users);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = (userData) => {
    // Handled by onAuthStateChanged
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      setSelectedChatId(null);
      setActiveView('chats');
    });
  };

  const sendMessage = async (e, attachment = null) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    const currentChatId = selectedChatId;
    const msgText = newMessage;
    setNewMessage('');

    try {
      const messageData = {
        text: msgText,
        senderId: user.uid,
        senderName: user.name,
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp(),
        attachment: attachment ? { ...attachment } : null 
      };

      // 1. Add message to sub-collection
      await addDoc(collection(db, 'conversations', currentChatId.toString(), 'messages'), messageData);

      // 2. Update conversation header
      await updateDoc(doc(db, 'conversations', currentChatId.toString()), {
        lastMessage: attachment ? `Sent a ${attachment.type}` : msgText,
        time: 'Just now',
        timestamp: serverTimestamp()
      });

    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleClearChat = async () => {
    if (!selectedChatId) return;
    try {
      // In a real app, you'd delete all docs in the sub-collection.
      // For now, we'll just update the header.
      await updateDoc(doc(db, 'conversations', selectedChatId.toString()), {
        lastMessage: 'Messages cleared',
        timestamp: serverTimestamp()
      });
      // Optionally notify the user or actually delete sub-collection docs via Cloud Function
    } catch (err) {
      console.error("Error clearing chat:", err);
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedChatId) return;
    try {
      // Deleting the conversation header
      // Note: Sub-collections are not automatically deleted in Firestore when parent is deleted.
      // Full deletion usually happens via a recursive loop or backend trigger.
      const chatRef = doc(db, 'conversations', selectedChatId.toString());
      setSelectedChatId(null);
      // We don't delete immediately to avoid UI flashes, or use a soft delete
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const startNewChat = async (contact) => {
    // Check if conversation already exists (simplified check)
    const existingChat = chats.find(c => c.name === contact.name);
    
    if (existingChat) {
      setSelectedChatId(existingChat.id);
    } else {
      try {
        const chatId = contact.uid || Date.now().toString(); // Use UID for 1-on-1 chats
        const newChatData = {
          name: contact.name,
          lastMessage: 'Started a new conversation',
          time: 'Just now',
          timestamp: serverTimestamp(),
          status: contact.status || 'online',
          avatar: contact.avatar || 'U',
          participants: [user.uid, chatId], // Track who is in the chat
          hasStory: false
        };
        
        await setDoc(doc(db, 'conversations', chatId), newChatData);
        setSelectedChatId(chatId);
      } catch (err) {
        console.error("Error starting new chat:", err);
      }
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
        stories={stories}
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
              {availableUsers.length > 0 ? (
                availableUsers.map(contact => (
                  <div key={contact.uid} className="chat-item" onClick={() => startNewChat(contact)}>
                    <div className="chat-item-pic">
                      {contact.avatar && contact.avatar.length > 2 ? <img src={contact.avatar} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} /> : contact.avatar}
                    </div>
                    <div className="chat-item-info">
                      <div className="chat-item-name">{contact.name}</div>
                      <div className="chat-item-bottom">Click to start chatting</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No other users online yet.
                </div>
              )}
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
