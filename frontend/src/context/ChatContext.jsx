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
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const isInitializingRef = useRef(false);
  const sessionIdRef = useRef(null);

  // Process chats data from the response
  const processSessionData = (sessionResponse) => {
    // First check if chats exist in the response data
    const responseChats = sessionResponse.data.chats;
    
    if (responseChats && Array.isArray(responseChats) && responseChats.length > 0) {
      // The response data is already in the format we need
      const formattedChats = responseChats.map(chat => {
        // Format messages for the UI
        const formattedMessages = Array.isArray(chat.messages) 
          ? chat.messages.map(msg => ({
              role: msg.sender === 'USER' ? 'user' : 'assistant',
              content: msg.message,
              timestamp: msg.timestamp
            }))
          : [];
        
        return {
          id: chat.id,
          title: chat.title || "New Chat",
          messages: formattedMessages,
          timestamp: new Date(chat.timestamp),
          lastMessage: chat.lastMessage
        };
      });
      
      // Sort chats by timestamp (newest first)
      return formattedChats.sort((a, b) => 
        b.timestamp - a.timestamp
      );
    }
    
    return [];
  };

  // Create a new chat function that tries to handle the race condition
  const createInitialChat = async (sid) => {
    // This ensures we're using the latest sessionId
    const activeSessionId = sid || sessionIdRef.current;
    
    if (!activeSessionId) {
      console.error('Cannot create initial chat: No active session ID');
      return null;
    }
    
    try {
      // Don't create a client-side ID anymore - we'll let the server create the UUID and return it
      const title = "New Chat";
      
      // Call the API first to create the chat
      const response = await createGuestChat(activeSessionId, title);
      
      // If the response contains a chat ID use it, otherwise generate a temporary one
      const newChatId = response?.data?.chatId || `temp-${Date.now()}`;
      
      const newChat = {
        id: newChatId,
        title: title,
        messages: [],
        timestamp: new Date()
      };
      
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      
      return newChatId;
    } catch (err) {
      console.error('Failed to create initial chat:', err);
      return null;
    }
  };

  // Regular createNewChat should also follow the same pattern
  const createNewChat = async () => {
    const currentSessionId = sessionIdRef.current;
    
    if (!currentSessionId) {
      console.error('Cannot create chat: sessionId is null');
      return null;
    }

    try {
      const title = "New Chat";
      
      // Call the API first to create the chat
      const response = await createGuestChat(currentSessionId, title);
      
      // If the response contains a chat ID use it, otherwise generate a temporary one
      const newChatId = response?.data?.chatId || `temp-${Date.now()}`;
      
      const newChat = {
        id: newChatId,
        title: title,
        messages: [],
        timestamp: new Date()
      };
      
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      
      return newChatId;
    } catch (err) {
      console.error('Failed to create chat:', err);
      return null;
    }
  };

  const updateChatTitle = async (chatId, title) => {
    const currentSessionId = sessionIdRef.current;
    
    setChats(prev =>
      prev.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, title };
        }
        return chat;
      })
    );

    try {
      if (currentSessionId) {
        await updateGuestChat(currentSessionId, chatId, title);
      }
    } catch (err) {
      console.error('Failed to update chat title:', err);
    }
  };

  const deleteChat = async (chatId) => {
    const currentSessionId = sessionIdRef.current;
    
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setSelectedChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }

    try {
      if (currentSessionId) {
        await deleteGuestChat(currentSessionId, chatId);
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const sendMessage = async (chatId, message) => {
    const currentSessionId = sessionIdRef.current;
    
    try {
      if (!currentSessionId) {
        throw new Error('Session ID is missing');
      }
      
      const response = await sendGuestMessage(currentSessionId, message, chatId);
      
      setChats(prev =>
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
              lastMessage: response,
              timestamp: new Date()
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

  // Effect that runs when sessionId changes
  useEffect(() => {
    if (sessionId) {
      // Update the ref whenever sessionId changes
      sessionIdRef.current = sessionId;
      
      // If we have a session ID but no chats, create one
      if (chats.length === 0 && !isInitializing) {
        console.log('Creating initial chat after session ID set');
        createInitialChat(sessionId);
      }
    }
  }, [sessionId, chats.length, isInitializing]);

  // Main initialization effect
  useEffect(() => {
    const initSession = async () => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        setIsInitializing(true);
        const storedSessionId = localStorage.getItem('guestSessionId');
        
        if (storedSessionId) {
          try {
            const sessionResponse = await getGuestSession(storedSessionId);
            setSessionId(storedSessionId);
            sessionIdRef.current = storedSessionId;
            
            // Process the session data
            const processedChats = processSessionData(sessionResponse);
            
            if (processedChats.length > 0) {
              setChats(processedChats);
              setSelectedChatId(processedChats[0].id);
            } else {
              // No chats found, create one
              await createInitialChat(storedSessionId);
            }
          } catch (err) {
            console.error('Failed to restore session:', err);
            // Create a new session
            const response = await startGuestSession();
            const newSessionId = response.data.sessionId;
            
            // Set the session ID in both state and ref
            setSessionId(newSessionId);
            sessionIdRef.current = newSessionId;
            
            localStorage.setItem('guestSessionId', newSessionId);
            
            // Create an initial chat with the new session
            await createInitialChat(newSessionId);
          }
        } else {
          // No stored session, create a new one
          const response = await startGuestSession();
          const newSessionId = response.data.sessionId;
          
          // Set the session ID in both state and ref
          setSessionId(newSessionId);
          sessionIdRef.current = newSessionId;
          
          localStorage.setItem('guestSessionId', newSessionId);
          
          // Create an initial chat with the new session
          await createInitialChat(newSessionId);
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
  }, []);

  const value = {
    sessionId,
    chats,
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