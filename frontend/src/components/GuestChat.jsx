import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { startGuestSession, getGuestSession, sendGuestMessage, saveConversation } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function GuestChat() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get existing session from localStorage
        const storedSessionId = localStorage.getItem('guestSessionId');
        console.log('Stored session ID from localStorage:', storedSessionId);
        
        if (storedSessionId) {
          try {
            console.log('Attempting to verify existing session:', storedSessionId);
            // Verify if session still exists
            const sessionResponse = await getGuestSession(storedSessionId);
            console.log('Existing session verified:', sessionResponse);
            setSessionId(storedSessionId);
          } catch (err) {
            console.log('Existing session not valid, creating new one. Error:', err);
            // If session doesn't exist, create a new one
            const response = await startGuestSession();
            const newSessionId = response.data.sessionId;
            console.log('Created new session:', newSessionId);
            setSessionId(newSessionId);
            localStorage.setItem('guestSessionId', newSessionId);
          }
        } else {
          console.log('No stored session found, creating new one');
          // Create new session if none exists
          const response = await startGuestSession();
          const newSessionId = response.data.sessionId;
          console.log('Created new session:', newSessionId);
          setSessionId(newSessionId);
          localStorage.setItem('guestSessionId', newSessionId);
        }
        
        // Add welcome message
        setMessages([{
          message: t('chat.welcomeMessage'),
          isUser: false,
          timestamp: new Date()
        }]);
      } catch (err) {
        console.error('Error initializing session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [t]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      
      // Verify session is still valid before sending message
      if (sessionId) {
        try {
          await getGuestSession(sessionId);
        } catch (err) {
          console.log('Session invalid, creating new one');
          const response = await startGuestSession();
          const newSessionId = response.data.sessionId;
          console.log('Created new session for message:', newSessionId);
          setSessionId(newSessionId);
          localStorage.setItem('guestSessionId', newSessionId);
        }
      } else {
        console.log('No session ID, creating new one');
        const response = await startGuestSession();
        const newSessionId = response.data.sessionId;
        console.log('Created new session for message:', newSessionId);
        setSessionId(newSessionId);
        localStorage.setItem('guestSessionId', newSessionId);
      }
      
      // Add user message immediately
      setMessages(prev => [...prev, { message: newMessage, isUser: true }]);
      setNewMessage('');

      // Send message to backend with current session ID
      const response = await sendGuestMessage(sessionId, newMessage);
      
      // Add AI response
      setMessages(prev => [...prev, { message: response.data, isUser: false }]);
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response?.status === 404) {
        // Session not found, clear it and let the useEffect create a new one
        localStorage.removeItem('guestSessionId');
        setSessionId(null);
        setError(t('chat.sessionExpired'));
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChat = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await saveConversation(sessionId);
      navigate('/appointments');
    } catch (err) {
      console.error('Error saving chat:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async (userData) => {
    setShowAuthModal(false);
    await handleSaveChat();
  };

  const formatMessage = (text) => {
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
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.isUser
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="prose prose-sm max-w-none">
                {formatMessage(message.message)}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-4">
              {t("chat.sending")}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50">
          {error}
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveChat}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
            title={t('chat.saveChat')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder={t('chat.messagePlaceholder')}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim() || !sessionId}
            className={`flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg
              ${loading || !newMessage.trim() || !sessionId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 cursor-pointer'}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">{t('auth.saveChatTitle')}</h2>
            <p className="text-gray-600 mb-6">{t('auth.saveChatDescription')}</p>
            <div className="space-y-4">
              <Link
                to="/login"
                state={{ redirect: window.location.pathname }}
                className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {t('auth.login.sign_in')}
              </Link>
              <Link
                to="/register"
                state={{ redirect: window.location.pathname }}
                className="block w-full text-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                {t('auth.sign_up')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 