import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, IconButton, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../constants/theme';

interface FileAttachment {
  uri?: string;
  url?: string;
  name?: string;
  filename?: string;
  type?: string;
  fileType?: string;
  size?: number;
  fileSize?: number;
  fileId?: string;
  localUri?: string;
}

interface FileAttachmentPreviewProps {
  files: FileAttachment[];
  onRemove: (fileId: string) => void;
  showInMessage?: boolean;
}

export const FileAttachmentPreview: React.FC<FileAttachmentPreviewProps> = ({
  files,
  onRemove,
  showInMessage = false,
}) => {
  const { resolvedTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme);
  const styles = createStyles(colors, showInMessage);

  const getFileIcon = (file: FileAttachment) => {
    const type = file.type || file.fileType;
    if (!type) return 'document-outline';
    if (type.startsWith('image/')) return 'image-outline';
    if (type.includes('pdf')) return 'document-text-outline';
    if (type.includes('word') || type.includes('doc')) return 'document-outline';
    if (type.includes('text')) return 'document-text-outline';
    return 'document-outline';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (showInMessage) {
    // Display in chat message
    return (
      <View style={styles.messageContainer}>
        {files.map((file, index) => {
          const type = file.type || file.fileType;
          const isImage = type && type.startsWith('image/');
          const fileUri = file.url || file.uri || file.localUri;
          const fileName = file.filename || file.name || 'File';
          const fileSize = file.fileSize || file.size;
          
          if (isImage && fileUri) {
            return (
              <TouchableOpacity key={index} style={styles.messageImageContainer}>
                <Image source={{ uri: fileUri }} style={styles.messageImage} />
              </TouchableOpacity>
            );
          }
          
          return (
            <View key={index} style={styles.messageFileContainer}>
              <Ionicons name={getFileIcon(file)} size={24} color={colors.primary} />
              <View style={styles.messageFileInfo}>
                <Text style={styles.messageFileName} numberOfLines={1}>
                  {fileName}
                </Text>
                {fileSize && (
                  <Text style={styles.messageFileSize}>{formatFileSize(fileSize)}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  // Display in input area
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {files.map((file, index) => {
        const type = file.type || file.fileType;
        const isImage = type && type.startsWith('image/');
        const fileUri = file.uri || file.localUri || file.url;
        const fileId = file.fileId || file.uri || index.toString();
        const fileName = file.filename || file.name || 'File';
        
        return (
          <View key={fileId} style={styles.fileItem}>
            {isImage && fileUri ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: fileUri }} style={styles.previewImage} />
                <IconButton
                  icon="close-circle"
                  size={20}
                  onPress={() => onRemove(fileId)}
                  style={styles.removeButton}
                  iconColor="#ffffff"
                />
              </View>
            ) : (
              <Chip
                mode="flat"
                icon={() => <Ionicons name={getFileIcon(file)} size={16} color={colors.primary} />}
                onClose={() => onRemove(fileId)}
                style={styles.fileChip}
                textStyle={styles.fileChipText}
              >
                {fileName}
              </Chip>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const createStyles = (colors: any, showInMessage: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  fileItem: {
    marginRight: 8,
  },
  imagePreview: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    margin: 0,
  },
  fileChip: {
    backgroundColor: colors.backgroundSecondary,
  },
  fileChipText: {
    color: colors.text,
    fontSize: 12,
  },
  // Message display styles
  messageContainer: {
    marginTop: 8,
  },
  messageImageContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  messageImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
  },
  messageFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageFileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  messageFileName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  messageFileSize: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});