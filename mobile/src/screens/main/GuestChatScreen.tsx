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
import { useAuth } from '../../contexts/AuthContext';
import { Drawer } from 'react-native-drawer-layout';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/types';

const { width: screenWidth } = Dimensions.get('window');

export const GuestChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
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
  const { isAuthenticated, user } = useAuth();
  
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    setSending(true);
    setInputText('');
    
    try {
      await sendMessage(inputText.trim());
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };


  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.role === 'user';
    
    if (item.isLoading) {
      return (
        <View style={[styles.messageContainer, styles.assistantMessage]}>
          <ActivityIndicator size="small" color="#2563eb" />
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
          iconColor="#6b7280"
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
                  iconColor="#6b7280"
                />
                <IconButton
                  icon="delete"
                  size={18}
                  onPress={() => deleteChat(item.id)}
                  iconColor="#6b7280"
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Setting up your chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Drawer
      open={drawerOpen}
      drawerWidth={Math.min(screenWidth * 0.8, 300)}
      drawerPosition="left"
      renderDrawerContent={renderDrawerContent}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      swipeEnabled={true}
      drawerType="slide"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="format-list-bulleted"
            size={24}
            onPress={() => setDrawerOpen(true)}
            iconColor="#6b7280"
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
            iconColor="#6b7280"
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

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message... e.g. I have an allergy, what should I do?"
              multiline
              maxHeight={100}
              disabled={sending}
              onSubmitEditing={handleSendMessage}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#4f46e5"
            />
            <IconButton
              icon="send"
              size={24}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || sending}
              iconColor="#4f46e5"
              style={styles.sendButton}
            />
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
                    {!isAuthenticated && (
                      <>
                        <TouchableOpacity
                          style={styles.mainMenuItem}
                          onPress={() => {
                            setShowMainMenu(false);
                            navigation.navigate('Auth' as never);
                          }}
                        >
                          <Text style={styles.mainMenuItemText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.mainMenuItem}
                          onPress={() => {
                            setShowMainMenu(false);
                            navigation.navigate('Auth' as never, { screen: 'Register' });
                          }}
                        >
                          <Text style={styles.mainMenuItemText}>Register</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {isAuthenticated && (
                      <TouchableOpacity
                        style={styles.mainMenuItem}
                        onPress={() => {
                          setShowMainMenu(false);
                          navigation.navigate('Profile' as never);
                        }}
                      >
                        <Text style={styles.mainMenuItemText}>Profile</Text>
                      </TouchableOpacity>
                    )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 4,
  },
  headerTitle: {
    flex: 1,
    color: '#111827',
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
    color: '#6b7280',
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
    backgroundColor: '#e5e7eb',
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
    color: '#1f2937',
  },
  userMessageText: {
    color: '#1f2937',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    margin: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  welcomeTitle: {
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  newChatButton: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#4f46e5',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  chatItemContent: {
    flex: 1,
  },
  chatItemTitle: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  chatItemTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  chatItemActions: {
    flexDirection: 'row',
  },
  activeChatItem: {
    backgroundColor: '#f3f4f6',
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  signInButton: {
    paddingVertical: 8,
  },
  mainMenuContent: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  mainMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  mainMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mainMenuItemText: {
    fontSize: 16,
    color: '#ffffff',
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