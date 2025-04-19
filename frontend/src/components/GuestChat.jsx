import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { startGuestSession, getGuestSession, sendGuestMessage, saveConversation } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import userAvatar from '../assets/user.png';
import doctorAvatar from '../assets/doctor.png';

const GuestChat = ({ containerClassName, messagesClassName, inputClassName }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
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
    const initSession = async () => {
      try {
        setIsInitializing(true);
        const storedSessionId = localStorage.getItem('guestSessionId');
        
        if (storedSessionId) {
          try {
            await getGuestSession(storedSessionId);
            setSessionId(storedSessionId);
          } catch (err) {
            const response = await startGuestSession();
            setSessionId(response.data.sessionId);
            localStorage.setItem('guestSessionId', response.data.sessionId);
          }
        } else {
          const response = await startGuestSession();
          setSessionId(response.data.sessionId);
          localStorage.setItem('guestSessionId', response.data.sessionId);
        }

        setMessages([{
          role: 'assistant',
          content: t('chat.welcomeMessage'),
          timestamp: new Date()
        }]);
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
    setMessages(prev => [...prev, { role: 'user', content: messageToSend, timestamp: new Date() }]);
    setLoading(true);

    try {
      const response = await sendGuestMessage(sessionId, messageToSend, "General Practitioner");
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: t('chat.error.message'), 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setLoading(false);
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
    <div className={`flex flex-col h-full ${containerClassName}`}>
      {/* Chat messages */}
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto px-4 py-6 ${messagesClassName}`}
      >
        {isInitializing ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{t('chat.empty.title')}</h3>
            <p className="text-gray-500">{t('chat.empty.description')}</p>
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
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {formatMessage(message.content)}
                {message.timestamp && (
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
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
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message input */}
      <div className={`px-3 py-2 border-t border-gray-100 sm:px-4 sm:py-3 ${inputClassName}`}>
        <form onSubmit={handleSendMessage} className="flex gap-2 w-full max-w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.messagePlaceholder')}
            className="flex-1 min-w-0 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading || isInitializing}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim() || isInitializing}
            className={`shrink-0 px-4 py-2 rounded-lg ${
              loading || !newMessage.trim() || isInitializing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
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
  );
};

export default GuestChat; 