import React, { useState } from 'react';
import { MultiFileUpload } from './MultiFileUpload';
import { Paperclip, Send } from 'lucide-react';

interface ChatWithFileUploadProps {
  chatId: string;
  conversationId?: string;
  onSendMessage: (message: string, fileIds: string[]) => void;
}

export const ChatWithFileUpload: React.FC<ChatWithFileUploadProps> = ({
  chatId,
  conversationId,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'lab-results' | 'imaging' | 'prescriptions' | 'clinical-notes'>('general');

  const handleSend = () => {
    if (message.trim() || uploadedFileIds.length > 0) {
      onSendMessage(message, uploadedFileIds);
      setMessage('');
      setUploadedFileIds([]);
      setShowFileUpload(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    console.log('Files selected:', files);
  };

  const handleUploadComplete = (results: any[]) => {
    // Extract file IDs from results
    const fileIds = results
      .filter(r => r.success)
      .map(r => r.fileId);
    setUploadedFileIds(prev => [...prev, ...fileIds]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Chat messages would go here */}
      </div>

      {/* File upload area */}
      {showFileUpload && (
        <div className="border-t p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select document category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General Medical Documents</option>
              <option value="lab-results">Lab Results</option>
              <option value="imaging">Medical Imaging</option>
              <option value="prescriptions">Prescriptions</option>
              <option value="clinical-notes">Clinical Notes</option>
            </select>
          </div>
          
          <MultiFileUpload
            chatId={chatId}
            conversationId={conversationId}
            category={selectedCategory}
            onFilesSelected={handleFilesSelected}
            onUploadComplete={handleUploadComplete}
          />
          
          <button
            onClick={() => setShowFileUpload(false)}
            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Message input area */}
      <div className="border-t p-4">
        {uploadedFileIds.length > 0 && (
          <div className="mb-2 text-sm text-green-600">
            {uploadedFileIds.length} file(s) attached
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFileUpload(!showFileUpload)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Attach files"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={handleSend}
            disabled={!message.trim() && uploadedFileIds.length === 0}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};