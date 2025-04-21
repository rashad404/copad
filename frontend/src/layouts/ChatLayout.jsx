import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';

const ChatLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    conversations,
    selectedChatId,
    createNewChat,
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

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Fixed sidebar */}
      <div className={`fixed left-0 top-0 h-full z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ChatSidebar
          conversations={conversations}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        {/* Header with sidebar toggle */}
        <div className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${isSidebarOpen ? 'hidden' : 'block'}`}
            title={t('chat.openSidebar')}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {conversations.find(chat => chat.id === selectedChatId)?.title || t('chat.untitledChat')}
          </h1>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatLayout; 