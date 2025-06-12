'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import ImageModal from './ImageModal';

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
  const [modalImage, setModalImage] = useState<{ url: string; name: string } | null>(null);
  
  if (!files || files.length === 0) return null;
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576 * 10) / 10 + ' MB';
  };

  return (
    <div className={`${readonly ? 'space-y-2' : 'flex flex-wrap gap-2'} mt-2`}>
      {files.map((file) => {
        // Check if file is an image - fallback to fileType check if isImage is not properly set
        const isImage = file.isImage || (file.fileType && file.fileType.startsWith('image/'));
        
        return (
        <div key={file.fileId}>
          {isImage ? (
            // Image preview - show larger in chat messages
            readonly ? (
              <div className="relative group">
                <Image 
                  src={file.url} 
                  alt={file.filename}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  style={{ maxWidth: '300px', height: 'auto' }}
                  onClick={() => setModalImage({ url: file.url, name: file.filename })}
                  unoptimized={true}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                  <span className="truncate block">{file.filename}</span>
                  <span>{formatFileSize(file.fileSize)}</span>
                </div>
              </div>
            ) : (
              // Compact preview for upload area
              <div className={`relative group flex items-center p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pr-8`}>
                <div className="relative h-12 w-12 mr-2 overflow-hidden rounded">
                  <Image 
                    src={file.url} 
                    alt={file.filename}
                    width={48}
                    height={48}
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                    {file.filename}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.fileSize)}
                  </span>
                </div>
                {onRemove && (
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
            )
          ) : (
            // Document preview
            <div className={`relative group flex items-center p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ${
              readonly ? '' : 'pr-8'
            }`}>
              <DocumentIcon className="h-8 w-8 text-gray-500 dark:text-gray-400 mr-2" />
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
          )}
        </div>
        );
      })}
      
      {modalImage && (
        <ImageModal
          isOpen={true}
          onClose={() => setModalImage(null)}
          imageUrl={modalImage.url}
          imageName={modalImage.name}
        />
      )}
    </div>
  );
};

export default FileAttachmentPreview;