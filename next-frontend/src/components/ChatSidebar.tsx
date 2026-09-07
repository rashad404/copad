"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Plus, X, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePublicCopy } from "./public/ProductLayout";
interface Chat {
  id: string;
  title?: string;
  lastMessage?: string;
  timestamp?: string | number | Date;
}
interface Props {
  messages: Chat[];
  onNewChat: () => Promise<void>;
  onSelectChat: (id: string) => void;
  selectedChatId: string | null;
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
}
export default function ChatSidebar({
  messages,
  onNewChat,
  onSelectChat,
  selectedChatId,
  isOpen,
  onClose,
  disabled,
}: Props) {
  const { t } = useTranslation();
  const c = usePublicCopy();
  const content = (
    <>
      <button
        className="public-new-chat"
        disabled={disabled}
        onClick={async () => {
          await onNewChat();
          onClose();
        }}
      >
        <Plus size={18} />
        {t("chat.newChat")}
      </button>
      <p className="public-history-label">
        {c("Your conversations", "Söhbətləriniz")}
      </p>
      <div className="public-history-list">
        {messages.length === 0 ? (
          <p className="public-history-empty">
            {c(
              "Your conversations will appear here.",
              "Söhbətləriniz burada görünəcək.",
            )}
          </p>
        ) : (
          messages.map((chat) => (
            <button
              key={chat.id}
              disabled={disabled}
              aria-current={chat.id === selectedChatId ? "true" : undefined}
              onClick={() => {
                onSelectChat(chat.id);
                onClose();
              }}
            >
              <MessageCircle size={16} />
              <span>{chat.title || t("chat.untitledChat")}</span>
            </button>
          ))
        )}
      </div>
      <p className="public-history-note">
        {c(
          "One question is a good place to start.",
          "Əvvəlki söhbətə qayıda və ya yeni söhbət aça bilərsiniz.",
        )}
      </p>
    </>
  );
  return (
    <>
      <aside className="public-chat-sidebar" aria-label={t("chat.messages")}>
        {content}
      </aside>
      <Dialog open={isOpen} onClose={onClose} className="public-chat-dialog">
        <div className="public-dialog-backdrop" aria-hidden="true" />
        <DialogPanel className="public-chat-drawer">
          <div className="public-drawer-heading">
            <DialogTitle>{t("chat.messages")}</DialogTitle>
            <button onClick={onClose} aria-label={t("chat.closeSidebar")}>
              <X size={20} />
            </button>
          </div>
          {content}
        </DialogPanel>
      </Dialog>
    </>
  );
}
