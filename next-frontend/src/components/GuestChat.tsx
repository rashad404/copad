'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ListBulletIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import ChatSidebar from './ChatSidebar';
import FileAttachmentPreview from './FileAttachmentPreview';
import { MultiFileUpload } from './MultiFileUpload';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';

interface GuestChatProps {
  containerClassName?: string;
  messagesClassName?: string;
  inputClassName?: string;
}

const GuestChat: React.FC<GuestChatProps> = ({ containerClassName = '', messagesClassName = '', inputClassName = '' }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const {
    sessionId,
    chats,
    selectedChatId,
    isInitializing,
    error,
    uploadedFiles,
    createNewChat,
    updateChatTitle,
    deleteChat,
    sendMessage,
    setSelectedChatId,
    uploadFile,
    removeUploadedFile,
    clearUploadedFiles
  } = useChat();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showMultiFileUpload, setShowMultiFileUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'lab-results' | 'imaging' | 'prescriptions' | 'clinical-notes'>('general');
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
    if (selectedChatId) {
      const selectedChat = chats.find((chat: any) => chat.id === selectedChatId);
      if (selectedChat) {
        setMessages(selectedChat.messages || []);
      }
    }
  }, [selectedChatId, chats]);


  const handleMultiFileSelect = (files: File[]) => {
    // Files are selected in the MultiFileUpload component
  };

  const handleMultiFileUploadComplete = (results: any[]) => {
    // Extract file IDs and create file attachments from results
    const successfulFiles = results.filter(r => r.success);
    const fileIds = successfulFiles.map(r => r.fileId);
    
    // Create FileAttachment objects for preview
    const newFiles: FileAttachment[] = successfulFiles.map(file => ({
      fileId: file.fileId,
      url: file.url, // Use the URL from backend which now matches single file upload pattern
      filename: file.filename,
      fileType: file.fileType || 'application/octet-stream',
      fileSize: file.fileSize || 0,
      uploadedAt: file.uploadedAt || new Date(),
      isImage: file.isImage !== undefined ? file.isImage : (file.fileType ? file.fileType.startsWith('image/') : false)
    }));
    
    // Update states with new arrays to ensure re-render
    setPendingFileIds(prev => [...prev, ...fileIds]);
    setPendingFiles(prev => [...prev, ...newFiles]);
    setShowMultiFileUpload(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Send:', { selectedChatId, sessionId, isInitializing, loading });
    
    // Don't send if message is empty AND there are no file attachments
    if ((!newMessage.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0) || loading) return;
    
    const messageToSend = newMessage.trim();
    setNewMessage('');
    
    // Create new message object with attachments
    const newMessageObj = { 
      role: 'user', 
      content: messageToSend, 
      timestamp: new Date(),
      attachments: [...uploadedFiles, ...pendingFiles],
      fileIds: [...pendingFileIds]
    };
    
    // Clear pending file IDs and files after including them in the message
    const currentPendingFiles = [...pendingFiles];
    setPendingFileIds([]);
    setPendingFiles([]);
    
    setMessages(prev => [...prev, newMessageObj]);
    setLoading(true);
    
    try {
      const response = await sendMessage(selectedChatId, messageToSend, pendingFileIds, currentPendingFiles);
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: t('chat.error.message'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const formatMessage = (text: string) => {
    if (!text) return null;
    text = text.replace(/(\d+\.\s)/g, '\n$1');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: paragraph }} />;
    });
  };

  const handleNewChat = async () => {
    const currentChat = chats.find((chat: any) => chat.id === selectedChatId);
    if (currentChat && currentChat.messages && currentChat.messages.length > 0) {
      await createNewChat();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${containerClassName}`}>
      <ChatSidebar
        messages={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col h-full w-full md:w-3xl mx-auto">
        {/* Chat header */}
        <div className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title={t('chat.openSidebar')}
          >
            <ListBulletIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {chats.find((chat: any) => chat.id === selectedChatId)?.title || t('chat.untitledChat')}
          </h1>
        </div>
        {/* Chat messages */}
        <div
          ref={messagesContainerRef}
          className={`flex-1 overflow-y-auto px-4 py-6 ${messagesClassName}`}
          style={{ paddingBottom: '120px' }}
        >
          {isInitializing ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('home.hero.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('home.hero.subtitle')}
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {message.role === 'assistant' && (
                  <Image
                    src="/doctor.png"
                    alt="AI"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
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
                  
                  {message.timestamp && (
                    <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <Image
                    src="/user.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full ml-2"
                  />
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start mb-4">
              <Image
                src="/doctor.png"
                alt="AI"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full mr-2"
              />
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Multi-file upload modal */}
        {showMultiFileUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {t('chat.fileUpload.multipleFiles')}
                </h2>
                <button
                  onClick={() => setShowMultiFileUpload(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              {/* Category selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('chat.fileUpload.selectCategory')}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="general">{t('chat.fileUpload.categories.general')}</option>
                  <option value="lab-results">{t('chat.fileUpload.categories.labResults')}</option>
                  <option value="imaging">{t('chat.fileUpload.categories.imaging')}</option>
                  <option value="prescriptions">{t('chat.fileUpload.categories.prescriptions')}</option>
                  <option value="clinical-notes">{t('chat.fileUpload.categories.clinicalNotes')}</option>
                </select>
              </div>
              
              <MultiFileUpload
                chatId={selectedChatId}
                category={selectedCategory}
                onFilesSelected={handleMultiFileSelect}
                onUploadComplete={handleMultiFileUploadComplete}
                maxFiles={10}
              />
            </div>
          </div>
        )}
        
        {/* Message input */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 px-3 py-2 border-t border-gray-100 dark:border-gray-700 sm:px-4 sm:py-3 z-40 ${inputClassName}`}>
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
                    setPendingFiles(prev => prev.filter(f => f.fileId !== fileId));
                    setPendingFileIds(prev => prev.filter(id => id !== fileId));
                  }}
                />
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-2 w-full max-w-full">
              {/* File upload button */}
              <button
                type="button"
                onClick={() => setShowMultiFileUpload(true)}
                disabled={loading || isInitializing || !selectedChatId || !sessionId}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('chat.fileUpload.multipleFiles')}
              >
                <PaperClipIcon className="w-6 h-6" />
              </button>
              
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={uploadedFiles.length > 0 
                  ? t('chat.messageWithFilesPlaceholder') 
                  : t('chat.messagePlaceholder')}
                className="flex-1 min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                disabled={loading || isInitializing || !selectedChatId || !sessionId}
              />
              
              <button
                type="submit"
                disabled={(loading || (!newMessage.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0) || isInitializing || !selectedChatId || !sessionId)}
                className={`shrink-0 px-4 py-2 rounded-lg ${
                  loading || (!newMessage.trim() && uploadedFiles.length === 0 && pendingFiles.length === 0) || isInitializing || !selectedChatId || !sessionId
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                } text-white font-medium`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestChat; 