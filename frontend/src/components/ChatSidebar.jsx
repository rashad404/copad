import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const ChatSidebar = ({
  messages = [],
  onNewChat,
  onSelectChat,
  onUpdateChatTitle,
  onDeleteChat,
  selectedChatId,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleNewChat = async () => {
    await onNewChat();
    onClose();
  };

  const handleSelectChat = (chatId) => {
    onSelectChat(chatId);
    onClose();
  };

  const startEditingTitle = (chat, e) => {
    e.stopPropagation(); // Prevent selection of chat
    setEditingChatId(chat.id);
    setEditTitle(chat.title || t('chat.untitledChat'));
  };

  const saveTitle = async (e) => {
    e.preventDefault();
    if (editingChatId && editTitle.trim()) {
      if (onUpdateChatTitle) {
        await onUpdateChatTitle(editingChatId, editTitle.trim());
      }
      setEditingChatId(null);
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation(); // Prevent selection of chat
    if (window.confirm(t('chat.confirmDelete'))) {
      if (onDeleteChat) {
        onDeleteChat(chatId);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600/10 dark:bg-gray-900/10 backdrop-blur-sm z-30 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t('chat.messages')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title={t('chat.closeSidebar')}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
          >
            <PlusIcon className="w-5 h-5" />
            {t('chat.newChat')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {t('chat.noMessages')}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {messages.map((chat) => (
                <div key={chat.id} className="relative">
                  {editingChatId === chat.id ? (
                    <form onSubmit={saveTitle} className="p-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-800 dark:text-white"
                        autoFocus
                        onBlur={saveTitle}
                      />
                    </form>
                  ) : (
                    <button
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full group text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        selectedChatId === chat.id
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[170px]">
                            {chat.title || t('chat.untitledChat')}
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onUpdateChatTitle && (
                              <span
                                onClick={(e) => startEditingTitle(chat, e)}
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') startEditingTitle(chat, e); }}
                                aria-label={t('chat.editTitle')}
                              >
                                <PencilIcon className="w-4 h-4" />
                              </span>
                            )}
                            {onDeleteChat && (
                              <span
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDeleteChat(chat.id, e); }}
                                aria-label={t('chat.deleteChat')}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        </div>
                        {chat.lastMessage && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {typeof chat.lastMessage === 'string' && chat.lastMessage.length > 60 
                              ? chat.lastMessage.substring(0, 60) + '...' 
                              : chat.lastMessage}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatTimestamp(chat.timestamp)}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;