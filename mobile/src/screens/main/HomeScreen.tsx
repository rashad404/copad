import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Welcome back, {user?.username || 'User'}!
        </Text>

        <Card style={styles.card}>
          <Card.Title title="Start a New Chat" />
          <Card.Content>
            <Text variant="bodyMedium">
              Begin a conversation with our AI assistant
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Chat' as never)}
            >
              Start Chatting
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Your Recent Activity" />
          <Card.Content>
            <Text variant="bodyMedium">
              View your chat history and continue previous conversations
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Quick Actions" />
          <Card.Content>
            <View style={styles.quickActions}>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={() => navigation.navigate('Profile' as never)}
              >
                View Profile
              </Button>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={() => navigation.navigate('Chat' as never)}
              >
                New Chat
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
  },
  greeting: {
    marginBottom: 24,
    color: '#111827',
  },
  card: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 0.48,
  },
});