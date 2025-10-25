import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  avatar?: string;
  email?: string;
  city?: string;
}

interface Message {
  _id: string;
  sender: User;
  recipient: User;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

interface MessagesModalProps {
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MessagesModal = ({ onClose }: MessagesModalProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data.conversations || []);
      setError('');
    } catch (err: any) {
      console.error('Load conversations error:', err);
      setError(err.response?.data?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      setMessagesLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/with/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages || []);
    } catch (err: any) {
      console.error('Load messages error:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUserId || sending) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/messages/send`,
        {
          recipientId: selectedUserId,
          content: messageInput.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Add new message to the list
      setMessages([...messages, response.data.message]);
      setMessageInput('');

      // Update conversation's last message
      setConversations(conversations.map(conv => 
        conv.user._id === selectedUserId
          ? { ...conv, lastMessage: messageInput.trim(), lastMessageTime: new Date().toISOString() }
          : conv
      ));
    } catch (err: any) {
      console.error('Send message error:', err);
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  };

  const selectedConversation = conversations.find(c => c.user._id === selectedUserId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content messages-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>💬 Messages</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="messages-container">
          {/* Conversations List */}
          <div className="conversations-list">
            <div className="conversations-header">
              <h3>Conversations</h3>
              <span className="conversations-count">{conversations.length}</span>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>❌ {error}</p>
                <button className="btn btn-primary btn-sm" onClick={loadConversations}>
                  Retry
                </button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p>No messages yet</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.user._id}
                  className={`conversation-item ${selectedUserId === conv.user._id ? 'active' : ''} ${conv.unread > 0 ? 'has-unread' : ''}`}
                  onClick={() => setSelectedUserId(conv.user._id)}
                >
                  <div className="conversation-avatar">
                    {conv.user.avatar ? (
                      <img src={conv.user.avatar} alt={conv.user.name} />
                    ) : (
                      <div className="avatar-placeholder">{conv.user.name[0]}</div>
                    )}
                    {conv.unread > 0 && <span className="unread-dot"></span>}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h4>{conv.user.name}</h4>
                      <span className="conversation-time">{getTimeAgo(conv.lastMessageTime)}</span>
                    </div>
                    <p className="conversation-preview">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="unread-badge">{conv.unread}</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Messages View */}
          <div className="messages-view">
            {!selectedUserId ? (
              <div className="no-conversation-selected">
                <div className="empty-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the left to view messages</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                {selectedConversation && (
                  <div className="chat-header">
                    <div className="chat-user-info">
                      {selectedConversation.user.avatar ? (
                        <img src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                      ) : (
                        <div className="avatar-placeholder">{selectedConversation.user.name[0]}</div>
                      )}
                      <div>
                        <h3>{selectedConversation.user.name}</h3>
                        {selectedConversation.user.city && (
                          <p>{selectedConversation.user.city}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages List */}
                <div className="chat-messages">
                  {messagesLoading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">💬</div>
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isCurrentUser = msg.sender._id === getCurrentUserId();
                      return (
                        <div
                          key={msg._id}
                          className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                        >
                          {!isCurrentUser && msg.sender.avatar && (
                            <img src={msg.sender.avatar} alt={msg.sender.name} className="message-avatar" />
                          )}
                          <div className="message-bubble">
                            <p>{msg.content}</p>
                            <span className="message-time">{getTimeAgo(msg.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="message-input-container">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="message-input"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sending}
                    className="send-btn"
                  >
                    {sending ? '⏳' : '➤'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <style>{`
          .messages-modal {
            width: 100%;
            max-width: 900px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            padding: 0;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--border);
          }

          .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--text-secondary);
            line-height: 1;
            padding: 0;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
          }

          .close-btn:hover {
            background: var(--bg-secondary);
            color: var(--text);
          }

          .messages-container {
            display: grid;
            grid-template-columns: 300px 1fr;
            flex: 1;
            overflow: hidden;
          }

          .conversations-list {
            border-right: 1px solid var(--border);
            overflow-y: auto;
            background: var(--bg-secondary);
          }

          .conversations-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border);
            background: white;
          }

          .conversations-header h3 {
            margin: 0;
            font-size: 1rem;
          }

          .conversations-count {
            background: var(--primary);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .conversation-item {
            display: flex;
            gap: 1rem;
            padding: 1rem 1.5rem;
            cursor: pointer;
            transition: background 0.2s;
            border-bottom: 1px solid var(--border);
            background: white;
          }

          .conversation-item:hover {
            background: #f8f9fa;
          }

          .conversation-item.active {
            background: #e7f3ff;
          }

          .conversation-item.has-unread {
            background: #f0f7ff;
          }

          .conversation-avatar {
            position: relative;
            flex-shrink: 0;
          }

          .conversation-avatar img,
          .conversation-avatar .avatar-placeholder {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            object-fit: cover;
          }

          .avatar-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary);
            color: white;
            font-weight: 600;
            font-size: 1.25rem;
          }

          .unread-dot {
            position: absolute;
            top: 0;
            right: 0;
            width: 12px;
            height: 12px;
            background: var(--accent);
            border: 2px solid white;
            border-radius: 50%;
          }

          .conversation-info {
            flex: 1;
            min-width: 0;
          }

          .conversation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.25rem;
          }

          .conversation-header h4 {
            margin: 0;
            font-size: 0.95rem;
            font-weight: 600;
          }

          .conversation-time {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .conversation-preview {
            margin: 0;
            font-size: 0.875rem;
            color: var(--text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .unread-badge {
            flex-shrink: 0;
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--accent);
            color: white;
            border-radius: 50%;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .messages-view {
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .no-conversation-selected {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            padding: 2rem;
          }

          .chat-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border);
            background: white;
          }

          .chat-user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .chat-user-info img,
          .chat-user-info .avatar-placeholder {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            object-fit: cover;
          }

          .chat-user-info h3 {
            margin: 0;
            font-size: 1rem;
          }

          .chat-user-info p {
            margin: 0;
            font-size: 0.8125rem;
            color: var(--text-secondary);
          }

          .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .message {
            display: flex;
            gap: 0.75rem;
            max-width: 70%;
          }

          .message.sent {
            align-self: flex-end;
            flex-direction: row-reverse;
          }

          .message.received {
            align-self: flex-start;
          }

          .message-avatar {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
          }

          .message-bubble {
            padding: 0.75rem 1rem;
            border-radius: 16px;
            word-wrap: break-word;
          }

          .message.sent .message-bubble {
            background: var(--primary);
            color: white;
            border-bottom-right-radius: 4px;
          }

          .message.received .message-bubble {
            background: white;
            border-bottom-left-radius: 4px;
          }

          .message-bubble p {
            margin: 0 0 0.25rem 0;
            font-size: 0.9375rem;
          }

          .message-time {
            font-size: 0.75rem;
            opacity: 0.7;
          }

          .message-input-container {
            display: flex;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--border);
            background: white;
          }

          .message-input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border);
            border-radius: 24px;
            font-size: 0.9375rem;
            outline: none;
            transition: border-color 0.2s;
          }

          .message-input:focus {
            border-color: var(--primary);
          }

          .send-btn {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            border: none;
            background: var(--primary);
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .send-btn:hover:not(:disabled) {
            background: var(--primary-dark, #0056b3);
            transform: scale(1.05);
          }

          .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .loading-state, .error-state, .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .empty-icon {
            font-size: 3rem;
            opacity: 0.3;
            margin-bottom: 1rem;
          }

          .error-state p {
            color: var(--danger);
            margin-bottom: 1rem;
          }

          @media (max-width: 768px) {
            .messages-modal {
              max-width: 100%;
              max-height: 90vh;
              margin: 0;
              border-radius: 16px 16px 0 0;
            }

            .messages-container {
              grid-template-columns: ${selectedUserId ? '0 1fr' : '1fr 0'};
            }

            ${selectedUserId ? '.conversations-list { display: none; }' : '.messages-view { display: none; }'}
          }
        `}</style>
      </div>
    </div>
  );
};

export default MessagesModal;
