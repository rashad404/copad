'use client';

import type { ReactNode } from 'react';
import { ChatProvider } from '@/context/ChatContext';

// Guest sessions belong to the chat route, not login, registration, or marketing.
export default function ChatLayout({ children }: { children: ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>;
}
