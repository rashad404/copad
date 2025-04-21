import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ChatSidebar = ({
  conversations = [],
  onNewChat,
  onSelectChat,
  selectedChatId,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {t('chat.conversations')}
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
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
        >
          <PlusIcon className="w-5 h-5" />
          {t('chat.newChat')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
              selectedChatId === chat.id
                ? 'bg-gray-100 dark:bg-gray-800'
                : ''
            }`}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {chat.title || t('chat.untitledChat')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {chat.lastMessage || t('chat.noMessages')}
            </div>
          </button>
        ))}

        {conversations.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
            {t('chat.noConversations')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar; 