// Helper functions to normalize chat data from backend

export interface NormalizedChat {
  id: string | number;
  title: string;
  sessionId: string;
  createdAt?: string;
  updatedAt?: string;
  timestamp: string;
  lastMessage?: string;
  messages?: any[];
}

export interface NormalizedMessage {
  id?: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  isLoading?: boolean;
}

/**
 * Normalizes a chat object from various backend response formats
 */
export const normalizeChat = (chat: any, sessionId: string): NormalizedChat | null => {
  // Extract ID from various possible fields
  const id = chat.id || chat.chatId || chat._id || chat.chat_id;
  
  if (!id) {
    console.error('Chat object has no valid ID:', chat);
    return null;
  }
  
  return {
    id,
    title: chat.title || chat.name || 'Untitled Chat',
    sessionId: chat.sessionId || chat.session_id || sessionId,
    createdAt: chat.createdAt || chat.created_at,
    updatedAt: chat.updatedAt || chat.updated_at,
    timestamp: chat.createdAt || chat.created_at || chat.timestamp || new Date().toISOString(),
    lastMessage: chat.lastMessage || chat.last_message,
    messages: chat.messages || []
  };
};

/**
 * Normalizes a message object from various backend response formats
 * Handles deeply nested structure with circular references
 */
export const normalizeMessage = (message: any): NormalizedMessage => {
  // If the message has a nested structure (e.g., from getChatHistory)
  if (message.chat && typeof message.chat === 'object') {
    // Extract the actual message data from the nested structure
    return {
      id: message.id || message.messageId || message._id,
      content: message.content || message.message || message.text || '',
      role: message.role || (message.isUser ? 'user' : 'assistant') || 'assistant',
      timestamp: message.timestamp || message.createdAt || message.created_at || new Date().toISOString(),
      isLoading: false
    };
  }
  
  // Standard message normalization
  return {
    id: message.id || message.messageId || message._id,
    content: message.content || message.message || message.text || '',
    role: message.role || (message.isUser ? 'user' : 'assistant') || 'assistant',
    timestamp: message.timestamp || message.createdAt || message.created_at || new Date().toISOString(),
    isLoading: message.isLoading || false
  };
};

/**
 * Extracts messages from chat history response, handling circular references
 */
export const extractMessagesFromHistory = (historyResponse: any): NormalizedMessage[] => {
  if (!historyResponse) {
    console.warn('No history response provided');
    return [];
  }
  
  // Handle case where response might be wrapped
  let messages = historyResponse;
  if (historyResponse.data) {
    messages = historyResponse.data;
  }
  
  if (!Array.isArray(messages)) {
    console.warn('History response is not an array:', messages);
    return [];
  }
  
  const extractedMessages: NormalizedMessage[] = [];
  const seenIds = new Set<number>();
  
  messages.forEach((item: any) => {
    try {
      // Skip if we've already processed this message ID
      if (item.id && seenIds.has(item.id)) {
        return;
      }
      
      if (item.id) {
        seenIds.add(item.id);
      }
      
      // Log the structure to understand what we're dealing with
      console.log('Processing message item:', {
        id: item.id,
        hasChat: !!item.chat,
        hasContent: !!item.content,
        hasMessage: !!item.message,
        role: item.role
      });
      
      // Extract the actual message content from the nested structure
      const normalizedMessage = normalizeMessage(item);
      
      // Only add messages that have content
      if (normalizedMessage.content && normalizedMessage.content.trim()) {
        extractedMessages.push(normalizedMessage);
      }
    } catch (error) {
      console.error('Error processing message item:', error, item);
    }
  });
  
  // Sort messages by timestamp (oldest first)
  return extractedMessages.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

/**
 * Extracts chat ID from various response formats
 */
export const extractChatId = (response: any): string | number | null => {
  const id = response.id || response.chatId || response._id || response.chat_id;
  return id || null;
};

/**
 * Validates if a chat ID is valid
 */
export const isValidChatId = (id: any): boolean => {
  return id && id !== 'undefined' && id !== 'null' && id !== null && id !== undefined;
};