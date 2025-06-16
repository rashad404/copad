export interface FileAttachment {
  fileId: string;
  url: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  isImage: boolean;
}