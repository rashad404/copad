import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  Appbar,
  Portal,
  ActivityIndicator,
  List,
  Dialog,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../../contexts/ChatContext';
import { Drawer } from 'react-native-drawer-layout';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { FileAttachmentPreview } from '../../components/FileAttachmentPreview';
import { fileService, validateFile, UploadedFile } from '../../services/fileService';
import { optimizeImages, OPTIMIZATION_PRESETS } from '../../utils/imageOptimizer';

const { width: screenWidth } = Dimensions.get('window');

export const GuestChatScreen: React.FC = () => {
  const { 
    guestSessionId,
    chats, 
    currentChat, 
    messages, 
    isLoading,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    updateChatTitle,
  } = useChat();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const colors = getThemeColors(resolvedTheme);
  const styles = createStyles(colors);
  
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!inputText.trim() && uploadedFiles.length === 0) || sending) return;

    setSending(true);
    setInputText('');
    
    try {
      const fileIds = uploadedFiles.map(f => f.fileId);
      await sendMessage(inputText.trim() || 'Attached files', fileIds);
      // Clear files after sending
      setUploadedFiles([]);
      setPendingFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images' as any,
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets) {
      const newFiles = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        type: asset.mimeType || 'image/jpeg',
        localUri: asset.uri,
      }));
      
      // Show files immediately in preview
      setPendingFiles([...pendingFiles, ...newFiles]);
      
      // Optimize images before uploading
      optimizeAndUploadImages(newFiles);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size,
          localUri: asset.uri,
        }));
        
        // Validate files
        for (const file of newFiles) {
          const validation = validateFile(file);
          if (!validation.valid) {
            Alert.alert('Invalid File', validation.error);
            return;
          }
        }
        
        setPendingFiles([...pendingFiles, ...newFiles]);
        uploadFiles(newFiles);
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const optimizeAndUploadImages = async (imageFiles: any[]) => {
    if (!currentChat || !guestSessionId) return;
    
    setUploading(true);
    try {
      // Choose optimization preset based on file sizes
      let totalSize = 0;
      for (const file of imageFiles) {
        if (file.size) totalSize += file.size;
      }
      
      // Select preset based on total size
      let preset = OPTIMIZATION_PRESETS.medical; // Default for medical use
      if (totalSize > 20 * 1024 * 1024) { // > 20MB total
        preset = OPTIMIZATION_PRESETS.aggressive;
        console.log('Using aggressive optimization for large files');
      } else if (totalSize > 10 * 1024 * 1024) { // > 10MB total
        preset = OPTIMIZATION_PRESETS.chat;
        console.log('Using chat optimization for medium files');
      }
      
      // Optimize images with selected preset
      const optimizedFiles = await optimizeImages(imageFiles, preset);
      
      // Update pending files with optimized versions
      setPendingFiles(prev => 
        prev.map(file => {
          const optimized = optimizedFiles.find(opt => 
            file.name === opt.name || file.uri === imageFiles.find(img => img.name === file.name)?.uri
          );
          return optimized || file;
        })
      );
      
      // Upload optimized files
      await uploadFiles(optimizedFiles);
    } catch (error) {
      console.error('Image optimization error:', error);
      // Fall back to uploading original files if optimization fails
      await uploadFiles(imageFiles);
    } finally {
      setUploading(false);
    }
  };

  const uploadFiles = async (files: any[]) => {
    if (!currentChat || !guestSessionId) return;
    
    try {
      const response = await fileService.uploadBatch(
        currentChat.id,
        files,
        guestSessionId
      );
      
      // Poll for upload completion
      let attempts = 0;
      const maxAttempts = 30;
      
      const checkStatus = async () => {
        const status = await fileService.getBatchStatus(response.batchId, guestSessionId);
        
        if (status.status === 'completed') {
          const uploadedFilesData = await fileService.getBatchFiles(response.batchId, guestSessionId);
          setUploadedFiles([...uploadedFiles, ...uploadedFilesData]);
          setPendingFiles([]);
        } else if (status.status === 'failed') {
          Alert.alert('Upload Failed', 'Failed to upload files. Please try again.');
          setPendingFiles([]);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 1000);
        } else {
          Alert.alert('Upload Timeout', 'File upload is taking too long. Please try again.');
          setPendingFiles([]);
        }
      };
      
      await checkStatus();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Error', 'Failed to upload files. Please try again.');
      setPendingFiles([]);
    } finally {
      if (!files.some(f => f.type && f.type.startsWith('image/'))) {
        setUploading(false);
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.fileId !== fileId));
    setPendingFiles(pendingFiles.filter(f => f.uri !== fileId));
  };


  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.role === 'user';
    
    if (item.isLoading) {
      return (
        <View style={[styles.messageContainer, styles.assistantMessage]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.assistantMessage,
        ]}
      >
        <Text style={[styles.messageText, isUser && styles.userMessageText]}>
          {item.content}
        </Text>
        {item.files && item.files.length > 0 && (
          <FileAttachmentPreview
            files={item.files}
            onRemove={() => {}}
            showInMessage={true}
          />
        )}
      </View>
    );
  };

  const renderDrawerContent = () => (
    <SafeAreaView style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Messages</Text>
        <IconButton
          icon="close"
          size={24}
          onPress={() => setDrawerOpen(false)}
          iconColor={colors.textSecondary}
        />
      </View>
      
      <Button
        mode="contained"
        onPress={async () => {
          console.log('Creating new chat...');
          await createNewChat();
          setDrawerOpen(false);
        }}
        style={styles.newChatButton}
        icon="plus"
        buttonColor={colors.primary}
      >
        New Chat
      </Button>
      
      <FlatList
        data={chats}
        keyExtractor={(item, index) => item.id?.toString() || `chat-${index}`}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              style={[
                styles.chatItem,
                currentChat?.id === item.id && styles.activeChatItem,
              ]}
              onPress={() => {
                console.log('Selecting chat:', item);
                selectChat(item);
                setDrawerOpen(false);
              }}
            >
              <View style={styles.chatItemContent}>
                <Text style={styles.chatItemTitle} numberOfLines={1}>
                  {item.title || 'Untitled Chat'}
                </Text>
                <Text style={styles.chatItemTime}>
                  {(item.updatedAt || item.timestamp) ? new Date(item.updatedAt || item.timestamp).toLocaleDateString() : ''}
                </Text>
              </View>
              <View style={styles.chatItemActions}>
                <IconButton
                  icon="pencil"
                  size={18}
                  onPress={() => {/* TODO: Edit chat title */}}
                  iconColor={colors.textSecondary}
                />
                <IconButton
                  icon="delete"
                  size={18}
                  onPress={() => deleteChat(item.id)}
                  iconColor={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Setting up your chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      renderDrawerContent={renderDrawerContent}
      drawerPosition="left"
      drawerStyle={{ width: Math.min(screenWidth * 0.8, 300) }}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <IconButton
            icon="format-list-bulleted"
            size={24}
            onPress={() => setDrawerOpen(true)}
            iconColor={colors.textSecondary}
            style={styles.headerButton}
          />
          <Text 
            style={styles.headerTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentChat?.title || 'Untitled Chat'}
          </Text>
          <IconButton
            icon="menu"
            size={24}
            onPress={() => setShowMainMenu(true)}
            iconColor={colors.textSecondary}
            style={styles.headerButton}
          />
        </View>

        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => `${item.id || index}`}
            contentContainerStyle={styles.messagesList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text variant="headlineSmall" style={styles.welcomeTitle}>
                  Your AI Doctor. Available 24/7.
                </Text>
                <Text variant="bodyLarge" style={styles.welcomeText}>
                  Ask a health question and get instant advice from Azdoc AI Doctor — no registration needed.
                </Text>
              </View>
            }
          />

          <View style={styles.inputWrapper}>
            {/* File attachments preview */}
            {(uploadedFiles.length > 0 || pendingFiles.length > 0) && (
              <View style={styles.filePreviewContainer}>
                <FileAttachmentPreview
                  files={[...uploadedFiles, ...pendingFiles]}
                  onRemove={removeFile}
                />
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={pickImage}
                disabled={sending || uploading}
                style={styles.attachButton}
              >
                <Ionicons name="image-outline" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={pickDocument}
                disabled={sending || uploading}
                style={styles.attachButton}
              >
                <Ionicons name="document-outline" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder={uploadedFiles.length > 0 ? "Add a message (optional)..." : "Type your message..."}
                placeholderTextColor={colors.textTertiary}
                multiline={false}
                disabled={sending || uploading}
                onSubmitEditing={handleSendMessage}
                mode="flat"
                textColor={colors.text}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                theme={{
                  colors: {
                    background: colors.inputBackground,
                  }
                }}
              />
              
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={(!inputText.trim() && uploadedFiles.length === 0) || sending || uploading}
                style={[
                  styles.sendButton,
                  ((!inputText.trim() && uploadedFiles.length === 0) || sending || uploading) && styles.sendButtonDisabled
                ]}
              >
                {sending || uploading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="send" size={20} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        <Portal>
          <Modal
            visible={showMainMenu}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowMainMenu(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowMainMenu(false)}
            >
              <TouchableOpacity
                style={styles.mainMenuContainer}
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <SafeAreaView style={styles.mainMenuContent}>
                  <View style={styles.mainMenuHeader}>
                    <Text style={styles.mainMenuTitle}>Azdoc</Text>
                    <IconButton
                      icon="close"
                      size={24}
                      onPress={() => setShowMainMenu(false)}
                      iconColor="#ffffff"
                    />
                  </View>
                  
                  <View style={styles.mainMenuItems}>
                    <View style={styles.themeSection}>
                      <Text style={styles.themeSectionTitle}>Theme</Text>
                      <TouchableOpacity
                        style={[
                          styles.themeOption,
                          theme === 'light' && styles.themeOptionActive
                        ]}
                        onPress={() => setTheme('light')}
                      >
                        <Ionicons 
                          name="sunny-outline" 
                          size={20} 
                          color={theme === 'light' ? '#4f46e5' : '#ffffff'} 
                        />
                        <Text style={[
                          styles.themeOptionText,
                          theme === 'light' && styles.themeOptionTextActive
                        ]}>Light</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.themeOption,
                          theme === 'dark' && styles.themeOptionActive
                        ]}
                        onPress={() => setTheme('dark')}
                      >
                        <Ionicons 
                          name="moon-outline" 
                          size={20} 
                          color={theme === 'dark' ? '#4f46e5' : '#ffffff'} 
                        />
                        <Text style={[
                          styles.themeOptionText,
                          theme === 'dark' && styles.themeOptionTextActive
                        ]}>Dark</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.themeOption,
                          theme === 'system' && styles.themeOptionActive
                        ]}
                        onPress={() => setTheme('system')}
                      >
                        <Ionicons 
                          name="phone-portrait-outline" 
                          size={20} 
                          color={theme === 'system' ? '#4f46e5' : '#ffffff'} 
                        />
                        <Text style={[
                          styles.themeOptionText,
                          theme === 'system' && styles.themeOptionTextActive
                        ]}>System</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </SafeAreaView>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </Portal>
      </SafeAreaView>
    </Drawer>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 4,
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  headerButton: {
    margin: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userMessage,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.assistantMessageText,
  },
  userMessageText: {
    color: colors.userMessageText,
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  filePreviewContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 21,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    height: 42,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  welcomeTitle: {
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50, // 50px padding for status bar
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16, // More padding on Android
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  newChatButton: {
    margin: 16,
    marginBottom: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatItemContent: {
    flex: 1,
  },
  chatItemTitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  chatItemTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chatItemActions: {
    flexDirection: 'row',
  },
  activeChatItem: {
    backgroundColor: colors.hover,
  },
  mainMenuContent: {
    flex: 1,
    backgroundColor: '#1f2937',
    paddingTop: 50, // 50px padding for status bar
  },
  mainMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 16, // Consistent padding since we added it to container
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  mainMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  mainMenuItems: {
    paddingTop: 8,
  },
  themeSection: {
    padding: 16,
  },
  themeSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  themeOptionActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  themeOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  themeOptionTextActive: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  mainMenuContainer: {
    width: '70%',
    height: '100%',
    alignSelf: 'flex-end',
  },
});