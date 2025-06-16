# Chat History Loading Issue - Fix Summary

## Changes Made

### 1. Enhanced API Response Logging
- Added detailed logging to `api.ts` to see exact response structures
- Added logging to `guestService.ts` for chat creation and session retrieval
- Added comprehensive logging throughout `ChatContext.tsx`

### 2. Created Helper Functions for Data Normalization
- Created `src/utils/chatHelpers.ts` with functions to:
  - Normalize chat objects from various backend response formats
  - Normalize message objects consistently
  - Extract chat IDs from different response field names
  - Validate chat IDs

### 3. Updated ChatContext.tsx
- Added robust ID handling that checks multiple possible field names (id, chatId, _id, chat_id)
- Added validation to prevent sending messages to undefined chat IDs
- Improved chat selection logic with proper validation
- Added proper message normalization when loading history
- Added `refreshChats()` function to sync with backend
- Improved error handling and recovery

### 4. Created Debug Tools
- Created `src/utils/debugApi.ts` to test API responses
- Created `src/components/DebugPanel.tsx` for runtime debugging (dev mode only)

## Key Issues Addressed

1. **Chat ID Mapping**: The backend might return chat IDs in different fields (id, chatId, etc). Now we check all possible fields.

2. **Message Loading**: Each chat now loads its own messages separately when selected, preventing message mixing.

3. **Chat Creation**: Properly extracts and validates chat IDs when creating new chats.

4. **Session Recovery**: Better handling of session recovery on app restart with proper chat loading.

## How to Test

1. **Run the app and check console logs** - You should see detailed API responses
2. **Create multiple chats** - Each should have a unique ID
3. **Switch between chats** - Messages should be isolated to each chat
4. **Restart the app** - Chats should load correctly without combining messages

## Next Steps

1. Monitor the console logs to see the exact structure of backend responses
2. If chat IDs are still undefined, check the backend API to ensure it's returning proper IDs
3. Consider adding the DebugPanel to the GuestChatScreen during development to see real-time state

## Potential Backend Issues to Check

Based on the symptoms, the backend might have these issues:
1. Not returning unique chat IDs when creating chats
2. Returning all messages regardless of chat ID when fetching history
3. Chat creation endpoint might not be returning the created chat object properly

## Usage of Debug Tools

To use the debug panel in development:
```tsx
// In GuestChatScreen.tsx, add:
import { DebugPanel } from '../../components/DebugPanel';

// In the render, before the closing SafeAreaView:
{__DEV__ && <DebugPanel />}
```

This will show real-time state of chats, messages, and session data.