import { guestService } from '../services/guestService';

export const debugApiResponses = async (sessionId: string) => {
  console.log('=== DEBUGGING API RESPONSES ===');
  console.log('Session ID:', sessionId);
  
  try {
    // 1. Get session data
    console.log('\n1. Getting session data...');
    const sessionData = await guestService.getSession(sessionId);
    console.log('Session data structure:', JSON.stringify(sessionData, null, 2));
    
    // 2. Create a new chat
    console.log('\n2. Creating new chat...');
    const newChat = await guestService.createGuestChat(sessionId, 'Debug Test Chat');
    console.log('New chat response:', JSON.stringify(newChat, null, 2));
    
    // 3. Get chat history
    if (newChat.id || newChat.chatId) {
      const chatId = newChat.id || newChat.chatId;
      console.log('\n3. Getting chat history for chat ID:', chatId);
      const history = await guestService.getChatHistory(sessionId, chatId);
      console.log('Chat history response:', JSON.stringify(history, null, 2));
      
      // 4. Send a test message
      console.log('\n4. Sending test message...');
      const messageResponse = await guestService.sendGuestMessage(
        sessionId, 
        chatId, 
        'This is a debug test message'
      );
      console.log('Message response:', JSON.stringify(messageResponse, null, 2));
      
      // 5. Get updated chat history
      console.log('\n5. Getting updated chat history...');
      const updatedHistory = await guestService.getChatHistory(sessionId, chatId);
      console.log('Updated history:', JSON.stringify(updatedHistory, null, 2));
    }
    
    // 6. Get session data again to see all chats
    console.log('\n6. Getting session data again...');
    const updatedSession = await guestService.getSession(sessionId);
    console.log('Updated session data:', JSON.stringify(updatedSession, null, 2));
    
  } catch (error) {
    console.error('Debug error:', error);
  }
  
  console.log('\n=== END DEBUG ===');
};