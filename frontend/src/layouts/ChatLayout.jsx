import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';

const ChatLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    chats,
    selectedChatId,
    createNewChat,
    updateChatTitle,
    deleteChat,
    setSelectedChatId,
    isInitializing
  } = useChat();

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    navigate(`/chat/${newChatId}`);
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleUpdateChatTitle = async (chatId, title) => {
    await updateChatTitle(chatId, title);
  };

  const handleDeleteChat = async (chatId) => {
    await deleteChat(chatId);
    // Redirect to another chat if available, or create a new one
    const remainingChats = chats.filter(chat => chat.id !== chatId);
    if (remainingChats.length > 0) {
      navigate(`/chat/${remainingChats[0].id}`);
    } else {
      handleNewChat();
    }
  };

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed z-20 top-5 left-5 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300 md:hidden ${
          isSidebarOpen ? 'hidden' : 'block'
        }`}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <ChatSidebar
        messages={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onUpdateChatTitle={handleUpdateChatTitle}
        onDeleteChat={handleDeleteChat}
        selectedChatId={selectedChatId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatLayout;