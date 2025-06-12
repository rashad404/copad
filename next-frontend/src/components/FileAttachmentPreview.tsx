'use client';

import React from 'react';
import Image from 'next/image';
import { XMarkIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface FileAttachment {
  fileId: string;
  url: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string | Date;
  thumbnailUrl?: string;
  isImage: boolean;
}

interface FileAttachmentPreviewProps {
  files: FileAttachment[];
  onRemove?: (fileId: string) => void;
  readonly?: boolean;
}

const FileAttachmentPreview: React.FC<FileAttachmentPreviewProps> = ({ 
  files, 
  onRemove,
  readonly = false
}) => {
  const { t } = useTranslation();
  
  if (!files || files.length === 0) return null;
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576 * 10) / 10 + ' MB';
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {files.map((file) => (
        <div 
          key={file.fileId}
          className={`relative group flex items-center p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ${
            readonly ? '' : 'pr-8'
          }`}
        >
          {file.isImage ? (
            <div className="relative h-8 w-8 mr-2 overflow-hidden rounded">
              <Image 
                src={file.url} 
                alt={file.filename}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          ) : (
            <DocumentIcon className="h-8 w-8 text-gray-500 dark:text-gray-400 mr-2" />
          )}
          
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
              {file.filename}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.fileSize)}
            </span>
          </div>
          
          {!readonly && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(file.fileId)}
              className="absolute right-1 top-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
              title={t('chat.fileUpload.remove')}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileAttachmentPreview;