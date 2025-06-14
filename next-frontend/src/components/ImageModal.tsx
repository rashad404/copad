'use client';

import React from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, imageName }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <Image
            src={imageUrl}
            alt={imageName || 'Image'}
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] object-contain"
            style={{ width: 'auto', height: 'auto' }}
            unoptimized={true}
          />
          
          {imageName && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
              {imageName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;