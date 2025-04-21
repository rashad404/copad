import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { startGuestSession, getGuestSession, sendGuestMessage, saveConversation } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import userAvatar from '../assets/user.png';
import doctorAvatar from '../assets/doctor.png';
import ChatSidebar from './ChatSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const GuestChat = ({ containerClassName, messagesClassName, inputClassName }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewChat = async () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: t('chat.untitledChat'),
      messages: [],
      timestamp: new Date(),
      lastMessage: null
    };
    
    setConversations(prev => [newChat, ...prev]);
    setSelectedChatId(newChatId);
    setMessages([]);
  };

  const updateChatTitle = (chatId, firstMessage) => {
    setConversations(prev =>
      prev.map(chat => {
        if (chat.id === chatId) {
          // Create a title from the first few words of the message
          const title = firstMessage.split(' ').slice(0, 5).join(' ') + '...';
          return { ...chat, title };
        }
        return chat;
      })
    );
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        setIsInitializing(true);
        const storedSessionId = localStorage.getItem('guestSessionId');
        
        if (storedSessionId) {
          try {
            const sessionResponse = await getGuestSession(storedSessionId);
            setSessionId(storedSessionId);
            
            // Convert existing conversations to our format
            const existingConversations = sessionResponse.data.conversations.reduce((acc, conv) => {
              const chatId = conv.chatId || 'default';
              if (!acc[chatId]) {
                acc[chatId] = {
                  id: chatId,
                  title: '',
                  messages: [],
                  timestamp: new Date()
                };
              }
              acc[chatId].messages.push({
                role: conv.user ? 'user' : 'assistant',
                content: conv.message,
                timestamp: conv.timestamp
              });
              return acc;
            }, {});

            const conversationsList = Object.values(existingConversations);
            setConversations(conversationsList);
            
            if (conversationsList.length > 0) {
              const latestChat = conversationsList[0];
              setSelectedChatId(latestChat.id);
              setMessages(latestChat.messages);
            } else {
              await createNewChat();
            }
          } catch (err) {
            console.error('Failed to restore session:', err);
            const response = await startGuestSession();
            setSessionId(response.data.sessionId);
            localStorage.setItem('guestSessionId', response.data.sessionId);
            await createNewChat();
          }
        } else {
          const response = await startGuestSession();
          setSessionId(response.data.sessionId);
          localStorage.setItem('guestSessionId', response.data.sessionId);
          await createNewChat();
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        setError(t('chat.error.initialization'));
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, [t]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');
    
    const newMessageObj = { role: 'user', content: messageToSend, timestamp: new Date() };
    setMessages(prev => [...prev, newMessageObj]);
    
    // Update conversations state
    setConversations(prev =>
      prev.map(chat => {
        if (chat.id === selectedChatId) {
          const updatedMessages = [...chat.messages, newMessageObj];
          // Update title if this is the first message
          if (chat.messages.length === 0) {
            updateChatTitle(chat.id, messageToSend);
          }
          return { 
            ...chat, 
            messages: updatedMessages, 
            lastMessage: messageToSend,
            timestamp: new Date() // Update timestamp on new message
          };
        }
        return chat;
      })
    );

    setLoading(true);

    try {
      const response = await sendGuestMessage(sessionId, messageToSend, selectedChatId);
      const assistantMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update conversations state with assistant's response
      setConversations(prev =>
        prev.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
              lastMessage: response,
              timestamp: new Date() // Update timestamp on response
            };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: t('chat.error.message'), 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Update conversations state with error message
      setConversations(prev =>
        prev.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
              lastMessage: t('chat.error.message'),
              timestamp: new Date() // Update timestamp on error
            };
          }
          return chat;
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatId) => {
    const selectedChat = conversations.find(chat => chat.id === chatId);
    if (selectedChat) {
      setSelectedChatId(chatId);
      setMessages(selectedChat.messages);
    }
  };

  const formatMessage = (text) => {
    if (!text) return null;
    
    // Replace numbered lists with proper formatting
    text = text.replace(/(\d+\.\s)/g, '\n$1');
    
    // Replace double asterisks with bold tags
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Split by newlines and wrap in paragraphs
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: paragraph }} />;
    });
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <ChatSidebar
        conversations={conversations}
        onNewChat={createNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className={`flex-1 flex flex-col h-full ${containerClassName}`}>
        {/* Chat header */}
        <div className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title={t('chat.openSidebar')}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {conversations.find(chat => chat.id === selectedChatId)?.title || t('chat.untitledChat')}
          </h1>
        </div>

        {/* Chat messages */}
        <div 
          ref={messagesContainerRef}
          className={`flex-1 overflow-y-auto px-4 py-6 ${messagesClassName}`}
        >
          {isInitializing ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t("home.hero.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.hero.subtitle")}
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {message.role === 'assistant' && (
                  <img
                    src={doctorAvatar}
                    alt="AI"
                    className="h-8 w-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {formatMessage(message.content)}
                  {message.timestamp && (
                    <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <img
                    src={userAvatar}
                    alt="User"
                    className="h-8 w-8 rounded-full ml-2"
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Chat input */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('chat.inputPlaceholder')}
              className={`flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${inputClassName}`}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                t('chat.send')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestChat; 