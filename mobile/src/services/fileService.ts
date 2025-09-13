import api from './api';
import * as FileSystem from 'expo-file-system';
import { replaceLocalhostUrl } from '../config/environment';

export interface UploadedFile {
  fileId: string;
  filename: string;
  url: string;
  type?: string;
  fileType?: string;
  size?: number;
  fileSize?: number;
  category?: string;
}

export interface BatchUploadResponse {
  batchId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  files: UploadedFile[];
}

class FileService {
  // Upload multiple files in batch
  async uploadBatch(
    chatId: string | number,
    files: { uri: string; name: string; type: string; category?: string }[],
    guestSessionId?: string
  ): Promise<BatchUploadResponse> {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      
      // @ts-ignore - FormData append with blob works in React Native
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type || 'application/octet-stream',
      });
      
      if (file.category) {
        formData.append(`categories[${i}]`, file.category);
      }
    }
    
    const headers: any = {
      'Content-Type': 'multipart/form-data',
    };
    
    if (guestSessionId) {
      headers['X-Guest-Session-Id'] = guestSessionId;
    }
    
    const response = await api.post(
      `/api/v2/messages/chat/${chatId}/files/batch`,
      formData,
      { headers }
    );
    
    return response.data;
  }
  
  // Check batch upload status
  async getBatchStatus(batchId: string, guestSessionId?: string): Promise<BatchUploadResponse> {
    const headers: any = {};
    if (guestSessionId) {
      headers['X-Guest-Session-Id'] = guestSessionId;
    }
    
    const response = await api.get(
      `/api/v2/messages/files/batch/${batchId}/status`,
      { headers }
    );
    
    return response.data;
  }
  
  // Get uploaded files from batch
  async getBatchFiles(batchId: string, guestSessionId?: string): Promise<UploadedFile[]> {
    const headers: any = {};
    if (guestSessionId) {
      headers['X-Guest-Session-Id'] = guestSessionId;
    }
    
    const response = await api.get(
      `/api/v2/messages/files/batch/${batchId}/files`,
      { headers }
    );
    
    // Fix URLs to use the public URL and normalize fields
    const files = response.data.map((file: any) => ({
      fileId: file.fileId,
      filename: file.filename,
      url: file.url ? replaceLocalhostUrl(file.url) : file.url,
      type: file.fileType || file.type,
      size: file.fileSize || file.size,
      category: file.category
    }));
    
    return files;
  }
  
  // Legacy single file upload (for backwards compatibility)
  async uploadSingleImage(
    chatId: string | number,
    uri: string,
    filename: string,
    guestSessionId?: string
  ): Promise<UploadedFile> {
    const formData = new FormData();
    
    // @ts-ignore
    formData.append('file', {
      uri,
      name: filename,
      type: 'image/jpeg',
    });
    formData.append('chatId', String(chatId));
    
    const headers: any = {
      'Content-Type': 'multipart/form-data',
    };
    
    if (guestSessionId) {
      headers['X-Guest-Session-Id'] = guestSessionId;
    }
    
    const response = await api.post('/api/upload/chat/image', formData, { headers });
    
    return {
      fileId: response.data.fileId,
      filename: response.data.filename,
      url: response.data.url ? replaceLocalhostUrl(response.data.url) : response.data.url,
      type: 'image',
      size: 0,
    };
  }
  
  async uploadSingleDocument(
    chatId: string | number,
    uri: string,
    filename: string,
    type: string,
    guestSessionId?: string
  ): Promise<UploadedFile> {
    const formData = new FormData();
    
    // @ts-ignore
    formData.append('file', {
      uri,
      name: filename,
      type: type || 'application/pdf',
    });
    formData.append('chatId', String(chatId));
    
    const headers: any = {
      'Content-Type': 'multipart/form-data',
    };
    
    if (guestSessionId) {
      headers['X-Guest-Session-Id'] = guestSessionId;
    }
    
    const response = await api.post('/api/upload/chat/document', formData, { headers });
    
    return {
      fileId: response.data.fileId,
      filename: response.data.filename,
      url: response.data.url ? replaceLocalhostUrl(response.data.url) : response.data.url,
      type: 'document',
      size: 0,
    };
  }
}

export const fileService = new FileService();

// File type restrictions by category
export const FILE_RESTRICTIONS = {
  general: {
    types: ['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['.pdf', '.txt', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  'lab-results': {
    types: ['application/pdf', 'text/plain', 'text/csv'],
    extensions: ['.pdf', '.txt', '.csv'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  imaging: {
    types: ['image/jpeg', 'image/png', 'application/pdf'],
    extensions: ['.jpg', '.jpeg', '.png', '.pdf', '.dcm'],
    maxSize: 50 * 1024 * 1024, // 50MB
  },
  prescriptions: {
    types: ['application/pdf', 'image/jpeg', 'image/png'],
    extensions: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  'clinical-notes': {
    types: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['.pdf', '.txt', '.doc', '.docx'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
};

// Validate file based on category
export function validateFile(file: { size?: number; type?: string; name: string }, category: string = 'general'): { valid: boolean; error?: string } {
  const restrictions = FILE_RESTRICTIONS[category as keyof typeof FILE_RESTRICTIONS] || FILE_RESTRICTIONS.general;
  
  // Check file size
  if (file.size && file.size > restrictions.maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit of ${restrictions.maxSize / 1024 / 1024}MB`,
    };
  }
  
  // Check file type or extension
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (extension && !restrictions.extensions.includes(extension)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${restrictions.extensions.join(', ')}`,
    };
  }
  
  return { valid: true };
}