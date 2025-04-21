import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  startGuestSession,
  getGuestSession,
  sendGuestMessage,
  createGuestChat,
  updateGuestChat,
  deleteGuestChat
} from '../api';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { t } = useTranslation();
  const [sessionId, setSessionId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const isInitialized = useRef(false);
  const isInitializingRef = useRef(false);

  console.log('ChatProvider initiated');
  const createNewChat = async () => {
    if (!sessionId) {
      console.error('Cannot create chat: sessionId is null');
      return null;
    }

    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: t('chat.untitledChat'),
      messages: [],
      timestamp: new Date()
    };
    
    setConversations(prev => [newChat, ...prev]);
    setSelectedChatId(newChatId);
    
    try {
      console.log('createGuestChat with sessionId:', sessionId);
      await createGuestChat(sessionId, newChat.title);
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
    
    return newChatId;
  };

  const updateChatTitle = async (chatId, title) => {
    setConversations(prev =>
      prev.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, title };
        }
        return chat;
      })
    );

    try {
      await updateGuestChat(sessionId, chatId, title);
    } catch (err) {
      console.error('Failed to update chat title:', err);
    }
  };

  const deleteChat = async (chatId) => {
    setConversations(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(conversations[0]?.id || null);
    }

    try {
      await deleteGuestChat(sessionId, chatId);
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const sendMessage = async (chatId, message) => {
    try {
      const response = await sendGuestMessage(sessionId, message, chatId);
      
      setConversations(prev =>
        prev.map(chat => {
          if (chat.id === chatId) {
            const newMessages = [
              ...chat.messages,
              { role: 'user', content: message, timestamp: new Date() },
              { role: 'assistant', content: response, timestamp: new Date() }
            ];
            
            // Update title if this is the first message
            const title = chat.messages.length === 0 
              ? message.split(' ').slice(0, 3).join(' ') + '...'
              : chat.title;
            
            return {
              ...chat,
              title,
              messages: newMessages,
              lastMessage: response
            };
          }
          return chat;
        })
      );

      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  useEffect(() => {
    const initSession = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        setIsInitializing(true);
        const storedSessionId = localStorage.getItem('guestSessionId');
        let currentSessionId = null;
        
        if (storedSessionId) {
          try {
            const sessionResponse = await getGuestSession(storedSessionId);
            currentSessionId = storedSessionId;
            setSessionId(currentSessionId);
            
            // Group conversations by chatId
            const chatGroups = sessionResponse.data.conversations.reduce((acc, conv) => {
              const chatId = conv.chatId;
              if (!acc[chatId]) {
                acc[chatId] = {
                  id: chatId,
                  title: conv.title || t('chat.untitledChat'),
                  messages: [],
                  timestamp: conv.timestamp
                };
              }
              acc[chatId].messages.push({
                role: conv.sender === 'USER' ? 'user' : 'assistant',
                content: conv.message,
                timestamp: conv.timestamp
              });
              // Update timestamp to the latest message
              if (new Date(conv.timestamp) > new Date(acc[chatId].timestamp)) {
                acc[chatId].timestamp = conv.timestamp;
              }
              // Set lastMessage for display in sidebar
              if (conv.sender === 'AI') {
                acc[chatId].lastMessage = conv.message;
              }
              return acc;
            }, {});

            // Convert to array and sort by timestamp (newest first)
            const conversationsList = Object.values(chatGroups)
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setConversations(conversationsList);
            
            if (conversationsList.length > 0) {
              setSelectedChatId(conversationsList[0].id);
            } else {
              await createNewChat();
            }
          } catch (err) {
            console.error('Failed to restore session:', err);
            if (!sessionId) {
              const response = await startGuestSession();
              currentSessionId = response.data.sessionId;
              setSessionId(currentSessionId);
              localStorage.setItem('guestSessionId', currentSessionId);
              await createNewChat();
            }
          }
        } else {
          if (!sessionId) {
            const response = await startGuestSession();
            currentSessionId = response.data.sessionId;
            setSessionId(currentSessionId);
            localStorage.setItem('guestSessionId', currentSessionId);
            await createNewChat();
          }
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        setError(t('chat.error.initialization'));
      } finally {
        setIsInitializing(false);
        isInitializingRef.current = false;
      }
    };

    initSession();
  }, [t, sessionId]);

  const value = {
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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext; 