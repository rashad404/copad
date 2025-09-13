import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useChat } from '../contexts/ChatContext';

export const DebugPanel: React.FC = () => {
  const { chats, currentChat, messages, guestSessionId, refreshChats } = useChat();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Panel</Text>
      
      <Text style={styles.section}>Session ID: {guestSessionId || 'None'}</Text>
      
      <Text style={styles.section}>Current Chat:</Text>
      <Text style={styles.data}>{JSON.stringify(currentChat, null, 2)}</Text>
      
      <Text style={styles.section}>All Chats ({chats.length}):</Text>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.data}>{JSON.stringify(chats, null, 2)}</Text>
      </ScrollView>
      
      <Text style={styles.section}>Messages ({messages.length}):</Text>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.data}>{JSON.stringify(messages, null, 2)}</Text>
      </ScrollView>
      
      <TouchableOpacity style={styles.button} onPress={refreshChats}>
        <Text style={styles.buttonText}>Refresh Chats</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 10,
    zIndex: 1000,
  },
  title: {
    color: '#00ff00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    color: '#00ff00',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  data: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  scrollView: {
    maxHeight: 60,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#00ff00',
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});