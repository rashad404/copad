"use client";

import React, { useState, useEffect, useRef } from "react";
import { track } from "@/utils/analytics";
import type { FileUploadResult } from "@/components/MultiFileUpload";
import type { MedicalFileCategory } from "@/utils/fileCategories";
import { useTranslation } from "react-i18next";
import {
  ListBulletIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ChatSidebar from "./ChatSidebar";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { usePublicCopy } from "./public/ProductLayout";
import { Plus } from "lucide-react";
import FileAttachmentPreview from "./FileAttachmentPreview";
import { MultiFileUpload } from "./MultiFileUpload";
import { useChat } from "@/context/ChatContext";
import type { Message } from "@/context/ChatContext";
import { FileAttachment } from "@/types/chat";

interface GuestChatProps {
  containerClassName?: string;
  messagesClassName?: string;
  inputClassName?: string;
  hideHeaderOnMobile?: boolean;
  onTitleChange?: (title: string) => void;
  externalSidebarOpen?: boolean;
  onSidebarClose?: () => void;
}

const GuestChat: React.FC<GuestChatProps> = ({
  containerClassName = "",
  messagesClassName = "",
  inputClassName = "",
  hideHeaderOnMobile = false,
  onTitleChange,
  externalSidebarOpen,
  onSidebarClose,
}) => {
  const { t } = useTranslation();
  const c = usePublicCopy();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
    sessionId,
    error: sessionError,
    chats,
    selectedChatId,
    isInitializing,
    uploadedFiles,
    createNewChat,
    sendMessage,
    setSelectedChatId,
    removeUploadedFile,
  } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMultiFileUpload, setShowMultiFileUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "general" | "lab-results" | "imaging" | "prescriptions" | "clinical-notes"
  >("general");
  const [pendingFileIds, setPendingFileIds] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<FileAttachment[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedChatId) setMessages([]);
    if (selectedChatId) {
      const selectedChat = chats.find((chat) => chat.id === selectedChatId);
      if (selectedChat) {
        setMessages(selectedChat.messages || []);
      }
    }
  }, [selectedChatId, chats]);

  // Handle external sidebar control - only on mobile
  useEffect(() => {
    // Only sync external state on mobile
    const isMobile = window.innerWidth < 768;
    if (
      isMobile &&
      externalSidebarOpen !== undefined &&
      externalSidebarOpen !== isSidebarOpen
    ) {
      setIsSidebarOpen(externalSidebarOpen);
    }
  }, [externalSidebarOpen, isSidebarOpen]);

  // Notify parent of title changes only
  useEffect(() => {
    if (onTitleChange) {
      const selectedChat = chats.find((chat) => chat.id === selectedChatId);
      const title = selectedChat?.title || t("chat.untitledChat");
      onTitleChange(title);
    }
  }, [selectedChatId, chats, onTitleChange, t]);

  const handleMultiFileSelect = () => {
    // Files are selected in the MultiFileUpload component
  };

  const handleMultiFileUploadComplete = (results: FileUploadResult[]) => {
    // Extract file IDs and create file attachments from results
    const successfulFiles = results.filter((r) => r.success);
    const fileIds = successfulFiles.map((r) => r.fileId);

    // Create FileAttachment objects for preview
    const newFiles: FileAttachment[] = successfulFiles.map((file) => ({
      fileId: file.fileId,
      url: file.url ?? "", // Use the URL from backend which now matches single file upload pattern
      filename: file.filename,
      fileType: file.fileType || "application/octet-stream",
      fileSize: file.fileSize || 0,
      uploadedAt: file.uploadedAt ? new Date(file.uploadedAt) : new Date(),
      isImage:
        file.isImage !== undefined
          ? file.isImage
          : file.fileType
            ? file.fileType.startsWith("image/")
            : false,
    }));

    // Update states with new arrays to ensure re-render
    setPendingFileIds((prev) => [...prev, ...fileIds]);
    setPendingFiles((prev) => [...prev, ...newFiles]);
    setShowMultiFileUpload(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't send if message is empty AND there are no file attachments
    if (
      (!newMessage.trim() &&
        uploadedFiles.length === 0 &&
        pendingFiles.length === 0) ||
      loading
    )
      return;

    if (isInitializing || !sessionId || !selectedChatId) return;
    const messageToSend = newMessage.trim();
    setNewMessage("");

    // Create new message object with attachments
    const newMessageObj: Message = {
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
      attachments: [...uploadedFiles, ...pendingFiles],
      fileIds: [...pendingFileIds],
    };

    // Clear pending file IDs and files after including them in the message
    const currentPendingFiles = [...pendingFiles];
    setPendingFileIds([]);
    setPendingFiles([]);

    setMessages((prev) => [...prev, newMessageObj]);
    setLoading(true);

    try {
      // Counts only - never the message itself.
      track(messages.length === 0 ? "first_message_sent" : "message_sent", {
        attachments: pendingFileIds.length,
      });

      const startedAt = Date.now();
      const response = await sendMessage(
        selectedChatId,
        messageToSend,
        pendingFileIds,
        currentPendingFiles,
      );
      track("ai_response_received", { ms: Date.now() - startedAt });
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      track("error_shown", { where: "chat_send" });
      const errorMessage: Message = {
        role: "assistant",
        content: t("chat.error.message"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    if (chatId !== selectedChatId) {
      setPendingFileIds([]);
      setPendingFiles([]);
      setNewMessage("");
    }
    setSelectedChatId(chatId);
  };

  const formatMessage = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((paragraph, index) =>
      paragraph.trim() ? (
        <p key={index} className="mb-2">
          {paragraph
            .split(/(\*\*.*?\*\*)/g)
            .map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.slice(2, -2)}</strong>
              ) : (
                part
              ),
            )}
        </p>
      ) : null,
    );
  };

  const handleNewChat = async () => {
    const currentChat = chats.find((chat) => chat.id === selectedChatId);
    if (
      !currentChat ||
      (currentChat.messages && currentChat.messages.length > 0)
    ) {
      setPendingFileIds([]);
      setPendingFiles([]);
      setNewMessage("");
      await createNewChat();
    }
  };

  return (
    <div className={`public-chat-workspace ${containerClassName}`}>
      <ChatSidebar
        disabled={loading || isInitializing}
        messages={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          if (onSidebarClose) {
            onSidebarClose();
          }
        }}
      />
      <div className="public-chat-main">
        {/* Chat header - hidden on mobile when unified header is used */}
        <div
          className={`public-chat-heading ${hideHeaderOnMobile ? "hidden md:flex" : ""}`}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-2 text-gray-500 hover:text-gray-700  "
            title={t("chat.openSidebar")}
          >
            <ListBulletIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ">
            {chats.find((chat) => chat.id === selectedChatId)?.title ||
              t("chat.untitledChat")}
          </h1>
        </div>
        {/* Chat messages */}
        <div
          ref={messagesContainerRef}
          className={`public-chat-messages ${messagesClassName}`}
          role="log"
          aria-label={c("Conversation", "Söhbət")}
          aria-relevant="additions"
        >
          {isInitializing ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 "></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="public-chat-welcome">
              <span className="public-chat-mark">
                <Plus size={30} strokeWidth={2.5} />
              </span>
              <p className="public-eyebrow">
                {c("A little clarity starts here", "Aydınlıq buradan başlayır")}
              </p>
              <h2>{c("What's on your mind?", "Sizi nə düşündürür?")}</h2>
              <p>
                {c(
                  "Tell me how you feel, ask a question, or share a medical document.",
                  "Özünüzü necə hiss etdiyinizi yazın, sual verin və ya tibbi sənəd paylaşın.",
                )}
              </p>
              <div className="public-chat-prompts">
                {[
                  c(
                    "Help me understand a lab result",
                    "Analiz nəticəsini anlamağa kömək et",
                  ),
                  c("I have a health question", "Sağlamlıqla bağlı sualım var"),
                  c(
                    "Help me prepare for a doctor's visit",
                    "Həkim qəbuluna hazırlaşmağa kömək et",
                  ),
                ].map((prompt) => (
                  <button
                    key={prompt}
                    disabled={!sessionId || !selectedChatId}
                    onClick={() => {
                      setNewMessage(prompt);
                      inputRef.current?.focus();
                    }}
                  >
                    {prompt}
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`public-message flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`public-message-content ${
                    message.role === "user"
                      ? "public-message-user"
                      : "text-gray-800"
                  }`}
                >
                  {formatMessage(message.content)}

                  {/* Show file attachments if any */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2">
                      <FileAttachmentPreview
                        files={message.attachments}
                        readonly={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 bg-gray-500  rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500  rounded-full animate-bounce"
                  style={{ animationDelay: "200ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500  rounded-full animate-bounce"
                  style={{ animationDelay: "400ms" }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Multi-file upload modal */}
        {showMultiFileUpload && (
          <Dialog
            open={showMultiFileUpload}
            onClose={() => setShowMultiFileUpload(false)}
            className="public-upload-dialog"
          >
            <div className="public-dialog-backdrop" aria-hidden="true" />
            <div className="public-upload-position">
              <DialogPanel className="public-upload-panel bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    {t("chat.fileUpload.multipleFiles")}
                  </DialogTitle>
                  <button
                    aria-label={c("Close upload", "Yükləməni bağla")}
                    onClick={() => setShowMultiFileUpload(false)}
                    className="text-gray-500 hover:text-gray-700  "
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Category selector */}
                <div className="mb-4">
                  <label
                    htmlFor="upload-category"
                    className="block text-sm font-medium text-gray-700  mb-2"
                  >
                    {t("chat.fileUpload.selectCategory")}
                  </label>
                  <select
                    id="upload-category"
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value as MedicalFileCategory)
                    }
                    className="w-full p-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent  "
                  >
                    <option value="general">
                      {t("chat.fileUpload.categories.general")}
                    </option>
                    <option value="lab-results">
                      {t("chat.fileUpload.categories.labResults")}
                    </option>
                    <option value="imaging">
                      {t("chat.fileUpload.categories.imaging")}
                    </option>
                    <option value="prescriptions">
                      {t("chat.fileUpload.categories.prescriptions")}
                    </option>
                    <option value="clinical-notes">
                      {t("chat.fileUpload.categories.clinicalNotes")}
                    </option>
                  </select>
                </div>

                <MultiFileUpload
                  chatId={selectedChatId}
                  category={selectedCategory}
                  onFilesSelected={handleMultiFileSelect}
                  onUploadComplete={handleMultiFileUploadComplete}
                  maxFiles={10}
                />
              </DialogPanel>
            </div>
          </Dialog>
        )}

        {/* Message input */}
        {sessionError && (
          <div className="public-chat-error" role="alert">
            {!selectedChatId
              ? c(
                  "Could not connect to your chat. Please reconnect.",
                  "Söhbətə qoşulmaq mümkün olmadı. Yenidən qoşulun.",
                )
              : sessionError === "Failed to send message"
                ? c(
                    "Your message could not be sent. Please try again.",
                    "Mesajınızı göndərmək mümkün olmadı. Yenidən cəhd edin.",
                  )
                : c(
                    "The conversation could not be updated. Please try again.",
                    "Söhbəti yeniləmək mümkün olmadı. Yenidən cəhd edin.",
                  )}
            {(!sessionId || !selectedChatId) && (
              <button onClick={() => window.location.reload()}>
                {c("Reconnect", "Yenidən qoşul")}
              </button>
            )}
          </div>
        )}
        <div className={`public-chat-composer ${inputClassName}`}>
          <div className="flex flex-col w-full">
            {/* File attachments preview */}
            {uploadedFiles.length > 0 && (
              <div className="mb-2">
                <FileAttachmentPreview
                  files={uploadedFiles}
                  onRemove={removeUploadedFile}
                />
              </div>
            )}

            {/* Show pending files preview */}
            {pendingFiles.length > 0 && (
              <div className="mb-2">
                <FileAttachmentPreview
                  files={pendingFiles}
                  onRemove={(fileId) => {
                    setPendingFiles((prev) =>
                      prev.filter((f) => f.fileId !== fileId),
                    );
                    setPendingFileIds((prev) =>
                      prev.filter((id) => id !== fileId),
                    );
                  }}
                />
              </div>
            )}

            <form
              onSubmit={handleSendMessage}
              className="flex gap-2 w-full max-w-full"
            >
              {/* File upload button */}
              <button
                type="button"
                onClick={() => setShowMultiFileUpload(true)}
                disabled={
                  loading || isInitializing || !selectedChatId || !sessionId
                }
                className="p-2 text-gray-500 hover:text-gray-700   disabled:opacity-50 disabled:cursor-not-allowed"
                title={t("chat.fileUpload.multipleFiles")}
              >
                <PaperClipIcon className="w-6 h-6" />
              </button>

              <textarea
                ref={inputRef}
                rows={2}
                aria-label={t("chat.messagePlaceholder")}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  uploadedFiles.length > 0
                    ? t("chat.messageWithFilesPlaceholder")
                    : t("chat.messagePlaceholder")
                }
                className="flex-1 min-w-0 rounded-lg border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500   "
                disabled={
                  loading || isInitializing || !selectedChatId || !sessionId
                }
              />

              <button
                type="submit"
                aria-label={c("Send message", "Mesajı göndər")}
                disabled={
                  loading ||
                  (!newMessage.trim() &&
                    uploadedFiles.length === 0 &&
                    pendingFiles.length === 0) ||
                  isInitializing ||
                  !selectedChatId ||
                  !sessionId
                }
                className={`shrink-0 px-4 py-2 rounded-lg ${
                  loading ||
                  (!newMessage.trim() &&
                    uploadedFiles.length === 0 &&
                    pendingFiles.length === 0) ||
                  isInitializing ||
                  !selectedChatId ||
                  !sessionId
                    ? "bg-gray-300  cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white font-medium`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </form>
            <p className="public-composer-note">
              {c(
                "AI guidance · Not a substitute for a doctor. For emergencies, contact local emergency services.",
                "Süni intellekt məlumatları · Həkimi əvəz etmir. Təcili hallarda yerli təcili yardım xidmətinə müraciət edin.",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestChat;
