import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  Card,
  ActivityIndicator,
  FAB,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { chatService } from '../../services/chatService';
import { ChatSession, ChatMessage } from '../../types';

export const ChatScreen: React.FC = () => {
  const { user, guestSessionId } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadMessages();
    }
  }, [currentSession]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const sessionList = await chatService.getChatSessions(guestSessionId || undefined);
      setSessions(sessionList);
      
      // If no current session and sessions exist, select the first one
      if (!currentSession && sessionList.length > 0) {
        setCurrentSession(sessionList[0]);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!currentSession) return;
    
    try {
      setLoading(true);
      const session = await chatService.getChatSession(currentSession.id);
      setMessages(session.messages || []);
      // Scroll to bottom after loading messages
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!newChatTitle.trim()) {
      Alert.alert('Error', 'Please enter a chat title');
      return;
    }

    try {
      const newSession = await chatService.createChatSession(
        newChatTitle.trim(),
        guestSessionId || undefined
      );
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
      setMessages([]);
      setNewChatTitle('');
      setShowNewChatDialog(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create new chat');
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !currentSession) return;

    const userMessage: ChatMessage = {
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    const tempMessages = [...messages, userMessage];
    setMessages(tempMessages);
    setInputText('');
    setSending(true);

    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Add a loading message for the assistant
    const loadingMessage: ChatMessage = {
      content: '',
      role: 'assistant',
      isLoading: true,
      timestamp: new Date().toISOString(),
    };
    setMessages([...tempMessages, loadingMessage]);

    try {
      let assistantContent = '';
      const response = await chatService.sendMessage(
        currentSession.id,
        userMessage.content,
        (chunk) => {
          // Handle streaming response
          assistantContent += chunk;
          const updatedMessages = [
            ...tempMessages,
            {
              content: assistantContent,
              role: 'assistant' as const,
              timestamp: new Date().toISOString(),
              isLoading: false,
            },
          ];
          setMessages(updatedMessages);
        }
      );

      // If no streaming, update with final response
      if (!assistantContent) {
        setMessages([...tempMessages, response]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
      // Remove loading message on error
      setMessages(tempMessages);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
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
        <Text style={styles.timestamp}>
          {new Date(item.timestamp || '').toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  const renderSessionItem = (session: ChatSession) => (
    <Card
      style={[
        styles.sessionCard,
        currentSession?.id === session.id && styles.activeSessionCard,
      ]}
      onPress={() => setCurrentSession(session)}
    >
      <Card.Content>
        <Text
          variant="bodyMedium"
          style={[
            styles.sessionTitle,
            currentSession?.id === session.id && styles.activeSessionTitle,
          ]}
        >
          {session.title}
        </Text>
        <Text variant="bodySmall" style={styles.sessionDate}>
          {new Date(session.updatedAt).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  if (!currentSession && sessions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text variant="headlineMedium" style={styles.emptyTitle}>
            No Chats Yet
          </Text>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Start a new conversation to begin
          </Text>
          <Button
            mode="contained"
            onPress={() => setShowNewChatDialog(true)}
            style={styles.newChatButton}
          >
            Start New Chat
          </Button>
        </View>
        
        <Portal>
          <Dialog visible={showNewChatDialog} onDismiss={() => setShowNewChatDialog(false)}>
            <Dialog.Title>New Chat</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Chat Title"
                value={newChatTitle}
                onChangeText={setNewChatTitle}
                placeholder="Enter a title for this chat"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowNewChatDialog(false)}>Cancel</Button>
              <Button onPress={createNewChat}>Create</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        {/* Sessions sidebar */}
        <View style={styles.sessionsContainer}>
          <View style={styles.sessionsHeader}>
            <Text variant="titleMedium">Chats</Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => setShowNewChatDialog(true)}
            />
          </View>
          <FlatList
            data={sessions}
            renderItem={({ item }) => renderSessionItem(item)}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.sessionsList}
          />
        </View>

        {/* Chat area */}
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          {loading && messages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => `${item.id || index}`}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type a message..."
                  multiline
                  disabled={sending}
                  onSubmitEditing={sendMessage}
                />
                <IconButton
                  icon="send"
                  size={24}
                  onPress={sendMessage}
                  disabled={!inputText.trim() || sending}
                  iconColor="#2563eb"
                />
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>

      <Portal>
        <Dialog visible={showNewChatDialog} onDismiss={() => setShowNewChatDialog(false)}>
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Chat Title"
              value={newChatTitle}
              onChangeText={setNewChatTitle}
              placeholder="Enter a title for this chat"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowNewChatDialog(false)}>Cancel</Button>
            <Button onPress={createNewChat}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sessionsContainer: {
    width: 120,
    backgroundColor: '#e5e7eb',
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
  },
  sessionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  sessionsList: {
    padding: 8,
  },
  sessionCard: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  activeSessionCard: {
    backgroundColor: '#2563eb',
  },
  sessionTitle: {
    color: '#111827',
  },
  activeSessionTitle: {
    color: '#fff',
  },
  sessionDate: {
    color: '#6b7280',
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
  },
  messageText: {
    color: '#111827',
  },
  userMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#f9fafb',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  newChatButton: {
    paddingHorizontal: 24,
  },
});