'use client';

import React, { useRef, useState } from 'react';
import { PaperClipIcon, XMarkIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface FileUploadButtonProps {
  onFileSelected: (file: File) => Promise<void>;
  isDisabled?: boolean;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelected,
  isDisabled = false,
  acceptedFileTypes = "image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain",
  maxFileSizeMB = 10
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError(t('chat.fileUpload.invalidType'));
      return;
    }
    
    // Validate file size
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(t('chat.fileUpload.tooLarge', { size: maxFileSizeMB }));
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    try {
      await onFileSelected(file);
    } catch (err) {
      console.error('File upload failed:', err);
      setError(t('chat.fileUpload.failed'));
    } finally {
      setIsUploading(false);
      
      // Reset the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getButtonIcon = () => {
    if (isUploading) {
      return (
        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    return <PaperClipIcon className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled || isUploading}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title={t('chat.fileUpload.buttonTitle')}
      >
        {getButtonIcon()}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg whitespace-nowrap">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;