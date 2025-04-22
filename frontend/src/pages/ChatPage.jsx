import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';
import userAvatar from "../assets/user.png";
import doctorAvatar from "../assets/doctor.png";

export default function ChatPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const {
    chats,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
    isInitializing
  } = useChat();

  const currentChat = chats.find(chat => chat.id === (id || selectedChatId));
  const messages = currentChat?.messages || [];

  useEffect(() => {
    if (id && id !== selectedChatId) {
      setSelectedChatId(id);
    }
  }, [id, selectedChatId, setSelectedChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isInitializing) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isInitializing]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    
    const messageToSend = input.trim();
    setInput("");
    setSending(true);
    
    try {
      await sendMessage(selectedChatId, messageToSend);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  if (isInitializing) {
    return null; // Layout will show loading state
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{t('chat.empty.title')}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {t('chat.empty.description')}
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <img 
                  src={doctorAvatar} 
                  alt="AI" 
                  className="h-8 w-8 rounded-full border-2 border-indigo-100 mr-2" 
                />
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.timestamp && (
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <img
                  src={userAvatar}
                  alt="User"
                  className="h-8 w-8 rounded-full border-2 border-indigo-100 ml-2"
                />
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chat input */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <form onSubmit={handleSend} className="flex space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.messagePlaceholder')}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              t('chat.send')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}