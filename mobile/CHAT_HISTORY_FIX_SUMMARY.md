# Chat history in the rebuilt app

The previous debug-oriented guest chat implementation was replaced by `src/screens/Chat.tsx`. It uses the deployed session/chat contracts directly, and stores session identifiers under account/member-specific keys. Message bodies are loaded from the backend and are not logged or persisted in AsyncStorage.

Changing account or selected member remounts the chat scope. Late responses from an unmounted scope do not populate the visible conversation. A missing or expired guest session can be recreated; a transient backend error is shown with retry rather than silently replacing the user's session.

Emergency notices are saved per conversation. Ordinary subsequent messages do not clear the notice. New conversations have their own emergency state. Persisted emergency dial targets are restricted to 103 and 112.

The old debug panels and scripts that logged full response bodies have been removed. Use synthetic fixtures in `tests/browser-fixtures.cjs` for debugging.
