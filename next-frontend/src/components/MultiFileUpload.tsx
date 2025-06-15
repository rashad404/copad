import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, File, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import api from '@/api';

interface FileUploadItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  uploadedFileId?: string;
}

interface MultiFileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onUploadComplete?: (results: FileUploadResult[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  category?: 'general' | 'lab-results' | 'imaging' | 'prescriptions' | 'clinical-notes';
  chatId: string;
  conversationId?: string;
}

interface FileUploadResult {
  filename: string;
  fileId: string;
  success: boolean;
  error?: string;
}

const MEDICAL_FILE_CATEGORIES = {
  'lab-results': {
    formats: ['.pdf', '.txt', '.csv'],
    maxSizeMB: 10,
    description: 'Blood tests, urine analysis, pathology reports'
  },
  'imaging': {
    formats: ['.jpg', '.jpeg', '.png', '.dicom', '.pdf'],
    maxSizeMB: 50,
    description: 'X-rays, MRI, CT scans, ultrasounds'
  },
  'prescriptions': {
    formats: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSizeMB: 5,
    description: 'Medication lists, prescription images'
  },
  'clinical-notes': {
    formats: ['.pdf', '.txt', '.doc', '.docx'],
    maxSizeMB: 10,
    description: 'Doctor notes, discharge summaries'
  },
  'general': {
    formats: ['.pdf', '.txt', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    maxSizeMB: 10,
    description: 'General medical documents'
  }
};

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onFilesSelected,
  onUploadComplete,
  maxFiles = 10,
  category = 'general',
  chatId,
  conversationId
}) => {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const categoryConfig = MEDICAL_FILE_CATEGORIES[category];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > categoryConfig.maxSizeMB) {
      return `File size exceeds ${categoryConfig.maxSizeMB}MB limit`;
    }

    // Check file format
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!categoryConfig.formats.some(fmt => extension === fmt)) {
      return `File format not allowed. Accepted: ${categoryConfig.formats.join(', ')}`;
    }

    return null;
  };

  const processFiles = (fileList: FileList | File[]) => {
    const newFiles: FileUploadItem[] = [];
    const filesToAdd = Array.from(fileList).slice(0, maxFiles - files.length);

    filesToAdd.forEach(file => {
      const error = validateFile(file);
      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: error ? 'error' : 'pending',
        progress: 0,
        error
      });
    });

    setFiles(prev => [...prev, ...newFiles]);
    
    // Notify parent of valid files
    const validFiles = newFiles
      .filter(f => f.status === 'pending')
      .map(f => f.file);
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  }, [files.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    // Create FormData for batch upload
    const formData = new FormData();
    pendingFiles.forEach((fileItem, index) => {
      formData.append('files', fileItem.file);
    });
    formData.append('category', category);
    // Only append conversationId if it's a valid OpenAI conversation ID
    if (conversationId && conversationId.startsWith('conv_')) {
      formData.append('conversationId', conversationId);
    }

    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
      ));

      const response = await api.post(`/v2/messages/chat/${chatId}/files/batch`, formData, {
        headers: {
          'X-Guest-Session-Id': localStorage.getItem('guestSessionId') || ''
        }
      });

      const batchId = response.data.batchId;

      // Poll for batch upload status
      await pollBatchStatus(batchId);
      
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' 
          ? { ...f, status: 'error' as const, error: 'Upload failed' } 
          : f
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const pollBatchStatus = async (batchId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const checkStatus = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        throw new Error('Upload timeout');
      }

      const response = await api.get(`/v2/messages/files/batch/${batchId}/status`);
      const status = response.data;
      
      // Update progress
      const progress = status.progressPercentage;
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, progress } : f
      ));

      if (status.status === 'completed' || status.status === 'partial') {
        // Mark files as completed
        setFiles(prev => prev.map(f => 
          f.status === 'uploading' 
            ? { ...f, status: 'success' as const, progress: 100 } 
            : f
        ));

        // Fetch the uploaded files details
        try {
          const filesResponse = await api.get(`/v2/messages/files/batch/${batchId}/files`);
          const uploadedFiles = filesResponse.data;
          
          if (onUploadComplete) {
            // Map the files to the expected format
            const results = uploadedFiles.map((file: any) => ({
              filename: file.filename,
              fileId: file.fileId,
              success: true
            }));
            onUploadComplete(results);
          }
        } catch (error) {
          console.error('Failed to fetch uploaded files:', error);
          if (onUploadComplete) {
            onUploadComplete([]);
          }
        }
      } else if (status.status === 'failed') {
        throw new Error('Batch upload failed');
      } else {
        // Continue polling
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkStatus();
      }
    };

    await checkStatus();
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
      return '🖼️';
    } else if (extension === 'pdf') {
      return '📄';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return '📝';
    }
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {/* Category info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>{category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}:</strong>{' '}
          {categoryConfig.description}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Accepted formats: {categoryConfig.formats.join(', ')} | Max size: {categoryConfig.maxSizeMB}MB
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => files.length < maxFiles && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={categoryConfig.formats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={files.length >= maxFiles}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {files.length >= maxFiles
            ? `Maximum ${maxFiles} files reached`
            : 'Drag and drop files here, or click to browse'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {files.length}/{maxFiles} files selected
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(fileItem => (
            <div
              key={fileItem.id}
              className={`flex items-center p-3 rounded-lg border ${
                fileItem.status === 'error'
                  ? 'border-red-300 bg-red-50'
                  : fileItem.status === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className="text-2xl mr-3">{getFileIcon(fileItem.file)}</span>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileItem.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileItem.file.size)}
                </p>
                {fileItem.error && (
                  <p className="text-xs text-red-600 mt-1">{fileItem.error}</p>
                )}
                {fileItem.status === 'uploading' && (
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all"
                      style={{ width: `${fileItem.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="ml-4 flex items-center">
                {fileItem.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileItem.id);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                {fileItem.status === 'uploading' && (
                  <Loader className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {fileItem.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {fileItem.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.filter(f => f.status === 'pending').length > 0 && (
        <button
          onClick={uploadFiles}
          disabled={isUploading}
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : `Upload ${files.filter(f => f.status === 'pending').length} files`}
        </button>
      )}
    </div>
  );
};