import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { sendGuestMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Link, useNavigate } from 'react-router-dom';
import userAvatar from '../assets/user.png';
import doctorAvatar from '../assets/doctor.png';
import ChatSidebar from './ChatSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const GuestChat = ({ containerClassName, messagesClassName, inputClassName }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { 
    sessionId, 
    conversations, 
    selectedChatId, 
    isInitializing, 
    error,
    createNewChat,
    updateChatTitle,
    deleteChat,
    sendMessage,
    setSelectedChatId
  } = useChat();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  useEffect(() => {
    if (selectedChatId) {
      const selectedChat = conversations.find(chat => chat.id === selectedChatId);
      if (selectedChat) {
        setMessages(selectedChat.messages);
      }
    }
  }, [selectedChatId, conversations]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');
    
    const newMessageObj = { role: 'user', content: messageToSend, timestamp: new Date() };
    setMessages(prev => [...prev, newMessageObj]);
    
    setLoading(true);

    try {
      const response = await sendMessage(selectedChatId, messageToSend);
      const assistantMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: t('chat.error.message'), 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
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
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${containerClassName}`}>
      <ChatSidebar
        conversations={conversations}
        onNewChat={createNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col h-full">
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
          style={{ height: 'calc(100vh - 80px)' }}
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
          {loading && (
            <div className="flex justify-start mb-4">
              <img
                src={doctorAvatar}
                alt="AI"
                className="h-8 w-8 rounded-full mr-2"
              />
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message input */}
        <div className={`sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 px-3 py-2 border-t border-gray-100 dark:border-gray-700 sm:px-4 sm:py-3 ${inputClassName}`}>
          <form onSubmit={handleSendMessage} className="flex gap-2 w-full max-w-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('chat.messagePlaceholder')}
              className="flex-1 min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
              disabled={loading || isInitializing}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim() || isInitializing}
              className={`shrink-0 px-4 py-2 rounded-lg ${
                loading || !newMessage.trim() || isInitializing
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              } text-white font-medium`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestChat; 