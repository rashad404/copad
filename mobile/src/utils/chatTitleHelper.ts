import { TFunction } from 'i18next';

/**
 * Helper function to display chat title
 * If the title is "New Chat", it returns the translated version
 * Otherwise, it returns the original title
 */
export const getDisplayChatTitle = (title: string | undefined, t: TFunction): string => {
  if (!title || title === 'New Chat') {
    return t('chat.newChat', 'New Chat');
  }
  return title;
};

/**
 * Check if a chat is a new/empty chat
 */
export const isNewChat = (title: string | undefined): boolean => {
  return !title || title === 'New Chat';
};